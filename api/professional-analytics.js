/**
 * Professional Analytics API — Enhanced Version
 * Hybrid strategy: Real Kucibok data + intelligent data-driven insights
 * Uses RPC functions for optimized queries + caching (5min TTL)
 */

import { createClient } from '@supabase/supabase-js'
import { respondError, respondJSON } from './_lib/response.js'

// Initialize Supabase admin client directly (same as [...path].js)
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
})

const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * GET /api/professional-analytics
 * Market intelligence dashboard data
 * Query: ?period=month
 */
async function handleGetAnalytics(req) {
  const url = new URL(req.url, 'http://localhost')
  const period = url.searchParams.get('period') || 'month'
  const cacheKey = `analytics:${period}`

  try {
    // Try cache first
    const { data: cachedData } = await supabaseAdmin
      .from('analytics_cache')
      .select('data')
      .eq('cache_key', cacheKey)
      .gt('expires_at', new Date().toISOString())
      .single()

    if (cachedData?.data) {
      return respondJSON(200, { data: cachedData.data, cached: true })
    }

    // Fetch fresh data using RPC functions
    const [countryTrends, topArtists, mediumTrends, emergingArtists] = await Promise.all([
      supabaseAdmin.rpc('get_country_market_trends', { time_period: period }),
      supabaseAdmin.rpc('get_artist_trends', { time_period: period }),
      supabaseAdmin.rpc('get_medium_trends', { time_period: period }),
      supabaseAdmin.rpc('detect_emerging_artists', { min_sales: 2 }),
    ])

    // Generate data-driven opportunities
    const opportunities = generateOpportunities(
      countryTrends.data,
      topArtists.data,
      mediumTrends.data,
      emergingArtists.data
    )

    const analyticsData = {
      countryTrends: formatCountryTrends(countryTrends.data),
      topArtists: formatTopArtists(topArtists.data),
      mediumTrends: formatMediumTrends(mediumTrends.data),
      emergingArtists: formatEmergingArtists(emergingArtists.data),
      opportunities,
      metadata: {
        period,
        dataSource: 'Kucibok Platform (Verified Artworks)',
        lastUpdated: new Date().toISOString(),
        cacheStatus: 'fresh',
      },
    }

    // Cache the result
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
      .catch(() => {}) // Non-critical if caching fails

    return respondJSON(200, { data: analyticsData })
  } catch (err) {
    console.error('handleGetAnalytics error:', err)
    // Fallback to cached data if RPC fails
    const { data: fallbackCache } = await supabaseAdmin
      .from('analytics_cache')
      .select('data')
      .eq('cache_key', cacheKey)
      .order('expires_at', { ascending: false })
      .limit(1)
      .single()
      .catch(() => ({ data: null }))

    if (fallbackCache?.data) {
      return respondJSON(200, { data: fallbackCache.data, cached: true, stale: true })
    }

    return respondError(500, 'Unable to fetch analytics data')
  }
}

/**
 * Generate data-driven opportunities based on real trends
 * Not mocked — derived from actual Kucibok data
 */
