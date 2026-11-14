// Azure Blob image service (URLs + multipart upload)

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

// Hardcoded assets remapped during Cloudinary → Azure migration
const LEGACY_IMAGE_IDS = {
    'Group.jpg': 'static/d80cff948fa521079dbf77af935f8022',
    'vso.png': 'static/0fbd392330691bdd120773abc6a561df',
    scott_byrd: 'static/b070b966ac6fc1f34b15116d71682fdd',
    'scott_byrd.jpg': 'static/26ac5c2564e3a9e173579b28816596b8',
    imgScott: 'static/b070b966ac6fc1f34b15116d71682fdd'
}

export const transformations = {
    thumbnail: 'thumbnail',
    medium: 'medium',
    hero: 'hero',
    optimized: 'optimized'
}

const VARIANT_ALIASES = {
    thumbnail: 'thumbnail',
    medium: 'medium',
    hero: 'hero',
    optimized: 'optimized',
    // legacy Cloudinary transform strings still used by some call sites
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

/**
 * Build a display URL for an Azure image id.
 */
export const getImageUrl = (publicId, variantOrTransform = 'optimized') => {
    if (!publicId) return null
    const resolvedId = LEGACY_IMAGE_IDS[publicId] || publicId

    if (resolvedId.startsWith('http://') || resolvedId.startsWith('https://')) {
        return resolvedId
    }

    if (!isAzureImageId(resolvedId)) {
        console.warn('Unknown image id (expected Azure blob path):', resolvedId)
        return null
    }

    const baseUrl = getAzureBlobBaseUrl()
    if (
        resolvedId.includes('/original.') ||
        /\.(webp|jpe?g|png|gif)$/i.test(resolvedId)
    ) {
        return `${baseUrl}/${resolvedId}`
    }

    const slash = resolvedId.indexOf('/')
    const container = resolvedId.slice(0, slash)
    const id = resolvedId.slice(slash + 1)
    const variant =
        VARIANT_ALIASES[variantOrTransform] ||
        transformations[variantOrTransform] ||
        'optimized'

    if (variant === 'original') {
        return `${baseUrl}/${container}/${id}/original.jpg`
    }

    return `${baseUrl}/${container}/${id}/${variant}.webp`
}

export const getPictureUrl = (
    pictureValue,
    transformation = transformations.optimized
) => {
    if (!pictureValue) return null
    if (pictureValue.startsWith('http')) return pictureValue
    return getImageUrl(pictureValue, transformation)
}

/**
 * Single multipart upload (blob + metadata).
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
    formData.append(
        'header',
        header || title || file.name.split('.')[0] || 'Photo'
    )
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
    const imageId =
        data.imageId || data.cloudinary_public_id || data.photo?.imageId

    return {
        publicId: imageId,
        imageId,
        url: getImageUrl(imageId, 'optimized'),
        width: data.width ?? null,
        height: data.height ?? null,
        size: data.size ?? file.size,
        ...data
    }
}

const requireAccessToken = (accessToken) => {
    if (!accessToken) {
        throw new Error(
            'An Auth0 token is required to manage photos. Please log in again.'
        )
    }
}

const parseImageIdParts = (imageId) => {
    if (!imageId || typeof imageId !== 'string') {
        throw new Error('imageId is required')
    }
    const parts = imageId.split('/').filter(Boolean)
    if (parts[0] === 'club-photos' && parts.length >= 2) {
        return {
            kind: 'club',
            container: parts[0],
            photoId: parts.slice(1).join('/'),
            eventId: null,
            imageId
        }
    }
    if (parts[0] === 'event-photos' && parts.length >= 3) {
        return {
            kind: 'event',
            container: parts[0],
            eventId: parts[1],
            photoId: parts[2],
            imageId
        }
    }
    throw new Error(`Unsupported imageId for photo management: ${imageId}`)
}

/**
 * Update photo metadata (club or event) without replacing the image file.
 */
export const updatePhotoMetadata = async (
    imageId,
    fields = {},
    options = {}
) => {
    const { accessToken } = options
    requireAccessToken(accessToken)

    const parts = parseImageIdParts(imageId)
    const {
        header,
        title,
        description,
        category,
        contributor,
        location,
        photoDate,
        photodate,
        carousel
    } = fields

    let url
    let body

    if (parts.kind === 'club') {
        url = `${api}photos/${parts.container}/${parts.photoId}`
        body = {
            header: header ?? title,
            description,
            category,
            contributor,
            location,
            photoDate: photoDate ?? photodate,
            carousel
        }
    } else {
        url = `${api}events/${parts.eventId}/photos`
        body = {
            imageId: parts.imageId,
            header: header ?? title,
            description,
            contributor,
            location,
            photoDate: photoDate ?? photodate
        }
    }

    // Drop undefined keys so PATCH merge does not wipe omitted fields
    Object.keys(body).forEach((key) => {
        if (body[key] === undefined) delete body[key]
    })

    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })

    if (!response.ok) {
        const text = await response.text()
        throw new Error(
            `Update failed (${response.status}): ${text || response.statusText}`
        )
    }

    return response.json()
}

/**
 * Delete a club or event photo (all blob variants).
 */
export const deletePhoto = async (imageId, options = {}) => {
    const { accessToken, eventId: eventIdOption } = options
    requireAccessToken(accessToken)

    const parts = parseImageIdParts(imageId)
    let url
    let fetchOptions

    if (parts.kind === 'club') {
        url = `${api}photos/${parts.container}/${parts.photoId}`
        fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }
    } else {
        const eventId = eventIdOption || parts.eventId
        url = `${api}events/${eventId}/photos`
        fetchOptions = {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ imageId: parts.imageId })
        }
    }

    const response = await fetch(url, fetchOptions)

    if (!response.ok) {
        const text = await response.text()
        throw new Error(
            `Delete failed (${response.status}): ${text || response.statusText}`
        )
    }

    return response.json()
}

export default {
    getImageUrl,
    getPictureUrl,
    uploadPhoto,
    updatePhotoMetadata,
    deletePhoto,
    transformations
}
