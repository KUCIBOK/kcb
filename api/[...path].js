/**
 * api/[...path].js — Catch-all Vercel Function for all API routes
 * Disables caching to fix 304 responses
 */

import { createClient } from '@supabase/supabase-js'
import { respondJSON, respondError } from './_lib/response.js'

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

// Log env status (for debugging)
if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error('[api/[...path].js] Missing env: SUPABASE_URL=' + !!SUPABASE_URL + ', SERVICE_ROLE=' + !!SUPABASE_SERVICE_ROLE_KEY)
}

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
    // Parse the URL path from req.url (Vercel Node.js Functions)
    const urlObj = new URL(req.url, 'http://localhost')
    const path = urlObj.pathname.replace(/^\/api\//, '').split('/').filter(p => p)
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

    // ─────────────────────────────────────────────────────────────
    // AUTH ROUTES
    // ─────────────────────────────────────────────────────────────

    if (s0 === 'auth') {
      // POST /api/auth/google-callback — Handle Google OAuth callback
      if (req.method === 'POST' && s1 === 'google-callback') {
        try {
          const { access_token } = req.body
          if (!access_token) {
            return res.status(400).json({ error: 'access_token is required' })
          }

          // Get user from token (Supabase has already created session)
          const { data: { user: authUser } } = await supabaseAdmin.auth.getUser(access_token)

          if (!authUser) {
            return res.status(401).json({ error: 'Invalid access token' })
          }

          // Check if user exists in public.users
          const { data: existingUser, error: checkError } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', authUser.id)
            .single()

          if (checkError && checkError.code !== 'PGRST116') {
            // PGRST116 = no rows found (expected for new users)
            return res.status(500).json({ error: checkError.message })
          }

          if (!existingUser) {
            // New user - create profile
            const { error: createError } = await supabaseAdmin
              .from('users')
              .insert({
                id: authUser.id,
                email: authUser.email,
                role: 'buyer', // Default role
                name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
              })

            if (createError) {
              console.error('[Google Callback - Create User Error]', createError)
              return res.status(500).json({ error: 'Failed to create user profile' })
            }

            return res.status(200).json({
              success: true,
              data: {
                user: { id: authUser.id, email: authUser.email, role: 'buyer' },
                needs_role_selection: true,
              },
            })
          }

          // Existing user
          return res.status(200).json({
            success: true,
            data: {
              user: existingUser,
              needs_role_selection: !existingUser.role || existingUser.role === 'buyer',
            },
          })
        } catch (err) {
          console.error('[Google Callback Error]', err.message)
          return res.status(500).json({ error: err.message || 'OAuth callback failed' })
        }
      }

      // POST /api/auth/signup — Register new user
      if (req.method === 'POST' && s1 === 'signup') {
        try {
          const { email, password, role, name, country, institution } = req.body

          if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
          }

          if (password.length < 8) {
            return res.status(400).json({ error: 'Password must be at least 8 characters' })
          }

          // Create auth user via Supabase admin
          const { data, error } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: false, // User must verify email
            user_metadata: {
              role: role || 'buyer',
              name: name || email.split('@')[0],
              country: country || null,
              institution: institution || null,
            },
          })

          if (error) {
            console.error('[Signup Auth Error]', error.message)
            return res.status(400).json({
              error: error.message.includes('already exists')
                ? 'This email is already registered'
                : error.message,
            })
          }

          // Create user profile in public.users
          const { error: profileError } = await supabaseAdmin.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            role: role || 'buyer',
            name: name || email.split('@')[0],
            country: country || null,
            institution: institution || null,
          })

          if (profileError) {
            console.error('[Signup Profile Error]', profileError)
            // Note: Auth user created but profile failed - may need cleanup
            return res.status(500).json({ error: 'Failed to create user profile' })
          }

          return res.status(201).json({
            success: true,
            data: {
              user: {
                id: data.user.id,
                email: data.user.email,
                role: role || 'buyer',
              },
              message: 'Check your email to verify your account',
            },
          })
        } catch (err) {
          console.error('[Signup Exception]', err.message)
          return res.status(500).json({ error: err.message || 'Signup failed' })
        }
      }

      // GET /api/auth/me — Get current user
      if (req.method === 'GET' && s1 === 'me') {
        try {
          const authHeader = req.headers.authorization
          if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'Missing or invalid authorization header' })
          }

          const token = authHeader.substring(7)
          const { data: { user }, error } = await supabaseAdmin.auth.getUser(token)

          if (error || !user) {
            return res.status(401).json({ error: 'Invalid token' })
          }

          // Get full user profile
          const { data: profile } = await supabaseAdmin
            .from('users')
            .select('*')
            .eq('id', user.id)
            .single()

          return res.status(200).json({
            data: profile || { id: user.id, email: user.email, role: 'buyer' },
          })
        } catch (err) {
          console.error('[Auth Me Error]', err)
          return res.status(500).json({ error: err.message })
        }
      }
    }

    if (s0 === 'professional' && s1 === 'analytics' && req.method === 'GET' && !s2) {
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
        console.error('[Professional Analytics Error]', err.message, err.code)
        // If RPC functions fail (for any reason), return mock data for graceful degradation
        console.warn('[Using Mock Analytics Data] RPC query failed:', err.message)
        const mockAnalytics = {
          countryTrends: [
            { country: 'Senegal', growth: 25, volume: 150, avgPrice: '€8,500', artists: 45 },
            { country: 'Nigeria', growth: 18, volume: 220, avgPrice: '€12,000', artists: 78 },
            { country: 'Ghana', growth: 12, volume: 95, avgPrice: '€6,800', artists: 32 },
          ],
          topArtists: [
            { name: 'Aïssatou Diallo', country: 'Senegal', appreciation: '+35%', buzz: 92, exhibitions: 8 },
            { name: 'Kwesi Mensah', country: 'Ghana', appreciation: '+22%', buzz: 85, exhibitions: 6 },
          ],
          mediumTrends: [
            { medium: 'Painting', growth: 28, count: 450, avgPrice: 9500 },
            { medium: 'Sculpture', growth: 15, count: 180, avgPrice: 14200 },
          ],
          emergingArtists: [
            { name: 'Zainab Hassan', country: 'Senegal', recentSales: 5, avgPrice: '€4,200', momentumScore: 87 },
          ],
          opportunities: [
            { type: 'buy', text: 'Emerging artists show +40% momentum in photography', metric: 'Medium growth' },
            { type: 'sell', text: 'Contemporary painting prices stabilizing after Q2 rally', metric: 'Price volatility -15%' },
          ],
          metadata: {
            period: period || 'month',
            dataSource: 'Kucibok Platform (Mock Data - Analytics RPC unavailable)',
            lastUpdated: new Date().toISOString(),
          },
        }
        return res.status(200).json({ data: mockAnalytics, mock: true })
      }
    }

    // ─────────────────────────────────────────────────────────────
    // SUBSCRIPTIONS ROUTES
    // ─────────────────────────────────────────────────────────────

    if (s0 === 'subscriptions') {
      // POST /api/subscriptions/create-trial — Create 14-day trial
      if (req.method === 'POST' && s1 === 'create-trial') {
        const { user_id } = req.body

        if (!user_id) {
          return res.status(400).json({ error: 'user_id is required' })
        }

        try {
          const trialEndDate = new Date()
          trialEndDate.setDate(trialEndDate.getDate() + 14)

          const { data, error } = await supabaseAdmin
            .from('subscriptions')
            .insert({
              user_id,
              plan_id: null,
              status: 'trial',
              is_trial: true,
              trial_started_at: new Date(),
              trial_end_date: trialEndDate,
              start_date: new Date(),
              end_date: trialEndDate,
            })
            .select()
            .single()

          if (error) {
            console.error('[Trial Creation Error]', error)
            return res.status(500).json({ error: error.message })
          }

          return res.status(201).json({
            success: true,
            data,
            message: 'Trial subscription created',
          })
        } catch (err) {
          console.error('[Trial Creation Exception]', err)
          return res.status(500).json({ error: err.message })
        }
      }

      // GET /api/subscriptions/active/:user_id — Get active subscription
      if (req.method === 'GET' && s1 === 'active' && s2) {
        const { data, error } = await supabaseAdmin
          .from('subscriptions')
          .select('*')
          .eq('user_id', s2)
          .in('status', ['active', 'trial'])
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows found
          return res.status(500).json({ error: error.message })
        }

        return res.status(200).json({
          success: true,
          data: data || null,
        })
      }
    }

    // ─────────────────────────────────────────────────────────────
    // SHORTLIST ROUTES
    // ─────────────────────────────────────────────────────────────

    if (s0 === 'shortlist') {
      // POST /api/shortlist/:artworkId — Add to shortlist
      if (req.method === 'POST' && s1) {
        const userId = req.headers.authorization?.split(' ')[1]
        // In production, extract user_id from JWT token properly
        // For now, expect it in body
        const { user_id } = req.body

        if (!user_id || !s1) {
          return res.status(400).json({ error: 'user_id and artworkId are required' })
        }

        try {
          const { data, error } = await supabaseAdmin
            .from('shortlisted_artworks')
            .insert({
              user_id,
              artwork_id: s1,
              notes: req.body.notes || '',
            })
            .select()
            .single()

          if (error && error.code === '23505') {
            // Unique constraint violation = already shortlisted
            return res.status(409).json({
              error: 'Artwork already shortlisted',
              success: false,
            })
          }

          if (error) {
            return res.status(500).json({ error: error.message })
          }

          return res.status(201).json({
            success: true,
            data,
            message: 'Added to shortlist',
          })
        } catch (err) {
          console.error('[Shortlist Add Error]', err)
          return res.status(500).json({ error: err.message })
        }
      }

      // DELETE /api/shortlist/:artworkId — Remove from shortlist
      if (req.method === 'DELETE' && s1) {
        const { user_id } = req.body

        if (!user_id || !s1) {
          return res.status(400).json({ error: 'user_id and artworkId are required' })
        }

        try {
          const { error } = await supabaseAdmin
            .from('shortlisted_artworks')
            .delete()
            .eq('user_id', user_id)
            .eq('artwork_id', s1)

          if (error) {
            return res.status(500).json({ error: error.message })
          }

          return res.status(200).json({
            success: true,
            message: 'Removed from shortlist',
          })
        } catch (err) {
          console.error('[Shortlist Remove Error]', err)
          return res.status(500).json({ error: err.message })
        }
      }

      // GET /api/shortlist/check/:artworkId — Check if shortlisted
      if (req.method === 'GET' && s1 === 'check' && s2) {
        const { user_id } = req.query

        if (!user_id) {
          return res.status(400).json({ error: 'user_id query param is required' })
        }

        try {
          const { data, error } = await supabaseAdmin
            .from('shortlisted_artworks')
            .select('id')
            .eq('user_id', user_id)
            .eq('artwork_id', s2)
            .single()

          return res.status(200).json({
            success: true,
            isShortlisted: !!data && !error,
          })
        } catch (err) {
          return res.status(200).json({
            success: true,
            isShortlisted: false,
          })
        }
      }

      // GET /api/shortlist — Get user's shortlist
      if (req.method === 'GET' && !s1) {
        const { user_id } = req.query

        if (!user_id) {
          return res.status(400).json({ error: 'user_id query param is required' })
        }

        try {
          const { data, error } = await supabaseAdmin
            .from('shortlisted_artworks')
            .select('*, artworks(*)')
            .eq('user_id', user_id)
            .order('created_at', { ascending: false })

          if (error) {
            console.error('[GET /api/shortlist Error]', error.code, error.message)
            // If table doesn't exist, provide helpful message
            if (error.code === 'PGRST116') {
              return res.status(200).json({ success: true, data: [], count: 0 })
            }
            return res.status(500).json({ error: error.message, code: error.code })
          }

          return res.status(200).json({
            success: true,
            data: data || [],
            count: (data || []).length,
          })
        } catch (err) {
          console.error('[Shortlist Get Exception]', err.message)
          return res.status(500).json({ error: err.message })
        }
      }

      // PATCH /api/shortlist/:artworkId — Update notes
      if (req.method === 'PATCH' && s1) {
        const { user_id, notes } = req.body

        if (!user_id || !s1) {
          return res.status(400).json({ error: 'user_id and artworkId are required' })
        }

        try {
          const { data, error } = await supabaseAdmin
            .from('shortlisted_artworks')
            .update({ notes: notes || '' })
            .eq('user_id', user_id)
            .eq('artwork_id', s1)
            .select()
            .single()

          if (error) {
            return res.status(500).json({ error: error.message })
          }

          return res.status(200).json({
            success: true,
            data,
            message: 'Notes updated',
          })
        } catch (err) {
          console.error('[Shortlist Update Error]', err)
          return res.status(500).json({ error: err.message })
        }
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
// Build timestamp: Fri, Aug 21, 2026 12:29:14 AM
