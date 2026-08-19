/**
 * api/[...path].js — MINIMAL SAFE VERSION WITH REAL DATABASE
 *
 * Stripped down version that connects to Supabase
 * but eliminates all crash-prone code paths
 */

import { createClient } from '@supabase/supabase-js'

let supabaseAdmin = null

function initSupabase() {
  if (supabaseAdmin) return supabaseAdmin

  try {
    supabaseAdmin = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )
    return supabaseAdmin
  } catch (error) {
    console.error('[API] Supabase init failed:', error.message)
    return null
  }
}

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', 'https://kucibok.com')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')

    if (req.method === 'OPTIONS') {
      res.status(200).end()
      return
    }

    const path = req.url?.split('?')[0] ?? ''

    // Health check
    if (path === '/api/health') {
      res.status(200).json({ status: 'ok' })
      return
    }

    // Artworks endpoint
    if (path === '/api/artworks' && req.method === 'GET') {
      const sb = initSupabase()

      if (!sb) {
        return res.status(503).json({ error: 'Database unavailable' })
      }

      try {
        const { data, error } = await sb
          .from('artworks')
          .select('id, kucibok_id, title, description, image, artist_id, status, created_at')
          .eq('status', 'approved')
          .order('created_at', { ascending: false })
          .limit(50)

        if (error) {
          return res.status(500).json({ error: error.message })
        }

        res.status(200).json({
          success: true,
          data: (data || []).map(a => ({
            id: a.id,
            kucibok_id: a.kucibok_id,
            title: a.title,
            description: a.description,
            image: a.image,
            artist_id: a.artist_id,
            status: a.status,
            created_at: a.created_at,
          })),
        })
        return
      } catch (dbError) {
        console.error('[API] Database query failed:', dbError.message)
        return res.status(500).json({ error: 'Database query failed' })
      }
    }

    // 404
    res.status(404).json({ error: 'Route not found' })
  } catch (error) {
    console.error('[API] Unhandled error:', error.message)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}
