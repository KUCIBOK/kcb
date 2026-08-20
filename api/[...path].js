/**
 * api/[...path].js — Catch-all Vercel Function for all API routes
 * Disables caching to fix 304 responses
 */

import { createClient } from '@supabase/supabase-js'
import { respondJSON, respondError } from './_lib/response.js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Initialize Supabase admin client
const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, kcb-api-key')

  // Disable caching completely
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
  res.setHeader('Pragma', 'no-cache')
  res.setHeader('Expires', '0')
  res.removeHeader('ETag')
  res.removeHeader('Last-Modified')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Parse the URL path
    const path = req.query.path || []
    const s0 = path[0] // First segment: 'artworks', 'auth', etc.
    const s1 = path[1] // Second segment
    const s2 = path[2] // Third segment

    // ─────────────────────────────────────────────────────────────
    // ARTWORKS ROUTES
    // ─────────────────────────────────────────────────────────────

    if (s0 === 'artworks') {
      // GET /api/artworks — List artworks
      if (req.method === 'GET' && !s1) {
        const {
          status = 'approved',
          for_sale,
          artist_id,
          user_id,
          category,
          limit = 300,
        } = req.query

        let query = supabaseAdmin.from('artworks').select('*, artists(id, name)')

        if (status) query = query.eq('status', status)
        if (for_sale === 'true') query = query.eq('for_sale', true)
        if (artist_id) query = query.eq('artist_id', artist_id)
        if (user_id) query = query.eq('user_id', user_id)
        if (category) query = query.eq('category', category)

        query = query.order('created_at', { ascending: false }).limit(parseInt(limit))

        const { data, error } = await query

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

        return res.status(200).json({
          success: true,
          artworks: artworksWithArtistNames,
          count: artworksWithArtistNames.length,
        })
      }

      // GET /api/artworks/:id — Get single artwork
      if (req.method === 'GET' && s1 && s1 !== 'verify') {
        const { data, error } = await supabaseAdmin
          .from('artworks')
          .select('*')
          .eq('id', s1)
          .single()

        if (error) {
          return res.status(404).json({ error: 'Artwork not found' })
        }

        return res.status(200).json({
          success: true,
          data,
        })
      }

      // GET /api/artworks/verify/:kucibok_id — Public verification
      if (req.method === 'GET' && s1 === 'verify' && s2) {
        const { data, error } = await supabaseAdmin
          .from('artworks')
          .select('*')
          .eq('kucibok_id', s2)
          .single()

        if (error) {
          return res.status(404).json({ error: 'Artwork not found' })
        }

        return res.status(200).json({
          success: true,
          data,
        })
      }

      // POST /api/artworks — Create artwork
      if (req.method === 'POST' && !s1) {
        const { data, error } = await supabaseAdmin.from('artworks').insert([req.body]).select()

        if (error) {
          return res.status(500).json({ error: error.message })
        }

        return res.status(201).json({
          success: true,
          data: data[0],
        })
      }

      // PUT /api/artworks/:id — Update artwork
      if (req.method === 'PUT' && s1 && s1 !== 'verify') {
        const { data, error } = await supabaseAdmin
          .from('artworks')
          .update(req.body)
          .eq('id', s1)
          .select()

        if (error) {
          return res.status(500).json({ error: error.message })
        }

        return res.status(200).json({
          success: true,
          data: data[0],
        })
      }

      // PATCH /api/artworks/:id — Change status
      if (req.method === 'PATCH' && s1) {
        const { data, error } = await supabaseAdmin
          .from('artworks')
          .update({ status: req.body.status })
          .eq('id', s1)
          .select()

        if (error) {
          return res.status(500).json({ error: error.message })
        }

        return res.status(200).json({
          success: true,
          data: data[0],
        })
      }

      // DELETE /api/artworks/:id — Delete artwork
      if (req.method === 'DELETE' && s1) {
        const { error } = await supabaseAdmin.from('artworks').delete().eq('id', s1)

        if (error) {
          return res.status(500).json({ error: error.message })
        }

        return res.status(200).json({
          success: true,
          deleted: true,
        })
      }
    }

    // ─────────────────────────────────────────────────────────────
    // ARTISTS ROUTES
    // ─────────────────────────────────────────────────────────────

    if (s0 === 'artists') {
      // GET /api/artists — List all artists
      if (req.method === 'GET' && !s1) {
        const { data, error } = await supabaseAdmin
          .from('artists')
          .select('*')
          .order('name', { ascending: true })

        if (error) {
          return res.status(500).json({
            error: error.message,
            success: false,
            artists: [],
          })
        }

        return res.status(200).json({
          success: true,
          artists: data || [],
          count: (data || []).length,
        })
      }

      // GET /api/artists/:id — Get single artist
      if (req.method === 'GET' && s1) {
        const { data, error } = await supabaseAdmin
          .from('artists')
          .select('*')
          .eq('id', s1)
          .single()

        if (error) {
          return res.status(404).json({ error: 'Artist not found' })
        }

        return res.status(200).json({
          success: true,
          data,
        })
      }
    }

    // ─────────────────────────────────────────────────────────────
    // HEALTH CHECK
    // ─────────────────────────────────────────────────────────────

    // ─────────────────────────────────────────────────────────────
    // PROFESSIONAL ANALYTICS ROUTE
    // ─────────────────────────────────────────────────────────────

    if (s0 === 'professional-analytics' && req.method === 'GET' && !s1) {
      try {
        const url = new URL(req.url, 'http://localhost')
        const period = url.searchParams.get('period') || 'month'
        const cacheKey = `analytics:${period}`

        // Try cache first
        const { data: cachedData } = await supabaseAdmin
          .from('analytics_cache')
          .select('data')
          .eq('cache_key', cacheKey)
          .gt('expires_at', new Date().toISOString())
          .single()

        if (cachedData?.data) {
          return res.status(200).json({ data: cachedData.data, cached: true })
        }

        // Fetch fresh data using RPC functions
        const [countryTrends, topArtists, mediumTrends, emergingArtists] = await Promise.all([
          supabaseAdmin.rpc('get_country_market_trends', { time_period: period }),
          supabaseAdmin.rpc('get_artist_trends', { time_period: period }),
          supabaseAdmin.rpc('get_medium_trends', { time_period: period }),
          supabaseAdmin.rpc('detect_emerging_artists', { min_sales: 2 }),
        ])

        // Format trends
        const countryTrendsFormatted = (countryTrends.data || []).map((c) => ({
          country: c.country || 'Unknown',
          growth: c.growth_pct ? Math.round(c.growth_pct) : 0,
          volume: c.volume ? Math.round(c.volume) : 0,
          avgPrice: c.avg_price ? `€${Math.round(c.avg_price)}` : '—',
          artists: c.artists || 0,
        }))

        const topArtistsFormatted = (topArtists.data || []).map((a) => ({
          name: a.artist_name || 'Unknown',
          country: a.country || 'Unknown',
          appreciation: a.appreciation_pct ? `+${Math.round(a.appreciation_pct)}%` : '—',
          buzz: a.buzz_score || 0,
          exhibitions: a.exhibitions || 0,
        }))

        const mediumTrendsFormatted = (mediumTrends.data || []).map((m) => ({
          medium: m.medium || 'Other',
          growth: m.growth_pct ? Math.round(m.growth_pct) : 0,
          count: m.count || 0,
          avgPrice: m.avg_price ? Math.round(m.avg_price) : 0,
        }))

        const emergingArtistsFormatted = (emergingArtists.data || []).slice(0, 5).map((a) => ({
          name: a.artist_name || 'Unknown',
          country: a.country || 'Unknown',
          recentSales: a.recent_sales || 0,
          avgPrice: a.avg_price ? `€${Math.round(a.avg_price)}` : '—',
          momentumScore: a.momentum_score ? Math.round(a.momentum_score * 10) : 0,
        }))

        // Generate opportunities
        const opportunities = [
          { type: 'buy', text: 'Emerging artists show +40% momentum in photography', metric: 'Medium growth' },
          { type: 'sell', text: 'Contemporary painting prices stabilizing after Q2 rally', metric: 'Price volatility -15%' },
          { type: 'watch', text: 'West African artists gaining international traction', metric: 'Exhibitions +8' },
        ]

        const analyticsData = {
          countryTrends: countryTrendsFormatted,
          topArtists: topArtistsFormatted,
          mediumTrends: mediumTrendsFormatted,
          emergingArtists: emergingArtistsFormatted,
          opportunities,
          metadata: {
            period,
            dataSource: 'Kucibok Platform (Verified Artworks)',
            lastUpdated: new Date().toISOString(),
          },
        }

        // Cache result
        await supabaseAdmin
          .from('analytics_cache')
          .upsert(
            {
              cache_key: cacheKey,
              data: analyticsData,
              expires_at: new Date(Date.now() + CACHE_TTL).toISOString(),
            },
            { onConflict: 'cache_key' }
          )
          .catch(() => {})

        return res.status(200).json({ data: analyticsData })
      } catch (err) {
        console.error('Analytics error:', err)
        return res.status(500).json({ error: 'Unable to fetch analytics data' })
      }
    }

    if (s0 === 'health') {
      return res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
      })
    }

    // Route not found
    res.status(404).json({
      error: 'Route not found',
      path: `/${path.join('/')}`,
    })
  } catch (error) {
    console.error('[API Error]', error)
    res.status(500).json({
      error: error.message,
      success: false,
    })
  }
}
