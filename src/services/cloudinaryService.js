// Image service: Azure Blob (new uploads) with Cloudinary dual-read for existing assets

const api = 'https://fredbirds-api.azurewebsites.net/'

const getCloudinaryConfig = () => {
    const cloudName =
        import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'doqy8jape'
    return {
        cloudName,
        baseUrl: `https://res.cloudinary.com/${cloudName}/image/upload`
    }
}

const getAzureBlobBaseUrl = () =>
    (
        import.meta.env.VITE_AZURE_BLOB_BASE_URL ||
        'https://fredbirdsphotos.blob.core.windows.net'
    ).replace(/\/$/, '')

const AZURE_CONTAINERS = ['club-photos', 'event-photos', 'static']

/**
 * Size presets. Azure values are variant file names; Cloudinary values are transforms.
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

    // Full blob path already includes file name
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

const getLegacyCloudinaryUrl = (publicId, transformationsStr = '') => {
    const { baseUrl } = getCloudinaryConfig()
    const transformPart = transformationsStr ? `/${transformationsStr}` : ''
    return `${baseUrl}${transformPart}/${publicId}`
}

/**
 * Build a display URL for an image id (Azure blob key or Cloudinary public id).
 */
export const getCloudinaryUrl = (publicId, transformationsStr = '') => {
    if (!publicId) return null
    if (isAzureImageId(publicId)) {
        return getAzureUrl(publicId, transformationsStr)
    }
    return getLegacyCloudinaryUrl(publicId, transformationsStr)
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
    if (pictureValue === 'imgScott') {
        return getCloudinaryUrl('scott_byrd', transformation)
    }
    return getCloudinaryUrl(pictureValue, transformation)
}

const authHeaders = (accessToken) => {
    if (!accessToken) {
        throw new Error(
            'An Auth0 token is required to upload photos. Please log in again.'
        )
    }
    return {
        'content-type': 'application/json',
        Authorization: `Bearer ${accessToken}`
    }
}

/**
 * Upload an image to Azure Blob via API SAS + finalize variants.
 * @param {File} file
 * @param {string} folder club_photos | event_photos | static
 * @param {string} accessToken Auth0 ID token (or API access token)
 * @returns {Promise<{publicId: string, url: string, width: number|null, height: number|null, size: number|null}>}
 */
export const uploadToCloudinary = async (
    file,
    folder = 'photos',
    accessToken
) => {
    if (!file) throw new Error('No file provided')

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

    const sasRes = await fetch(`${api}uploads/sas`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({
            folder,
            contentType: file.type,
            fileName: file.name
        })
    })

    if (!sasRes.ok) {
        const text = await sasRes.text()
        throw new Error(
            `Failed to start upload (${sasRes.status}): ${text || sasRes.statusText}`
        )
    }

    const sas = await sasRes.json()

    const putRes = await fetch(sas.uploadUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': file.type,
            'x-ms-blob-type': 'BlockBlob'
        },
        body: file
    })

    if (!putRes.ok) {
        const text = await putRes.text()
        throw new Error(
            `Blob upload failed (${putRes.status}): ${text || putRes.statusText}`
        )
    }

    const finalizeRes = await fetch(`${api}uploads/finalize`, {
        method: 'POST',
        headers: authHeaders(accessToken),
        body: JSON.stringify({ imageId: sas.imageId })
    })

    if (!finalizeRes.ok) {
        const text = await finalizeRes.text()
        throw new Error(
            `Failed to process image (${finalizeRes.status}): ${text || finalizeRes.statusText}`
        )
    }

    const finalized = await finalizeRes.json()

    return {
        publicId: sas.imageId,
        url: getAzureUrl(sas.imageId, 'optimized'),
        width: finalized.width ?? null,
        height: finalized.height ?? null,
        size: finalized.size ?? file.size
    }
}

export default {
    getCloudinaryUrl,
    getPictureUrl,
    uploadToCloudinary,
    transformations
}
