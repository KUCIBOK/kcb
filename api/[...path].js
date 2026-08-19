/**
 * api/[...path].js — PRODUCTION SAFE VERSION
 *
 * CRITICAL FIX: No env var validation at startup
 * No imports that can fail at load time
 * Ultra-safe error handling everywhere
 */

export default async function handler(req, res) {
  // Lazy imports inside handler to prevent startup crashes
  let supabaseAdmin = null

  try {
    // CORS first
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    const path = req.url?.split('?')[0] ?? ''

    // ========== HEALTH CHECK ==========
    if (path === '/api/health') {
      res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
      })
      return
    }

    // ========== ARTWORKS ENDPOINT ==========
    if (path === '/api/artworks' && req.method === 'GET') {
      try {
        // Lazy load Supabase only when needed
        const { createClient } = await import('@supabase/supabase-js')

        const url = process.env.SUPABASE_URL
        const key = process.env.SUPABASE_SERVICE_ROLE_KEY

        if (!url || !key) {
          return res.status(503).json({
            error: 'Database not configured',
            success: false,
          })
        }

        supabaseAdmin = createClient(url, key, {
          auth: { autoRefreshToken: false, persistSession: false },
        })

        // Query artworks
        const { data, error } = await supabaseAdmin
          .from('artworks')
          .select('id, kucibok_id, title, description, image, artist_id, status, created_at')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(100)

        if (error) {
          console.error('[DB ERROR]', error)
          return res.status(500).json({
            error: 'Database query failed',
            success: false,
          })
        }

        return res.status(200).json({
          success: true,
          data: data || [],
          count: (data || []).length,
        })
      } catch (err) {
        console.error('[ARTWORKS ERROR]', err.message)
        return res.status(500).json({
          error: 'Artworks endpoint failed',
          success: false,
          message: err.message,
        })
      }
    }

    // ========== FALLBACK 404 ==========
    res.status(404).json({
      error: 'Route not found',
      path,
    })
  } catch (error) {
    console.error('[HANDLER ERROR]', error.message)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
    })
  }
}
