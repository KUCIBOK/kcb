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
        {error && <div className="text-xs text-red-400 bg-red-400/10 p-4 rounded-[4px]">{error}</div>}
      </div>
    )
  }

  const countryTrends = analytics.data?.countryTrends || []
  const topArtists = analytics.data?.topArtists || []
  const mediumTrends = analytics.data?.mediumTrends || []
  const opportunities = analytics.data?.opportunities || []

  // Chart data
  const chartData = {
    labels: mediumTrends.slice(0, 6).map((m) => m.medium || 'Other'),
    datasets: [
      {
        label: 'Growth YTD (%)',
        data: mediumTrends.slice(0, 6).map((m) => m.growth || 0),
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
        ticks: { color: '#9AA0AC', callback: (v) => `+${v}%` },
        grid: { color: 'rgba(255,255,255,0.04)' },
      },
      x: { ticks: { color: '#9AA0AC' }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
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

      {/* Country Trends */}
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Globe className="w-4 h-4 text-kcb-or" /> Country Market Trends
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-white/[0.06]">
              <tr className="text-xs text-kcb-pierre">
                <th className="text-left px-6 py-3">Country</th>
                <th className="text-right px-6 py-3">Growth</th>
                <th className="text-right px-6 py-3">Volume</th>
                <th className="text-right px-6 py-3">Avg Price</th>
                <th className="text-right px-6 py-3">Artists</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {countryTrends.slice(0, 6).map((country, i) => (
                <tr key={i} className="hover:bg-kcb-noir/50 transition">
                  <td className="px-6 py-4 text-white">{country.country}</td>
                  <td className="text-right px-6 py-4">
                    <span
                      className={`flex items-center justify-end gap-1 ${
                        country.growth > 0 ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {country.growth > 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(country.growth)}%
                    </span>
                  </td>
                  <td className="text-right px-6 py-4 text-kcb-pierre">{country.volume}</td>
                  <td className="text-right px-6 py-4 text-kcb-pierre">{country.avgPrice}</td>
                  <td className="text-right px-6 py-4 text-white font-semibold">{country.artists}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {/* Top Artists */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Award className="w-4 h-4 text-kcb-or" /> Trending Artists
          </h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {topArtists.slice(0, 6).map((artist, i) => (
            <div key={i} className="px-6 py-4 flex items-center justify-between hover:bg-kcb-noir/50 transition">
              <div>
                <p className="text-sm font-semibold text-white">{artist.name}</p>
                <p className="text-xs text-kcb-pierre">{artist.country}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-emerald-400">{artist.appreciation}</p>
                <p className="text-xs text-kcb-pierre">Buzz: {artist.buzz} | {artist.exhibitions} exhibitions</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Medium Breakdown */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6"
      >
        <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-6">
          <BarChart3 className="w-4 h-4 text-kcb-or" /> Growth by Medium
        </h3>
        <Bar data={chartData} options={chartOptions} />
      </motion.div>

      {/* Market Opportunities */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden"
      >
        <div className="px-6 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-kcb-or" /> Market Opportunities
          </h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {opportunities.map((opp, i) => (
            <div key={i} className="px-6 py-4 flex gap-4">
              <div
                className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${
                  opp.type === 'buy'
                    ? 'bg-emerald-400'
                    : opp.type === 'sell'
                      ? 'bg-red-400'
                      : 'bg-kcb-or'
                }`}
              />
              <p className="text-sm text-kcb-pierre">
                <span className="font-semibold text-white capitalize">{opp.type}: </span>
                {opp.text}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Last Updated */}
      <div className="text-xs text-kcb-pierre/60 text-center">
        Updated {analytics.data?.lastUpdated ? new Date(analytics.data.lastUpdated).toLocaleString() : 'just now'}
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
