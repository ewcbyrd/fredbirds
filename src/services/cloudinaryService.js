// Cloudinary image service
const CLOUD_NAME = 'doqy8jape'
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`

// Helper function to build Cloudinary URLs
export const getCloudinaryUrl = (publicId, transformations = '') => {
  const transformPart = transformations ? `/${transformations}` : ''
  return `${BASE_URL}${transformPart}/${publicId}`
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