/**
 * Professional Analytics Module - FIXED VERSION
 * Queries transactions table DIRECTLY instead of buggy RPC functions
 * Returns REAL market data from confirmed transactions
 */

export async function handleProfessionalAnalytics(supabaseAdmin, period = 'month') {
  try {
    // Define period in days
    const periodDays = {
      week: 7,
      month: 30,
      quarter: 90,
      year: 365,
    }[period] || 30

    const dateFilter = new Date()
    dateFilter.setDate(dateFilter.getDate() - periodDays)

    // ====================================================================
    // 1. MARKET TRENDS - Direct query to transactions
    // ====================================================================
    const { data: marketData } = await supabaseAdmin
      .from('transactions')
      .select('amount, currency')
      .eq('status', 'confirmed')
      .gte('created_at', dateFilter.toISOString())

    let marketTrendData = null
    if (marketData && marketData.length > 0) {
      const amounts = marketData.map(t => t.amount).sort((a, b) => a - b)
      const median = amounts[Math.floor(amounts.length / 2)]
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
      const min = Math.min(...amounts)
      const max = Math.max(...amounts)
      const stdDev = Math.sqrt(amounts.reduce((sq, n) => sq + Math.pow(n - avg, 2), 0) / amounts.length)

      // Confidence: low if <5, medium if <20, high if >=20
      const confidence = amounts.length < 5 ? 0.3 : amounts.length < 20 ? 0.6 : 0.9

      marketTrendData = {
        value: Math.round(median),
        unit: 'EUR',
        period,
        sampleSize: amounts.length,
        sourceType: 'confirmed_transactions',
        confidence,
        insufficientData: amounts.length < 5,
        label: 'Median Realized Price',
        volatility: Math.round(stdDev),
        range: { min: Math.round(min), max: Math.round(max) },
      }
    }

    // ====================================================================
    // 2. COUNTRY TRENDS - Group by buyer country
    // ====================================================================
    const { data: countryData } = await supabaseAdmin
      .from('transactions')
      .select('amount, currency, buyer_id')
      .eq('status', 'confirmed')
      .gte('created_at', dateFilter.toISOString())

    // Get user countries
    const countryTrendsMap = {}
    if (countryData && countryData.length > 0) {
      const buyerIds = [...new Set(countryData.map(t => t.buyer_id))]

      // Fetch user countries in batches
      const { data: usersData } = await supabaseAdmin
        .from('users')
        .select('id, country')
        .in('id', buyerIds)

      const countryMap = {}
      usersData?.forEach(u => {
        countryMap[u.id] = u.country || 'Unknown'
      })

      countryData.forEach(t => {
        const country = countryMap[t.buyer_id] || 'Unknown'
        if (!countryTrendsMap[country]) {
          countryTrendsMap[country] = []
        }
        countryTrendsMap[country].push(t.amount)
      })
    }

    const countryTrendsFormatted = Object.entries(countryTrendsMap).map(([country, amounts]) => {
      const sorted = amounts.sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)]
      const confidence = sorted.length < 5 ? 0.3 : sorted.length < 20 ? 0.6 : 0.9

      return {
        country: country || 'Unknown',
        value: sorted.length,
        unit: 'transactions',
        medianPrice: Math.round(median),
        volume: Math.round(amounts.reduce((a, b) => a + b, 0)),
        sampleSize: sorted.length,
        confidence,
        insufficientData: sorted.length < 5,
        currency: 'EUR',
      }
    })

    // ====================================================================
    // 3. MEDIUM PERFORMANCE - Group by artwork medium
    // ====================================================================
    const { data: mediumData } = await supabaseAdmin
      .from('transactions')
      .select('amount, artwork_id')
      .eq('status', 'confirmed')
      .gte('created_at', dateFilter.toISOString())

    const mediumTrendsMap = {}
    if (mediumData && mediumData.length > 0) {
      const artworkIds = [...new Set(mediumData.map(t => t.artwork_id))]

      const { data: artworksData } = await supabaseAdmin
        .from('artworks')
        .select('id, medium')
        .in('id', artworkIds)

      const mediumMap = {}
      artworksData?.forEach(a => {
        mediumMap[a.id] = a.medium || 'Other'
      })

      mediumData.forEach(t => {
        const medium = mediumMap[t.artwork_id] || 'Other'
        if (!mediumTrendsMap[medium]) {
          mediumTrendsMap[medium] = []
        }
        mediumTrendsMap[medium].push(t.amount)
      })
    }

    const mediumPerformanceFormatted = Object.entries(mediumTrendsMap).map(([medium, amounts]) => {
      const sorted = amounts.sort((a, b) => a - b)
      const median = sorted[Math.floor(sorted.length / 2)]
      const avg = amounts.reduce((a, b) => a + b, 0) / amounts.length
      const confidence = sorted.length < 5 ? 0.3 : sorted.length < 20 ? 0.6 : 0.9

      return {
        medium: medium || 'Other',
        value: sorted.length,
        unit: 'sales',
        medianPrice: Math.round(median),
        avgPrice: Math.round(avg),
        sampleSize: sorted.length,
        confidence,
        insufficientData: sorted.length < 5,
        label: 'Sale Volume by Medium',
      }
    })

    // ====================================================================
    // 4. RETURN FORMATTED DATA
    // ====================================================================
    return {
      data: {
        marketTrend: marketTrendData,
        countryTrends: countryTrendsFormatted,
        mediumPerformance: mediumPerformanceFormatted,
        sourcing: [],
        conversion: {
          views: 0,
          likes: 0,
          inquiries: 0,
          sales: marketData?.length || 0,
        },
      },
      cached: false,
      timestamp: new Date().toISOString(),
    }
  } catch (error) {
    console.error('[Professional Analytics Error]', error.message)
    throw error
  }
}
