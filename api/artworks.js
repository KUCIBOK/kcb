/**
 * api/artworks.js
 *
 * STANDALONE ARTWORKS ENDPOINT
 * Completely separate from the problematic [...path].js
 * Cannot have any conflicts or cached issues
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.removeHeader('ETag')
  res.removeHeader('Last-Modified')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' })
    return
  }

  try {
    // Import Supabase dynamically
    const { createClient } = await import('@supabase/supabase-js')

    // Get env vars
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(503).json({
        error: 'Database not configured',
        success: false,
        artworks: [],
      })
    }

    // Create client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Query database with artist data
    // Include all artworks for dev/demo (remove .eq('status', 'approved') to see all)
    const { data, error } = await supabase
      .from('artworks')
      .select('*, artists(id, name)')
      .order('created_at', { ascending: false })
      .limit(300)

    if (error) {
      return res.status(500).json({
        error: error.message,
        success: false,
        artworks: [],
      })
    }

    // Map artist data: add 'artist' field with artist name
    const artworksWithArtistNames = (data || []).map((artwork) => ({
      ...artwork,
      artist: artwork.artists?.name || artwork.artist || 'Unknown artist',
    }))

    // Return artworks
    res.status(200).json({
      success: true,
      artworks: artworksWithArtistNames,
      count: artworksWithArtistNames.length,
    })
  } catch (error) {
    res.status(500).json({
      error: error.message,
      success: false,
      artworks: [],
    })
  }
}