function generateOpportunities(countryTrends, topArtists, mediumTrends, emergingArtists) {
  const opportunities = []

  // Opportunity 1: Highest growth country
  if (countryTrends && countryTrends.length > 0) {
    const topCountry = countryTrends[0]
    if (topCountry.growth_pct > 10) {
      opportunities.push({
        type: 'buy',
        priority: 'high',
        text: `${topCountry.country} — ${topCountry.growth_pct}% YoY growth, ${topCountry.artworks_count} verified artworks. Strong momentum.`,
        metric: `+${topCountry.growth_pct}%`,
      })
    }
  }

  // Opportunity 2: Emerging artists
  if (emergingArtists && emergingArtists.length > 0) {
    const emerging = emergingArtists[0]
    opportunities.push({
      type: 'buy',
      priority: 'medium',
      text: `Rising artist: ${emerging.artist_name} (${emerging.country}) — ${emerging.recent_sales} recent sales, avg €${Math.round(emerging.avg_price)}. Early collection opportunity.`,
      metric: `${emerging.recent_sales} sales`,
    })
  }

  // Opportunity 3: Trending medium
  if (mediumTrends && mediumTrends.length > 0) {
    const hottestMedium = mediumTrends.find((m) => m.growth_pct > 20)
    if (hottestMedium) {
      opportunities.push({
        type: 'watch',
        priority: 'medium',
        text: `${hottestMedium.medium} category trending — ${hottestMedium.growth_pct}% growth, avg €${Math.round(hottestMedium.avg_price)}. Monitor valuations.`,
        metric: `+${hottestMedium.growth_pct}%`,
      })
    }
  }

  // Opportunity 4: Price volatility play
  if (countryTrends && countryTrends.length > 1) {
    const volatile = countryTrends.find((c) => c.price_volatility > 5000)
    if (volatile) {
      opportunities.push({
        type: 'sell',
        priority: 'low',
        text: `High volatility detected in ${volatile.country} — price swings €${Math.round(volatile.price_volatility)} avg. Consider portfolio rebalancing.`,
        metric: `€${Math.round(volatile.price_volatility)} volatility`,
      })
    }
  }

  // Fallback if no real opportunities generated
  if (opportunities.length === 0) {
    opportunities.push(
      {
        type: 'watch',
        priority: 'medium',
        text: 'Market stable — limited trading data available. More insights as platform grows.',
        metric: 'Monitoring',
      }
    )
  }

  return opportunities
}

/**
 * Format country trends for display
 */
function formatCountryTrends(data) {
  if (!data) return []
  return data.map((c) => ({
    country: c.country || 'Unknown',
    volume: c.volume ? `€${Math.round(c.volume / 1000)}K` : '€0',
    avgPrice: c.avg_price ? `€${Math.round(c.avg_price)}` : '—',
    medianPrice: c.median_price ? `€${Math.round(c.median_price)}` : '—',
    artists: c.artists || 0,
    artworks: c.artworks_count || 0,
    growth: c.growth_pct ? Math.round(c.growth_pct) : 0,
    volatility: c.price_volatility ? Math.round(c.price_volatility) : 0,
    trending: c.trending || false,
  }))
}

/**
 * Format top artists
 */
function formatTopArtists(data) {
  if (!data) return []
  return data.slice(0, 8).map((a) => ({
    name: a.artist_name || 'Unknown',
    country: a.country || 'Unknown',
    appreciation: a.appreciation_pct ? `${a.appreciation_pct > 0 ? '+' : ''}${Math.round(a.appreciation_pct)}%` : '—',
    buzz: a.buzz_score || 0,
    exhibitions: a.exhibitions || 0,
    recentSales: a.recent_sales || 0,
    avgPrice: a.avg_price ? `€${Math.round(a.avg_price)}` : '—',
  }))
}

/**
 * Format medium trends
 */
function formatMediumTrends(data) {
  if (!data) return []
  return data.map((m) => ({
    medium: m.medium || 'Other',
    growth: m.growth_pct ? Math.round(m.growth_pct) : 0,
    count: m.count || 0,
    avgPrice: m.avg_price ? Math.round(m.avg_price) : 0,
  }))
}

/**
 * Format emerging artists
 */
function formatEmergingArtists(data) {
  if (!data) return []
  return data.slice(0, 5).map((a) => ({
    name: a.artist_name || 'Unknown',
    country: a.country || 'Unknown',
    recentSales: a.recent_sales || 0,
    avgPrice: a.avg_price ? `€${Math.round(a.avg_price)}` : '—',
    momentumScore: a.momentum_score ? Math.round(a.momentum_score * 10) : 0,
  }))
}

/**
 * Route dispatcher
 */
export default async function handler(req, res) {
  const pathname = new URL(req.url, 'http://localhost').pathname
  const segments = pathname.split('/').filter(Boolean)

  // GET /api/professional-analytics
  if (segments[1] === 'professional-analytics' && !segments[2] && req.method === 'GET') {
    const responseFunction = await handleGetAnalytics(req)
    return responseFunction(res)
  }

  return respondError(404, 'Route not found')(res)
}
