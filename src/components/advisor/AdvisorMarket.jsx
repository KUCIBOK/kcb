import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Globe, Award, Zap, ArrowUp, ArrowDown, BarChart3, Loader } from 'lucide-react'
import { PlanGate } from '../shared/PlanGate'
import { PLAN_STARTER } from '../../utils/planUtils'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { getProfessionalAnalytics } from '../../api/useProfessionalAnalytics'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function AdvisorMarketContent() {
  const [analytics, setAnalytics] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [period, setPeriod] = useState('month')

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    const result = await getProfessionalAnalytics(period)

    if (result.error) {
      setError(result.error)
      setAnalytics(null)
    } else {
      setAnalytics(result)
      setError(null)
    }
    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader className="w-6 h-6 animate-spin text-kcb-or" />
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-playfair text-xl text-white">Market Intelligence</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">Real-time market analytics & trends</p>
        </div>
        {error && (
          <div className="text-xs text-red-400 bg-red-400/10 p-4 rounded-[4px] space-y-2">
            <p className="font-semibold">⚠️ Unable to load market analytics</p>
            <p className="text-red-300/70">{error}</p>
          </div>
        )}
      </div>
    )
  }

  const countryTrends = analytics.data?.countryTrends || []
  const mediumPerformance = analytics.data?.mediumPerformance || []
  const marketTrend = analytics.data?.marketTrend
  const sourcing = analytics.data?.sourcing || []
  const conversion = analytics.data?.conversion

  // Chart data for sales volume by medium
  const chartData = {
    labels: mediumPerformance.slice(0, 6).map((m) => m.medium || 'Other'),
    datasets: [
      {
        label: 'Sales Volume',
        data: mediumPerformance.slice(0, 6).map((m) => m.value || 0),
        backgroundColor: ['#C9A84C', '#8B6914', '#C9A84C', '#4A4E5A', '#8B6914', '#C9A84C'],
        borderRadius: 4,
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { color: '#9AA0AC', callback: (v) => `${v}` },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      x: { ticks: { color: '#9AA0AC' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  }

  // Helper: display confidence badge
  const ConfidenceBadge = ({ confidence, insufficientData, sampleSize }) => {
    if (insufficientData) {
      return (
        <span className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded bg-amber-900/20 border border-amber-700/30 text-amber-200">
          ⚠️ Données insuffisantes (n={sampleSize})
        </span>
      )
    }
    const confLabels = {
      0.3: 'Faible confiance',
      0.6: 'Confiance moyenne',
      0.9: 'Haute confiance',
    }
    const confColors = {
      0.3: 'bg-red-900/20 border-red-700/30 text-red-200',
      0.6: 'bg-yellow-900/20 border-yellow-700/30 text-yellow-200',
      0.9: 'bg-emerald-900/20 border-emerald-700/30 text-emerald-200',
    }
    return (
      <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded border ${confColors[confidence] || confColors[0.3]}`}>
        📊 {confLabels[confidence] || 'Confiance'} (n={sampleSize})
      </span>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-playfair text-xl text-white">Market Intelligence</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">Real-time African art market analytics</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="appearance-none bg-kcb-ardoise border border-white/[0.08] text-white text-xs px-3 py-1.5 pr-7 rounded-[4px] focus:outline-none focus:border-kcb-or cursor-pointer"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
        </div>
      </div>

      {/* Market Trend Summary */}
      {marketTrend && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6">
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-kcb-or" /> {marketTrend.label}
            </h3>
            <ConfidenceBadge confidence={marketTrend.confidence} insufficientData={marketTrend.insufficientData} sampleSize={marketTrend.sampleSize} />
          </div>
          {marketTrend.insufficientData ? (
            <div className="py-8 text-center text-kcb-pierre/60">
              <p>Données insuffisantes pour cette période</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-kcb-pierre mb-1">Median</p>
                <p className="text-lg font-semibold text-white">€{marketTrend.value.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-kcb-pierre mb-1">Min</p>
                <p className="text-lg font-semibold text-white">€{marketTrend.range.min.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-kcb-pierre mb-1">Max</p>
                <p className="text-lg font-semibold text-white">€{marketTrend.range.max.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-kcb-pierre mb-1">Volatility</p>
                <p className="text-lg font-semibold text-white">{(marketTrend.volatility || 0).toFixed(2)}</p>
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Country Trends */}
      {countryTrends.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-kcb-or" /> Sales by Country
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06]">
                <tr className="text-xs text-kcb-pierre">
                  <th className="text-left px-6 py-3">Country</th>
                  <th className="text-right px-6 py-3">Transactions</th>
                  <th className="text-right px-6 py-3">Median Price</th>
                  <th className="text-right px-6 py-3">Total Volume</th>
                  <th className="text-center px-6 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {countryTrends.slice(0, 8).map((country, i) => (
                  <tr key={i} className="hover:bg-kcb-noir/50 transition">
                    <td className="px-6 py-4 text-white">{country.country}</td>
                    <td className="text-right px-6 py-4 text-white font-semibold">{country.value}</td>
                    <td className="text-right px-6 py-4 text-kcb-pierre">€{(country.medianPrice || 0).toLocaleString()}</td>
                    <td className="text-right px-6 py-4 text-kcb-pierre">€{(country.volume || 0).toLocaleString()}</td>
                    <td className="text-center px-6 py-4 text-xs">
                      {country.insufficientData ? (
                        <span className="text-amber-300">⚠️ n={country.sampleSize}</span>
                      ) : (
                        <span className="text-emerald-300">✓ n={country.sampleSize}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 text-center text-kcb-pierre/60">
          No sales data available for this period
        </motion.div>
      )}

      {/* Medium Performance */}
      {mediumPerformance.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-kcb-or" /> Performance by Medium
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06]">
                <tr className="text-xs text-kcb-pierre">
                  <th className="text-left px-6 py-3">Medium</th>
                  <th className="text-right px-6 py-3">Sales</th>
                  <th className="text-right px-6 py-3">Median Price</th>
                  <th className="text-right px-6 py-3">Sale Rate</th>
                  <th className="text-center px-6 py-3">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {mediumPerformance.slice(0, 8).map((medium, i) => (
                  <tr key={i} className="hover:bg-kcb-noir/50 transition">
                    <td className="px-6 py-4 text-white">{medium.medium}</td>
                    <td className="text-right px-6 py-4 text-white font-semibold">{medium.value}</td>
                    <td className="text-right px-6 py-4 text-kcb-pierre">€{(medium.medianPrice || 0).toLocaleString()}</td>
                    <td className="text-right px-6 py-4 text-emerald-300">{(medium.saleRate || 0).toFixed(1)}%</td>
                    <td className="text-center px-6 py-4 text-xs">
                      {medium.insufficientData ? (
                        <span className="text-amber-300">⚠️ n={medium.sampleSize}</span>
                      ) : (
                        <span className="text-emerald-300">✓ n={medium.sampleSize}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      ) : null}

      {/* Sales Volume Chart */}
      {mediumPerformance.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
            <BarChart3 className="w-4 h-4 text-kcb-or" /> Sales Volume by Medium
          </h3>
          <Bar data={chartData} options={chartOptions} />
        </motion.div>
      )}

      {/* Conversion Funnel */}
      {conversion && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
            <Zap className="w-4 h-4 text-kcb-or" /> Conversion Funnel
          </h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-kcb-pierre">Views</span>
                <span className="text-xs font-semibold text-white">{conversion.views} artworks</span>
              </div>
              <div className="h-2 bg-kcb-noir rounded-full overflow-hidden">
                <div className="h-full bg-kcb-or" style={{ width: '100%' }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-kcb-pierre">Likes</span>
                <span className="text-xs font-semibold text-white">{conversion.likes} ({(conversion.rates?.viewToLike || 0).toFixed(1)}%)</span>
              </div>
              <div className="h-2 bg-kcb-noir rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600" style={{ width: `${Math.min(conversion.rates?.viewToLike || 0, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-kcb-pierre">Inquiries</span>
                <span className="text-xs font-semibold text-white">{conversion.inquiries} ({(conversion.rates?.likeToInquiry || 0).toFixed(1)}%)</span>
              </div>
              <div className="h-2 bg-kcb-noir rounded-full overflow-hidden">
                <div className="h-full bg-blue-600" style={{ width: `${Math.min(conversion.rates?.likeToInquiry || 0, 100)}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-xs text-kcb-pierre">Confirmed Sales</span>
                <span className="text-xs font-semibold text-white">{conversion.sales} ({(conversion.rates?.inquiryToSale || 0).toFixed(1)}%)</span>
              </div>
              <div className="h-2 bg-kcb-noir rounded-full overflow-hidden">
                <div className="h-full bg-yellow-600" style={{ width: `${Math.min(conversion.rates?.inquiryToSale || 0, 100)}%` }} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sourcing Intelligence */}
      {sourcing.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-kcb-or" /> Buyer Inquiry Patterns
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/[0.06]">
                <tr className="text-xs text-kcb-pierre">
                  <th className="text-left px-6 py-3">Category</th>
                  <th className="text-right px-6 py-3">Inquiries</th>
                  <th className="text-right px-6 py-3">Median Budget</th>
                  <th className="text-left px-6 py-3">Top Countries</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {sourcing.slice(0, 6).map((item, i) => (
                  <tr key={i} className="hover:bg-kcb-noir/50 transition">
                    <td className="px-6 py-4 text-white">{item.category}</td>
                    <td className="text-right px-6 py-4 text-white font-semibold">{item.value}</td>
                    <td className="text-right px-6 py-4 text-kcb-pierre">€{(item.medianBudget || 0).toLocaleString()}</td>
                    <td className="px-6 py-4 text-kcb-pierre text-xs">{(item.buyerCountries || []).slice(0, 3).join(', ') || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* Data Source Footer */}
      <div className="text-xs text-kcb-pierre/60 text-center space-y-1 border-t border-white/[0.06] pt-4 mt-6">
        <p className="text-white/60">
          📊 {analytics.data?.dataSource || 'Kucibok Platform - Confirmed Transactions Only'}
        </p>
        <p>
          Updated {analytics.data?.timestamp ? new Date(analytics.data.timestamp).toLocaleString() : 'just now'}
        </p>
        {analytics.cached && <p className="text-kcb-or/60">💾 From cache</p>}
        {analytics.data?.dataQuality && (
          <div className="text-white/50 text-xs mt-3 space-y-0.5">
            <p>✓ No random metrics | ✓ Only confirmed sales | ✓ Confidence indicators included</p>
          </div>
        )}
      </div>
    </div>
  )
}

export function AdvisorMarket() {
  return (
    <PlanGate
      minLevel={PLAN_STARTER}
      feature="Market Intelligence"
      description="Access real-time market analytics and artist insights"
    >
      <AdvisorMarketContent />
    </PlanGate>
  )
}
