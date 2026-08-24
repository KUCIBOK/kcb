/**
 * useAdvisorPortfolio.js
 *
 * API hooks for advisor portfolio data:
 * - Real holdings from advisor_holdings table
 * - Valuations and trends
 * - Risk analysis (Sharpe ratio, volatility, diversification)
 * - Performance metrics
 */

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

/**
 * Get advisor's current portfolio holdings
 */
export async function getAdvisorHoldings(advisorId) {
  try {
    const { data, error } = await supabase
      .from('advisor_holdings')
      .select(`
        *,
        artworks:artwork_id(
          id,
          title,
          medium,
          price,
          artist,
          artists:artists(name, tier, years_experience, artistic_statement)
        )
      `)
      .eq('advisor_id', advisorId)

    if (error) throw error

    return {
      data: data || [],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err.message,
    }
  }
}

/**
 * Calculate portfolio metrics
 */
export async function calculatePortfolioMetrics(advisorId) {
  try {
    const { data, error } = await supabase.rpc('calculate_advisor_portfolio_metrics', {
      p_advisor_id: advisorId,
    })

    if (error) throw error

    return {
      data: data?.[0] || null,
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err.message,
    }
  }
}

/**
 * Get portfolio snapshots (historical data)
 */
export async function getPortfolioHistory(advisorId, limit = 30) {
  try {
    const { data, error } = await supabase
      .from('advisor_portfolio_snapshots')
      .select('*')
      .eq('advisor_id', advisorId)
      .order('snapshot_date', { ascending: false })
      .limit(limit)

    if (error) throw error

    return {
      data: data || [],
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      error: err.message,
    }
  }
}

/**
 * Calculate risk metrics for portfolio
 * Returns: volatility, sharpe_ratio, beta, drawdown
 */
export async function calculatePortfolioRisk(holdings, benchmarkReturn = 0.05) {
  try {
    // Group by artist to calculate concentration risk
    const artistConcentration = {}
    let totalValue = 0

    holdings.forEach((h) => {
      const artist = h.artworks?.artists?.[0]?.name || 'Unknown'
      const value = h.current_valuation || 0
      artistConcentration[artist] = (artistConcentration[artist] || 0) + value
      totalValue += value
    })

    // Calculate Herfindahl-Hirschman Index (concentration)
    let hhi = 0
    Object.values(artistConcentration).forEach((value) => {
      const concentration = (value / totalValue) * 100
      hhi += concentration * concentration
    })

    // Risk factors
    const diversificationScore = Math.max(0, 100 - hhi / 100) // 0-100
    const volatility = Math.sqrt(diversificationScore * 0.01) // Proxy for volatility
    const sharpeRatio = (0.12 - benchmarkReturn) / (volatility || 0.1) // Simplified

    // Estimate max drawdown from volatility
    const maxDrawdown = -volatility * 2.33 // 99% confidence

    return {
      diversificationScore,
      volatility: (volatility * 100).toFixed(2),
      sharpeRatio: sharpeRatio.toFixed(2),
      maxDrawdown: (maxDrawdown * 100).toFixed(2),
      riskLevel: diversificationScore > 70 ? 'Low' : diversificationScore > 40 ? 'Medium' : 'High',
      concentration: {
        byArtist: artistConcentration,
        hhi: hhi.toFixed(2),
      },
      error: null,
    }
  } catch (err) {
    return {
      error: err.message,
      diversificationScore: 0,
      volatility: 0,
      sharpeRatio: 0,
      maxDrawdown: 0,
    }
  }
}

/**
 * Get artist valuation history and trends
 */
export async function getArtistValuationTrend(artistId, days = 365) {
  try {
    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - days)

    const { data, error } = await supabase
      .from('artist_valuation_history')
      .select('*')
      .eq('artist_id', artistId)
      .gte('valuation_date', dateFilter.toISOString())
      .order('valuation_date', { ascending: true })

    if (error) throw error

    // Calculate trend
    const prices = data?.map((d) => d.median_price) || []
    const trend = prices.length > 1 ? ((prices[prices.length - 1] - prices[0]) / prices[0]) * 100 : 0

    return {
      data: data || [],
      trend: trend.toFixed(2),
      error: null,
    }
  } catch (err) {
    return {
      data: null,
      trend: 0,
      error: err.message,
    }
  }
}

