/**
 * api/artworks-emergency.js
 * EMERGENCY: Minimal artworks endpoint without any dependencies
 * Used to diagnose if the crash is in [..path].js or elsewhere
 */

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
    
    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    if (req.method !== 'GET') {
      res.status(405).json({ error: 'Method not allowed' })
      return
    }

    // Hardcoded response to verify Vercel can serve data
    res.status(200).json({
      success: true,
      data: [
        {
          id: 'test-1',
          kucibok_id: 'KCB-TEST-001',
          title: 'Test Artwork',
          image: 'https://example.com/image.jpg',
          artist: 'Test Artist',
          status: 'approved',
        },
      ],
      message: '✅ Emergency artworks endpoint working! The crash is in [...path].js',
    })
  } catch (error) {
    res.status(500).json({
      error: 'Emergency endpoint crashed',
      message: error.message,
    })
  }
}
