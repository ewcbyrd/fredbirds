// Image service: Azure Blob storage with metadata-backed gallery

const api = (
    import.meta.env.VITE_API_BASE_URL ||
    'https://fredbirds-api.azurewebsites.net/'
).replace(/\/?$/, '/')

const getAzureBlobBaseUrl = () =>
    (
        import.meta.env.VITE_AZURE_BLOB_BASE_URL ||
        'https://fredbirdsphotos.blob.core.windows.net'
    ).replace(/\/$/, '')

const AZURE_CONTAINERS = ['club-photos', 'event-photos', 'static']

// Hardcoded / legacy Cloudinary IDs remapped during bulk migration
const LEGACY_IMAGE_IDS = {
    'Group.jpg': 'static/d80cff948fa521079dbf77af935f8022',
    'vso.png': 'static/0fbd392330691bdd120773abc6a561df',
    scott_byrd: 'static/b070b966ac6fc1f34b15116d71682fdd',
    'scott_byrd.jpg': 'static/26ac5c2564e3a9e173579b28816596b8',
    imgScott: 'static/b070b966ac6fc1f34b15116d71682fdd'
}

/**
 * Size presets. Azure values are variant file names; legacy Cloudinary transform strings map too.
 */
export const transformations = {
    thumbnail: 'w_300,h_300,c_fill',
    medium: 'w_800,h_600,c_fit',
    hero: 'w_1200,h_800,c_fill',
    optimized: 'f_auto,q_auto'
}

const AZURE_VARIANTS = {
    thumbnail: 'thumbnail',
    medium: 'medium',
    hero: 'hero',
    optimized: 'optimized',
    'w_300,h_300,c_fill': 'thumbnail',
    'w_800,h_600,c_fit': 'medium',
    'w_800,h_600,c_fill': 'medium',
    'w_1200,h_800,c_fill': 'hero',
    'f_auto,q_auto': 'optimized'
}

const isAzureImageId = (publicId) => {
    if (!publicId || typeof publicId !== 'string') return false
    if (publicId.startsWith('http://') || publicId.startsWith('https://')) {
        return publicId.includes('.blob.core.windows.net/')
    }
    return AZURE_CONTAINERS.some(
        (container) =>
            publicId === container || publicId.startsWith(`${container}/`)
    )
}

const getAzureUrl = (imageId, transformation = '') => {
    const baseUrl = getAzureBlobBaseUrl()
    if (imageId.startsWith('http://') || imageId.startsWith('https://')) {
        return imageId
    }

    if (
        imageId.includes('/original.') ||
        /\.(webp|jpe?g|png|gif)$/i.test(imageId)
    ) {
        return `${baseUrl}/${imageId}`
    }

    const slash = imageId.indexOf('/')
    if (slash <= 0) {
        return `${baseUrl}/${imageId}`
    }

    const container = imageId.slice(0, slash)
    const id = imageId.slice(slash + 1)
    const variant =
        AZURE_VARIANTS[transformation] ||
        (transformation ? null : 'optimized') ||
        'optimized'

    if (variant === 'original') {
        return `${baseUrl}/${container}/${id}/original.jpg`
    }

    return `${baseUrl}/${container}/${id}/${variant}.webp`
}

/**
 * Build a display URL for an image id (Azure blob key).
 */
export const getCloudinaryUrl = (publicId, transformationsStr = '') => {
    if (!publicId) return null
    const resolvedId = LEGACY_IMAGE_IDS[publicId] || publicId
    if (isAzureImageId(resolvedId)) {
        return getAzureUrl(resolvedId, transformationsStr)
    }
    // Legacy Cloudinary fallback during transition
    const cloudName =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'doqy8jape'
    const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`
    const transformPart = transformationsStr ? `/${transformationsStr}` : ''
    return `${baseUrl}${transformPart}/${resolvedId}`
}

/**
 * Convert database picture values to display URLs.
 */
export const getPictureUrl = (
    pictureValue,
    transformation = transformations.optimized
) => {
    if (!pictureValue) return null
    if (pictureValue.startsWith('http')) return pictureValue
    return getCloudinaryUrl(pictureValue, transformation)
}

/**
 * Single multipart upload to API (blob + metadata, no Mongo photo doc).
 * @param {File} file
 * @param {object} options
 * @param {string} options.accessToken
 * @param {string} [options.eventId] if set, uploads as event photo
 * @param {string} [options.header]
 * @param {string} [options.title]
 * @param {string} [options.description]
 * @param {string} [options.category]
 * @param {string} [options.contributor]
 * @param {string} [options.location]
 * @param {string} [options.photoDate]
 */
export const uploadPhoto = async (file, options = {}) => {
    if (!file) throw new Error('No file provided')

    const {
        accessToken,
        eventId,
        header,
        title,
        description,
        category,
        contributor,
        location,
        photoDate
    } = options

    if (!accessToken) {
        throw new Error(
            'An Auth0 token is required to upload photos. Please log in again.'
        )
    }

    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (!validTypes.includes(file.type)) {
        throw new Error(
            'Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).'
        )
    }

    const maxSize = 10 * 1024 * 1024
    if (file.size > maxSize) {
        throw new Error('File size exceeds 10MB limit')
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('header', header || title || file.name.split('.')[0] || 'Photo')
    if (description) formData.append('description', description)
    if (category) formData.append('category', category)
    if (contributor) formData.append('contributor', contributor)
    if (location) formData.append('location', location)
    if (photoDate) formData.append('photoDate', photoDate)

    const url = eventId
        ? `${api}events/${eventId}/photos/upload`
        : `${api}photos/upload`

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${accessToken}`
        },
        body: formData
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(
            `Upload failed (${response.status}): ${text || response.statusText}`
        )
    }

    const data = await response.json()
    const imageId = data.imageId || data.cloudinary_public_id || data.photo?.imageId

    return {
        publicId: imageId,
        imageId,
        url: getAzureUrl(imageId, 'optimized'),
        width: data.width ?? null,
        height: data.height ?? null,
        size: data.size ?? file.size,
        ...data
    }
}

/** @deprecated use uploadPhoto */
export const uploadToCloudinary = async (file, folder = 'photos', accessToken) => {
    const eventId = null
    // folder retained for call-site compat; event uploads should use uploadPhoto with eventId
    if (folder === 'event_photos') {
        throw new Error(
            'uploadToCloudinary no longer supports event_photos; use uploadPhoto({ eventId })'
        )
    }
    return uploadPhoto(file, { accessToken })
}

export default {
    getCloudinaryUrl,
    getPictureUrl,
    uploadPhoto,
    uploadToCloudinary,
    transformations
}
