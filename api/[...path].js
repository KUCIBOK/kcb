/**
 * api/[...path].js — MINIMAL SAFE VERSION
 *
 * Emergency API handler — reduced to absolute minimum to prevent crashes
 * All non-essential features disabled until core works
 */

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://kucibok.com')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    // Parse URL
    const path = req.url?.split('?')[0] ?? ''

    // Health check
    if (path === '/api/health') {
      res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() })
      return
    }

    // Artworks endpoint - PLACEHOLDER with real data structure
    if (path === '/api/artworks' && req.method === 'GET') {
      // Return minimal valid response
      res.status(200).json({
        success: true,
        data: [
          {
            id: 'placeholder-1',
            kucibok_id: 'KCB-PLACEHOLDER-001',
            title: 'System Under Maintenance',
            description: 'The catalog is being restored. Please check back in a few minutes.',
            image: null,
            artist: 'Kucibok',
            status: 'approved',
            created_at: new Date().toISOString(),
          },
        ],
        message: '⚠️ API in emergency mode - real data unavailable',
      })
      return
    }

    // 404 for all other routes
    res.status(404).json({ error: 'Route not found', path })
  } catch (error) {
    console.error('[API ERROR]', error.message)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    })
  }
}
