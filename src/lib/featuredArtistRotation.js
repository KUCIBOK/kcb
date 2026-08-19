/**
 * Featured Artist Rotation System
 * Rotates featured artists weekly (every Monday)
 * Each week highlights a different artist's works on the Global portal hero
 */

// List of featured artists - add/remove as needed
// Rotation every 12 weeks (3 months cycle)
const FEATURED_ARTISTS = [
  { name: 'Gaetan', weeks: [0, 2, 4, 6, 8, 10] }, // Even weeks
  { name: 'Abel-Toh', weeks: [1, 3, 5, 7, 9, 11] }, // Odd weeks
  // Add more artists here to extend the rotation
  // { name: 'Artist Name', weeks: [2, 5, 8, 11] },
  // { name: 'Another Artist', weeks: [3, 6, 9] },
]

/**
 * Get the current featured artist for this week
 * Rotates every Monday at 00:00 UTC
 * @returns {string | null} Featured artist name or null if none scheduled for this week
 */
export function getCurrentFeaturedArtist() {
  const now = new Date()

  // Get week number since epoch (Monday-based)
  const onejan = new Date(now.getFullYear(), 0, 1)
  const millisecsInDay = 86400000
  const weekNumber = Math.ceil((((now - onejan) / millisecsInDay) + onejan.getDay()) / 7)

  // Find artist scheduled for this week
  const artist = FEATURED_ARTISTS.find((a) => a.weeks.includes(weekNumber % 12))
  return artist?.name || null
}

/**
 * Get week number for date calculation
 * Used to ensure consistency across timezones
 */
export function getWeekNumber(date = new Date()) {
  const onejan = new Date(date.getFullYear(), 0, 1)
  const millisecsInDay = 86400000
  return Math.ceil((((date - onejan) / millisecsInDay) + onejan.getDay()) / 7)
}

/**
 * Check if an artwork belongs to the featured artist
 * @param {Object} artwork - Artwork object
 * @param {string} featuredArtistName - Featured artist name
 * @returns {boolean}
 */
export function isFromFeaturedArtist(artwork, featuredArtistName) {
  if (!artwork || !featuredArtistName) return false
  return artwork.artist?.toLowerCase() === featuredArtistName.toLowerCase()
}

/**
 * Sort artworks to prioritize featured artist
 * Featured artist works come first, then all others
 * @param {Array} artworks - Array of artwork objects
 * @param {string} featuredArtistName - Featured artist name
 * @returns {Array} Sorted artworks with featured artist first
 */
export function prioritizeFeaturedArtist(artworks, featuredArtistName) {
  if (!Array.isArray(artworks) || !featuredArtistName) {
    return artworks
  }

  const featured = artworks.filter((a) => isFromFeaturedArtist(a, featuredArtistName))
  const others = artworks.filter((a) => !isFromFeaturedArtist(a, featuredArtistName))

  return [...featured, ...others]
}
