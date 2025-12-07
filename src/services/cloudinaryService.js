// Cloudinary image service
const getCloudinaryConfig = () => {
  // Use environment variable if available (from .env.local in dev, from Heroku secrets in production)
  // Otherwise fall back to hardcoded default
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'doqy8jape'
  return {
    cloudName,
    baseUrl: `https://res.cloudinary.com/${cloudName}/image/upload`,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`
  }
}

// Helper function to build Cloudinary URLs
export const getCloudinaryUrl = (publicId, transformations = '') => {
  const { baseUrl } = getCloudinaryConfig()
  const transformPart = transformations ? `/${transformations}` : ''
  return `${baseUrl}${transformPart}/${publicId}`
}

// Upload image to Cloudinary
export const uploadToCloudinary = async (file, folder = 'photos') => {
  if (!file) throw new Error('No file provided')
  
  // Validate file type
  const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  if (!validTypes.includes(file.type)) {
    throw new Error('Invalid file type. Please upload an image (JPEG, PNG, GIF, or WebP).')
  }
  
  // Validate file size (5MB max)
  const maxSize = 5 * 1024 * 1024
  if (file.size > maxSize) {
    throw new Error('File size exceeds 5MB limit')
  }

  // Check if upload preset is configured
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
  const { cloudName, uploadUrl } = getCloudinaryConfig()
  
  if (!uploadPreset) {
    console.error('Cloudinary configuration:', {
      VITE_CLOUDINARY_UPLOAD_PRESET: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET,
      VITE_CLOUDINARY_CLOUD_NAME: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
      configuredCloudName: cloudName
    })
    throw new Error('Photo upload is not configured. Please ensure VITE_CLOUDINARY_UPLOAD_PRESET is set in environment variables or .env.local.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', uploadPreset)
  formData.append('folder', folder)
  
  console.log('Uploading to Cloudinary:', {
    cloudName,
    uploadPreset,
    folder,
    fileName: file.name,
    fileSize: file.size
  })
  
  try {
    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const contentType = response.headers.get('content-type')
      
      if (contentType && contentType.includes('application/json')) {
        const error = await response.json()
        throw new Error(error.error?.message || `Upload failed: ${response.statusText}`)
      } else {
        // If not JSON, likely an HTML error page
        const text = await response.text()
        console.error('Non-JSON error response:', text.substring(0, 500))
        
        if (text.includes('<!DOCTYPE')) {
          throw new Error(`Cloudinary API error (${response.status}). Your upload preset "${uploadPreset}" may not exist or may be misconfigured. Please verify it in your Cloudinary dashboard at https://cloudinary.com/console/settings/upload`)
        }
        throw new Error(`Upload failed: ${response.statusText}`)
      }
    }
    
    const data = await response.json()
    console.log('Upload successful:', data.public_id)
    
    return {
      publicId: data.public_id,
      url: data.secure_url,
      width: data.width,
      height: data.height,
      size: data.bytes
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

// Removed obsolete imageMap and getImageUrl - now using database-driven approach

// Pre-defined transformations for common use cases
export const transformations = {
  thumbnail: 'w_300,h_300,c_fill',
  medium: 'w_800,h_600,c_fit',
  hero: 'w_1200,h_800,c_fill',
  optimized: 'f_auto,q_auto'
}

// Helper to convert database picture values to Cloudinary URLs
export const getPictureUrl = (pictureValue, transformation = transformations.optimized) => {
  if (!pictureValue) return null
  
  // If it's already a full URL, return as-is
  if (pictureValue.startsWith('http')) return pictureValue
  
  // Handle legacy values
  if (pictureValue === 'imgScott') return getCloudinaryUrl('scott_byrd', transformation)
  
  // Assume it's a Cloudinary public ID
  return getCloudinaryUrl(pictureValue, transformation)
}