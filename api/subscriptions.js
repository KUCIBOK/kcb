/**
 * api/subscriptions.js
 *
 * Endpoint pour gérer les subscriptions, trials, et shortlisting
 * - POST /api/subscriptions/create-trial — Crée un trial 14j pour un nouvel utilisateur
 * - POST /api/subscriptions/shortlist/:artworkId — Add artwork to shortlist
 * - DELETE /api/subscriptions/shortlist/:artworkId — Remove from shortlist
 * - GET /api/subscriptions/my-shortlist — Get user's shortlist
 * - GET /api/subscriptions/shortlist/check/:artworkId — Check if shortlisted
 * - PATCH /api/subscriptions/shortlist/:artworkId — Update notes
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')

  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  try {
    // Import Supabase dynamically
    const { createClient } = await import('@supabase/supabase-js')

    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!SUPABASE_URL || !SUPABASE_KEY) {
      return res.status(503).json({
        error: 'Database not configured',
        success: false,
      })
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // ─────────────────────────────────────────────────────────────
    // POST /api/subscriptions/create-trial
    // ─────────────────────────────────────────────────────────────
    if (req.method === 'POST') {
      const { path } = req.query
      const action = path?.[1] // 'create-trial'

      if (action === 'create-trial') {
        const { user_id } = req.body

        if (!user_id) {
          return res.status(400).json({
            error: 'user_id required',
            success: false,
          })
        }

        // Calculate trial end date: NOW + 14 days
        const trialStartedAt = new Date()
        const trialEndDate = new Date(trialStartedAt)
        trialEndDate.setDate(trialEndDate.getDate() + 14)

        // Create trial subscription
        const { data, error } = await supabase
          .from('subscriptions')
          .insert({
            user_id,
            plan_id: null, // Free/trial plan (no paid plan)
            status: 'trial',
            is_trial: true,
            trial_started_at: trialStartedAt,
            trial_end_date: trialEndDate,
            start_date: trialStartedAt,
            end_date: trialEndDate,
            amount: 0,
            currency: 'EUR',
          })
          .select()
          .single()

        if (error) {
          console.error('[Trial Creation Error]', error)
          return res.status(500).json({
            error: error.message,
            success: false,
          })
        }

        return res.status(201).json({
          success: true,
          data,
          message: 'Trial subscription created',
        })
      }

      // ─────────────────────────────────────────────────────────────
      // POST /api/subscriptions/shortlist/:artworkId
      // ─────────────────────────────────────────────────────────────
      if (action === 'shortlist' && req.method === 'POST') {
        const artworkId = path?.[2] // GET artworkId from URL
        const authHeader = req.headers.authorization
        if (!authHeader || !artworkId) {
          return res.status(400).json({
            error: 'Missing authorization or artworkId',
            success: false,
          })
        }

        // Extract user_id from JWT (Bearer token)
        const token = authHeader.replace('Bearer ', '')
        let userId
        try {
          const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
          userId = decoded.sub
        } catch {
          return res.status(401).json({ error: 'Invalid token', success: false })
        }

        if (!userId) {
          return res.status(401).json({ error: 'Unauthorized', success: false })
        }

        const { notes = null } = req.body

        // Insert shortlist item
        const { data, error } = await supabase
          .from('shortlisted_artworks')
          .insert({
            user_id: userId,
            artwork_id: artworkId,
            notes,
          })
          .select()
          .single()

        if (error) {
          if (error.code === '23505') {
            // Unique constraint violated
            return res.status(409).json({
              error: 'Artwork already in shortlist',
              success: false,
            })
          }
          return res.status(500).json({ error: error.message, success: false })
        }

        return res.status(201).json({
          success: true,
          data,
          message: 'Added to shortlist',
        })
      }

      // ─────────────────────────────────────────────────────────────
      // DELETE /api/subscriptions/shortlist/:artworkId
      // ─────────────────────────────────────────────────────────────
      if (action === 'shortlist' && req.method === 'DELETE') {
        const artworkId = path?.[2]
        const authHeader = req.headers.authorization
        if (!authHeader || !artworkId) {
          return res.status(400).json({
            error: 'Missing authorization or artworkId',
            success: false,
          })
        }

        const token = authHeader.replace('Bearer ', '')
        let userId
        try {
          const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
          userId = decoded.sub
        } catch {
          return res.status(401).json({ error: 'Invalid token', success: false })
        }

        const { error } = await supabase
          .from('shortlisted_artworks')
          .delete()
          .eq('user_id', userId)
          .eq('artwork_id', artworkId)

        if (error) {
          return res.status(500).json({ error: error.message, success: false })
        }

        return res.status(200).json({
          success: true,
          message: 'Removed from shortlist',
        })
      }

      // ─────────────────────────────────────────────────────────────
      // GET /api/subscriptions/my-shortlist
      // ─────────────────────────────────────────────────────────────
      if (action === 'my-shortlist' && req.method === 'GET') {
        const authHeader = req.headers.authorization
        if (!authHeader) {
          return res.status(401).json({ error: 'Unauthorized', success: false })
        }

        const token = authHeader.replace('Bearer ', '')
        let userId
        try {
          const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
          userId = decoded.sub
        } catch {
          return res.status(401).json({ error: 'Invalid token', success: false })
        }

        const { data, error } = await supabase
          .from('shortlisted_artworks')
          .select('*, artworks(*)')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })

        if (error) {
          return res.status(500).json({ error: error.message, success: false })
        }

        return res.status(200).json({
          success: true,
          data: data || [],
          count: data?.length || 0,
        })
      }

      // ─────────────────────────────────────────────────────────────
      // GET /api/subscriptions/shortlist/check/:artworkId
      // ─────────────────────────────────────────────────────────────
      if (action === 'shortlist' && path?.[2] === 'check' && req.method === 'GET') {
        const artworkId = path?.[3]
        const authHeader = req.headers.authorization
        if (!authHeader || !artworkId) {
          return res.status(400).json({
            error: 'Missing authorization or artworkId',
            success: false,
          })
        }

        const token = authHeader.replace('Bearer ', '')
        let userId
        try {
          const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
          userId = decoded.sub
        } catch {
          return res.status(401).json({ error: 'Invalid token', success: false })
        }

        const { data, error } = await supabase
          .from('shortlisted_artworks')
          .select('id')
          .eq('user_id', userId)
          .eq('artwork_id', artworkId)
          .single()

        if (error && error.code !== 'PGRST116') {
          // PGRST116 = no rows returned (not an error)
          return res.status(500).json({ error: error.message, success: false })
        }

        return res.status(200).json({
          success: true,
          isShortlisted: !!data,
        })
      }

      // ─────────────────────────────────────────────────────────────
      // PATCH /api/subscriptions/shortlist/:artworkId
      // ─────────────────────────────────────────────────────────────
      if (action === 'shortlist' && req.method === 'PATCH') {
        const artworkId = path?.[2]
        const authHeader = req.headers.authorization
        if (!authHeader || !artworkId) {
          return res.status(400).json({
            error: 'Missing authorization or artworkId',
            success: false,
          })
        }

        const token = authHeader.replace('Bearer ', '')
        let userId
        try {
          const decoded = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString())
          userId = decoded.sub
        } catch {
          return res.status(401).json({ error: 'Invalid token', success: false })
        }

        const { notes } = req.body

        const { data, error } = await supabase
          .from('shortlisted_artworks')
          .update({ notes })
          .eq('user_id', userId)
          .eq('artwork_id', artworkId)
          .select()
          .single()

        if (error) {
          return res.status(500).json({ error: error.message, success: false })
        }

        return res.status(200).json({
          success: true,
          data,
          message: 'Notes updated',
        })
      }
    }

    // Route not found
    res.status(404).json({
      error: 'Route not found',
      success: false,
    })
  } catch (error) {
    console.error('[API Error]', error)
    res.status(500).json({
      error: error.message,
      success: false,
    })
  }
}
