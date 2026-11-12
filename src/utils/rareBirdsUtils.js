// Utility functions for rare birds functionality

/**
 * Get cached rare birds data from session storage
 * @returns {Array} Array of rare bird records
 */
export const getCachedRareBirds = () => {
  try {
    const cached = sessionStorage.getItem('rareBirds')
    return cached ? JSON.parse(cached) : []
  } catch (error) {
    console.error('Failed to retrieve rare birds from session storage:', error)
    return []
  }
}

/**
 * Check if a bird is rare based on its scientific name
 * @param {string} scientificName - The scientific name of the bird to check
 * @returns {boolean} True if the bird is rare, false otherwise
 */
export const isRareBird = (scientificName) => {
  if (!scientificName) return false
  
  const rareBirds = getCachedRareBirds()
  return rareBirds.some(rareBird => 
    rareBird['Scientific Name'] && 
    rareBird['Scientific Name'].toLowerCase() === scientificName.toLowerCase()
  )
}