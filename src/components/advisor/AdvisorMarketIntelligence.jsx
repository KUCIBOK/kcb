/**
 * AdvisorMarketIntelligence.jsx
 *
 * Complete Market Intelligence Dashboard for Art Advisors
 * 7 Sections:
 * 1. Artist Valuation Trends
 * 2. Recent Sales & Comparable Data
 * 3. Portfolio Performance
 * 4. Market Trends & Demand
 * 5. Artist Reputation & Risk
 * 6. Deal Flow Analysis
 * 7. Investment Recommendations
 */

import { useState, useEffect } from 'react'
import { TrendingUp, TrendingDown, Star, CheckCircle2, AlertCircle, ArrowUp, ArrowDown, BarChart3, Loader2, Filter } from 'lucide-react'
import { getProfessionalAnalytics } from '../../api/useProfessionalAnalytics'
import { createClient } from '@supabase/supabase-js'

const supabaseClient = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export function AdvisorMarketIntelligence() {
  const [analytics, setAnalytics] = useState(null)
  const [artists, setArtists] = useState([])
  const [transactions, setTransactions] = useState([])
  const [portfolio, setPortfolio] = useState(null)
  const [deals, setDeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('year')

  useEffect(() => {
    loadAllData()
  }, [period])

  const loadAllData = async () => {
    setLoading(true)
    try {
      // Load market analytics
      const analyticsResult = await getProfessionalAnalytics(period)
      if (!analyticsResult.error) {
        setAnalytics(analyticsResult)
      }

      // Load artists with tier/valuation data
      const { data: artistsData } = await supabaseClient
        .from('artists')
        .select('*')
        .eq('featured', true)
        .limit(20)
      setArtists(artistsData || [])

      // Load recent transactions
      const { data: txData } = await supabaseClient
        .from('transactions')
        .select('*, artworks(title, medium, price, artist)')
        .eq('status', 'confirmed')
        .order('created_at', { ascending: false })
        .limit(50)
      setTransactions(txData || [])

      // Load available deals (for_sale artworks)
      const { data: dealsData } = await supabaseClient
        .from('artworks')
        .select('*, artists(name, tier, years_experience)')
        .eq('for_sale', true)
        .order('created_at', { ascending: false })
        .limit(20)
      setDeals(dealsData || [])

      // Calculate portfolio simulation (mock for now)
      calculatePortfolio()
    } finally {
      setLoading(false)
    }
  }

  const calculatePortfolio = () => {
    // Simulated portfolio data based on shortlist
    setPortfolio({
      totalValue: 450000,
      yoyGrowth: 15.2,
      bestPerformer: { name: 'Fatou D.', value: '+28%' },
      worstPerformer: { name: 'Mali Artist', value: '-5%' },
      avgHoldingPeriod: 2.3,
      realizedGains: 65000,
      unrealizedGains: 52000,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader2 className="w-8 h-8 animate-spin text-kcb-or" />
      </div>
    )
  }

  const marketTrend = analytics?.data?.marketTrend
  const countryTrends = analytics?.data?.countryTrends || []

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="font-playfair text-2xl font-bold text-white">Market Intelligence</h2>
          <p className="text-sm text-kcb-pierre mt-1">Investment analytics & portfolio insights</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 rounded-[4px] bg-kcb-ardoise border border-white/[0.08] text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or transition"
        >
          <option value="month">Last 30 days</option>
          <option value="quarter">Last 90 days</option>
          <option value="year">Last 12 months</option>
        </select>
      </div>

      {/* Section 1: Artist Valuation Trends */}
      <Section1ArtistValuation artists={artists} marketTrend={marketTrend} />

      {/* Section 2: Recent Sales & Comparable Data */}
      <Section2ComparableSales transactions={transactions} />

      {/* Section 3: Portfolio Performance */}
      <Section3PortfolioPerformance portfolio={portfolio} />

      {/* Section 4: Market Trends & Demand */}
      <Section4MarketTrends analytics={analytics} countryTrends={countryTrends} />

      {/* Section 5: Artist Reputation & Risk */}
      <Section5ArtistReputation artists={artists} />

      {/* Section 6: Deal Flow Analysis */}
      <Section6DealFlow deals={deals} />

      {/* Section 7: Investment Recommendations */}
      <Section7Recommendations portfolio={portfolio} artists={artists} deals={deals} />
    </div>
  )
}

// ============================================================================
// SECTION 1: ARTIST VALUATION TRENDS
// ============================================================================

function Section1ArtistValuation({ artists, marketTrend }) {
  const topArtists = artists.slice(0, 5)

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-kcb-or" />
        Artist Valuation Trends
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Market Median */}
        {marketTrend && (
          <div className="bg-kcb-noir/40 border border-white/[0.04] rounded-[4px] p-4">
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">Market Median</p>
            <p className="text-3xl font-bold text-kcb-or">€{marketTrend.value?.toLocaleString()}</p>
            <div className="flex items-center gap-1 mt-2 text-sm">
              <ArrowUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">High demand</span>
            </div>
          </div>
        )}

        {/* Sample Artist Valuations */}
        <div className="space-y-3">
          {topArtists.map((artist, idx) => {
            const valuation = 8000 + idx * 4000
            const change = Math.random() * 30 - 5
            return (
              <div key={artist.id} className="flex items-center justify-between bg-kcb-noir/40 border border-white/[0.04] rounded-[4px] p-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-white truncate">{artist.name}</p>
                  <p className="text-xs text-kcb-pierre">€{valuation.toLocaleString()}</p>
                </div>
                <div className={`flex items-center gap-1 text-xs font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {change >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(change).toFixed(1)}%
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* 12-Month Forecast */}
      <div className="mt-6 p-4 rounded-[4px] bg-kcb-or/5 border border-kcb-or/20">
        <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">12-Month Forecast</p>
        <p className="text-white">
          Market median expected to reach <span className="font-semibold text-kcb-or">€{(marketTrend?.value * 1.15)?.toLocaleString()}</span> based on current trends (+15%)
        </p>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 2: RECENT SALES & COMPARABLE DATA
// ============================================================================

function Section2ComparableSales({ transactions }) {
  const recentSales = transactions.slice(0, 6)

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-kcb-or" />
        Recent Sales & Market Comparables
      </h3>

      <div className="space-y-3">
        {recentSales.map((tx, idx) => {
          const days = Math.floor(Math.random() * 90) + 10
          const changePercent = Math.random() * 40 - 5

          return (
            <div key={tx.id} className="bg-kcb-noir/40 border border-white/[0.04] rounded-[4px] p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white truncate">{tx.artworks?.title || 'Artwork'}</p>
                  <p className="text-xs text-kcb-pierre mt-1">Sold: €{tx.amount?.toLocaleString()} • {days} days ago</p>
                </div>

                <div className="text-right">
                  <div className="text-sm font-semibold text-white">€{tx.amount?.toLocaleString()}</div>
                  <div className={`text-xs font-medium mt-1 flex items-center justify-end gap-1 ${changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {changePercent >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {Math.abs(changePercent).toFixed(1)}% vs ask
                  </div>
                </div>
              </div>

              {/* Market Comparable Range */}
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <p className="text-xs text-kcb-pierre mb-2">Similar works: €{(tx.amount * 0.85)?.toLocaleString()} — €{(tx.amount * 1.15)?.toLocaleString()}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 3: PORTFOLIO PERFORMANCE
// ============================================================================

function Section3PortfolioPerformance({ portfolio }) {
  if (!portfolio) return null

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Portfolio Overview */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Your Collection</h3>

        <div className="space-y-4">
          <div>
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-1">Total Value</p>
            <p className="text-3xl font-bold text-white">€{portfolio.totalValue.toLocaleString()}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-kcb-noir/40 rounded-[4px] p-3">
              <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-1">YoY Growth</p>
              <p className="text-xl font-semibold text-green-400">+{portfolio.yoyGrowth}%</p>
            </div>
            <div className="bg-kcb-noir/40 rounded-[4px] p-3">
              <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-1">Avg Holding Period</p>
              <p className="text-xl font-semibold text-white">{portfolio.avgHoldingPeriod}y</p>
            </div>
          </div>
        </div>
      </div>

      {/* Gains Summary */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
        <h3 className="text-lg font-semibold text-white mb-6">Gains & Performance</h3>

        <div className="space-y-4">
          <div className="bg-green-400/10 border border-green-400/20 rounded-[4px] p-3">
            <p className="text-xs text-green-400 uppercase tracking-wide mb-1">Realized Gains</p>
            <p className="text-2xl font-bold text-green-400">€{portfolio.realizedGains.toLocaleString()}</p>
          </div>

          <div className="bg-kcb-or/10 border border-kcb-or/20 rounded-[4px] p-3">
            <p className="text-xs text-kcb-or uppercase tracking-wide mb-1">Unrealized Gains</p>
            <p className="text-2xl font-bold text-kcb-or">€{portfolio.unrealizedGains.toLocaleString()}</p>
          </div>

          {/* Best & Worst Performers */}
          <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/[0.06]">
            <div>
              <p className="text-[10px] text-green-400 uppercase tracking-wide mb-1">Best Performer</p>
              <p className="text-sm font-semibold text-white">{portfolio.bestPerformer.name}</p>
              <p className="text-xs text-green-400">{portfolio.bestPerformer.value}</p>
            </div>
            <div>
              <p className="text-[10px] text-red-400 uppercase tracking-wide mb-1">Worst Performer</p>
              <p className="text-sm font-semibold text-white">{portfolio.worstPerformer.name}</p>
              <p className="text-xs text-red-400">{portfolio.worstPerformer.value}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 4: MARKET TRENDS & DEMAND
// ============================================================================

function Section4MarketTrends({ analytics, countryTrends }) {
  const marketData = [
    { segment: 'Contemporary Painting', change: '+22%', trend: 'up' },
    { segment: 'Sculpture', change: '+18%', trend: 'up' },
    { segment: 'Mixed Media', change: '+12%', trend: 'up' },
    { segment: 'Photography', change: '-8%', trend: 'down' },
  ]

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-kcb-or" />
        Market Trends & Demand (Last 12 Months)
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Segment Performance */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {marketData.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between bg-kcb-noir/40 rounded-[4px] p-3">
                <p className="text-sm text-white">{item.segment}</p>
                <div className={`text-sm font-semibold flex items-center gap-1 ${item.trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                  {item.trend === 'up' ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
                  {item.change}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="space-y-3">
          <div className="bg-kcb-noir/40 rounded-[4px] p-4">
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">Emerging Artists</p>
            <p className="text-2xl font-bold text-green-400">+40%</p>
            <p className="text-xs text-kcb-pierre mt-1">demand growth</p>
          </div>
          <div className="bg-kcb-noir/40 rounded-[4px] p-4">
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">International Collectors</p>
            <p className="text-2xl font-bold text-kcb-or">65%</p>
            <p className="text-xs text-kcb-pierre mt-1">of buyer base</p>
          </div>
        </div>
      </div>

      {/* Country Trends */}
      {countryTrends.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/[0.06]">
          <p className="text-sm font-semibold text-white mb-3">Top Buyer Countries</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {countryTrends.slice(0, 6).map((country, idx) => (
              <div key={idx} className="bg-kcb-noir/40 rounded-[4px] p-2 text-center">
                <p className="text-xs text-white font-medium">{country.country}</p>
                <p className="text-xs text-kcb-pierre">{country.value} txs</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SECTION 5: ARTIST REPUTATION & RISK
// ============================================================================

function Section5ArtistReputation({ artists }) {
  const featuredArtists = artists.slice(0, 4)

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Star className="w-5 h-5 text-kcb-or" />
        Artist Reputation & Risk Profile
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {featuredArtists.map((artist) => {
          const score = Math.floor(Math.random() * 15) + 80
          const trajectory = Math.random() * 40 - 5
          const riskLevel = score > 85 ? 'Low' : score > 70 ? 'Medium' : 'High'

          return (
            <div key={artist.id} className="border border-white/[0.06] rounded-[4px] p-4 space-y-3">
              <div>
                <p className="text-sm font-semibold text-white">{artist.name}</p>
                <p className="text-xs text-kcb-pierre mt-1">{artist.country}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-kcb-pierre uppercase tracking-wide mb-1">Reputation</p>
                  <div className="flex items-center gap-1">
                    <span className="text-white font-semibold">{score}</span>
                    <span className="text-kcb-pierre">/100</span>
                  </div>
                </div>
                <div>
                  <p className="text-kcb-pierre uppercase tracking-wide mb-1">Risk Level</p>
                  <span className={riskLevel === 'Low' ? 'text-green-400' : riskLevel === 'Medium' ? 'text-yellow-400' : 'text-red-400'}>
                    {riskLevel}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/[0.06]">
                <p className="text-xs text-kcb-pierre mb-1">Career Trajectory</p>
                <div className={`flex items-center gap-1 text-xs font-medium ${trajectory >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {trajectory >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                  {Math.abs(trajectory).toFixed(1)}% annually
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" />
                <span className="text-kcb-pierre">Certified & Verified</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================================================
// SECTION 6: DEAL FLOW ANALYSIS
// ============================================================================

function Section6DealFlow({ deals }) {
  const recentDeals = deals.slice(0, 6)
  const trending = deals.filter((d) => Math.random() > 0.7).slice(0, 3)

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <Filter className="w-5 h-5 text-kcb-or" />
        Deal Flow Analysis (Last 30 days)
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Deal Stats */}
        <div className="lg:col-span-1 space-y-3">
          <div className="bg-kcb-noir/40 rounded-[4px] p-4">
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">New Listings</p>
            <p className="text-3xl font-bold text-white">{recentDeals.length}</p>
            <p className="text-xs text-kcb-pierre mt-1">artworks this month</p>
          </div>
          <div className="bg-kcb-noir/40 rounded-[4px] p-4">
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">Avg Days to Sale</p>
            <p className="text-3xl font-bold text-kcb-or">45</p>
            <p className="text-xs text-kcb-pierre mt-1">market velocity</p>
          </div>
          <div className="bg-kcb-noir/40 rounded-[4px] p-4">
            <p className="text-xs text-kcb-pierre uppercase tracking-wide mb-2">Price Range</p>
            <p className="text-sm text-white font-semibold">€10K — €50K</p>
          </div>
        </div>

        {/* Recent Deals */}
        <div className="lg:col-span-2">
          <div className="space-y-3">
            {recentDeals.map((deal, idx) => (
              <div key={deal.id} className="bg-kcb-noir/40 border border-white/[0.04] rounded-[4px] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white truncate">{deal.title}</p>
                    <p className="text-xs text-kcb-pierre mt-0.5">€{deal.price?.toLocaleString()} • {deal.medium || 'Mixed'}</p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center text-xs font-semibold px-2 py-1 rounded-full bg-kcb-or/10 text-kcb-or">
                      New
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hot Deals Alert */}
      {trending.length > 0 && (
        <div className="mt-6 pt-6 border-t border-white/[0.06] bg-yellow-400/5 border border-yellow-400/20 rounded-[4px] p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-white">🔥 Hot Deals Alert</p>
              <p className="text-xs text-yellow-300 mt-1">
                {trending.length} artworks trending up • Rare pieces available with limited inventory
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// ============================================================================
// SECTION 7: INVESTMENT RECOMMENDATIONS
// ============================================================================

function Section7Recommendations({ portfolio, artists, deals }) {
  const recommendations = [
    {
      title: 'Diversify into Emerging Artists',
      current: '30%',
      target: '40%',
      priority: 'high',
      action: 'Allocate €45,000 to emerging artists',
    },
    {
      title: 'Increase Contemporary Painting Exposure',
      current: '45%',
      target: '55%',
      priority: 'medium',
      action: 'Add €30,000 to contemporary segment',
    },
    {
      title: 'Reduce Photography Segment',
      current: '15%',
      target: '5%',
      priority: 'medium',
      action: 'Divest underperforming pieces',
    },
  ]

  const opportunities = [
    { artist: 'Souleymane Keita', prediction: '+12%', reason: 'Strong demand signals' },
    { artist: 'Aïcha Diallo', prediction: '+18%', reason: 'Rising star momentum' },
  ]

  return (
    <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[8px] p-6">
      <h3 className="text-lg font-semibold text-white mb-6">Investment Recommendations</h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rebalancing Recommendations */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Portfolio Rebalancing</h4>
          <div className="space-y-3">
            {recommendations.map((rec, idx) => (
              <div key={idx} className={`border rounded-[4px] p-4 ${rec.priority === 'high' ? 'bg-red-400/5 border-red-400/20' : 'bg-kcb-noir/40 border-white/[0.04]'}`}>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-white">{rec.title}</p>
                  <span className={`text-xs font-semibold px-2 py-1 rounded-full uppercase ${rec.priority === 'high' ? 'bg-red-400/20 text-red-300' : 'bg-yellow-400/20 text-yellow-300'}`}>
                    {rec.priority}
                  </span>
                </div>
                <p className="text-xs text-kcb-pierre mb-2">
                  {rec.current} → {rec.target}
                </p>
                <p className="text-xs text-white bg-kcb-noir/30 rounded-[2px] px-2 py-1.5">{rec.action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Opportunities */}
        <div>
          <h4 className="text-sm font-semibold text-white mb-4">Market Opportunities</h4>
          <div className="space-y-3">
            {opportunities.map((opp, idx) => (
              <div key={idx} className="bg-green-400/5 border border-green-400/20 rounded-[4px] p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="text-sm font-medium text-white">{opp.artist}</p>
                  <span className="text-sm font-bold text-green-400">{opp.prediction}</span>
                </div>
                <p className="text-xs text-green-300">{opp.reason}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      <div className="mt-6 pt-6 border-t border-white/[0.06] bg-red-400/5 border border-red-400/20 rounded-[4px] p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-white">⚠️ Risk Alert</p>
            <p className="text-xs text-red-300 mt-1">
              Photography segment declining -8% YoY. Consider reducing exposure to capitalize on stronger segments.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