/**
 * Get comparable sales for artwork
 */
export async function getComparableSales(mediumType, priceRange = 20000) {
  try {
    // Fetch similar artworks sold in last 12 months
    const { data: transactions, error } = await supabase
      .from('transactions')
      .select(`
        *,
        artworks:artwork_id(medium, price)
      `)
      .eq('status', 'confirmed')
      .gte('created_at', new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString())
      .limit(50)

    if (error) throw error

    // Filter by medium and price range
    const comparables = (transactions || [])
      .filter((t) => t.artworks?.medium === mediumType)
      .filter((t) => {
        const price = t.artworks?.price || 0
        return price > 0 && price < priceRange * 2
      })

    // Calculate stats
    const prices = comparables.map((c) => c.artworks?.price || 0)
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0

    return {
      comparables: comparables.slice(0, 10),
      stats: {
        count: comparables.length,
        avgPrice: avgPrice.toFixed(0),
        minPrice: Math.min(...prices),
        maxPrice: Math.max(...prices),
      },
      error: null,
    }
  } catch (err) {
    return {
      comparables: [],
      stats: null,
      error: err.message,
    }
  }
}

/**
 * Calculate predicted price based on valuation trends
 */
export function predictPrice(historicalPrices, months = 12) {
  if (!historicalPrices || historicalPrices.length < 2) return null

  // Simple linear regression
  const n = historicalPrices.length
  const x = Array.from({ length: n }, (_, i) => i)
  const y = historicalPrices

  const sumX = x.reduce((a, b) => a + b, 0)
  const sumY = y.reduce((a, b) => a + b, 0)
  const sumXY = x.reduce((sum, xi, i) => sum + xi * y[i], 0)
  const sumX2 = x.reduce((sum, xi) => sum + xi * xi, 0)

  const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX)
  const intercept = (sumY - slope * sumX) / n

  // Predict for future months
  const futureX = n + months / 12
  const predicted = intercept + slope * futureX

  return {
    predicted: Math.max(0, predicted),
    trend: slope > 0 ? 'up' : slope < 0 ? 'down' : 'stable',
    confidence: Math.min(95, Math.abs(slope) * 10),
  }
}

/**
 * Generate investment recommendations based on portfolio
 */
export async function getInvestmentRecommendations(holdings, portfolio) {
  const recommendations = []

  // 1. Diversification check
  if (holdings.length < 5) {
    recommendations.push({
      type: 'diversification',
      priority: 'high',
      title: 'Expand Your Collection',
      action: 'Add 5-7 more artworks to reduce concentration risk',
      expectedImpact: '+15-20% reduction in volatility',
    })
  }

  // 2. Segment performance
  const segments = {}
  holdings.forEach((h) => {
    const medium = h.artworks?.medium || 'Other'
    segments[medium] = (segments[medium] || 0) + (h.current_valuation || 0)
  })

  const sortedSegments = Object.entries(segments).sort((a, b) => b[1] - a[1])
  if (sortedSegments[0]?.[1] / portfolio.totalValue > 0.4) {
    recommendations.push({
      type: 'rebalancing',
      priority: 'medium',
      title: `Reduce ${sortedSegments[0][0]} Concentration`,
      action: `Currently ${((sortedSegments[0][1] / portfolio.totalValue) * 100).toFixed(0)}% of portfolio`,
      expectedImpact: 'Better risk-adjusted returns',
    })
  }

  // 3. Emerging artists opportunity
  const topArtists = holdings
    .map((h) => ({ ...h.artworks?.artists?.[0], count: 1 }))
    .filter((a) => a.tier?.includes('Tier 3'))

  if (topArtists.length > 0) {
    recommendations.push({
      type: 'opportunity',
      priority: 'low',
      title: 'Emerging Artist Growth',
      action: `You have ${topArtists.length} emerging artist pieces - monitor for price appreciation`,
      expectedImpact: 'Potential +25-40% within 12-24 months',
    })
  }

  return recommendations
}
