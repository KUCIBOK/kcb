import { useState, useEffect } from 'react'
import {
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  Clock,
  Eye,
  Heart,
  Target,
  Percent,
  Calendar,
  DollarSign,
  Package,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Activity,
} from 'lucide-react'
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { getProfessionalAnalytics, getRealTimeStats } from '../../api/useProfessionalAnalytics'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export function AnalytiquePro() {
  const [analytics, setAnalytics] = useState(null)
  const [realtime, setRealtime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [period, setPeriod] = useState('month')
  const [error, setError] = useState('')

  useEffect(() => {
    loadAnalytics()
  }, [period])

  const loadAnalytics = async () => {
    setLoading(true)
    setError('')

    const [analyticsData, realtimeData] = await Promise.all([
      getProfessionalAnalytics(period),
      getRealTimeStats(),
    ])

    if (!analyticsData.error) {
      setAnalytics(analyticsData)
    } else {
      setError(analyticsData.error)
    }

    if (!realtimeData.error) {
      setRealtime(realtimeData)
    }

    setLoading(false)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-kcb-or" />
      </div>
    )
  }

  // Prepare chart data
  const categoryLabels = analytics?.salesByCategory ? Object.keys(analytics.salesByCategory) : []
  const categoryData = analytics?.salesByCategory
    ? Object.values(analytics.salesByCategory).map((c) => c.count)
    : []
  const categoryRevenue = analytics?.salesByCategory
    ? Object.values(analytics.salesByCategory).map((c) => c.revenue)
    : []

  const priceRangeLabels = analytics?.salesByPriceRange
    ? Object.keys(analytics.salesByPriceRange)
    : []
  const priceRangeData = analytics?.salesByPriceRange
    ? Object.values(analytics.salesByPriceRange).map((p) => p.count)
    : []

  const periodLabels = analytics?.salesByPeriod ? analytics.salesByPeriod.map((p) => p.month) : []
  const periodData = analytics?.salesByPeriod ? analytics.salesByPeriod.map((p) => p.count) : []

  // Chart options
  const barOptions = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: '#333' } },
      x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
    },
  }

  const pieOptions = {
    plugins: { legend: { labels: { color: '#fff' } } },
    maintainAspectRatio: false,
  }

  const lineOptions = {
    responsive: true,
    plugins: { legend: { labels: { color: '#fff' } } },
    scales: {
      y: { beginAtZero: true, ticks: { color: '#fff' }, grid: { color: '#333' } },
      x: { ticks: { color: '#fff' }, grid: { color: '#333' } },
    },
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Analytique Pro</h1>
          <p className="text-kcb-pierre">KPIs avancés et analyses détaillées</p>
        </div>
        <div className="flex gap-2">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="bg-kcb-ardoise border border-white/[0.06] text-white rounded-[4px] px-4 py-2 focus:border-kcb-or focus:outline-none"
          >
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="quarter">Ce trimestre</option>
            <option value="year">Cette année</option>
            <option value="all">Tout</option>
          </select>
          <button
            onClick={loadAnalytics}
            className="p-2 bg-kcb-or hover:bg-kcb-or/90 text-white rounded-[4px] transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-900/50 border border-red-700 rounded-[4px] p-4 text-red-200">
          {error}
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Percent className="w-5 h-5 text-kcb-bronze" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.kpis?.conversionRate || 0}%</p>
          <p className="text-xs text-kcb-pierre mt-1">Taux de conversion</p>
        </div>

        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Clock className="w-5 h-5 text-kcb-or" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.kpis?.averageSaleTime || 0}</p>
          <p className="text-xs text-kcb-pierre mt-1">Jours de vente</p>
        </div>

        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Eye className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.kpis?.totalViews || 0}</p>
          <p className="text-xs text-kcb-pierre mt-1">Vues totales</p>
        </div>

        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Heart className="w-5 h-5 text-pink-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.kpis?.totalFavorites || 0}</p>
          <p className="text-xs text-kcb-pierre mt-1">Favoris</p>
        </div>

        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Target className="w-5 h-5 text-orange-400" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.kpis?.viewsToSale || 0}</p>
          <p className="text-xs text-kcb-pierre mt-1">Vues → Vente</p>
        </div>

        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <DollarSign className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {((analytics?.overview?.totalRevenue || 0) / 1000000).toFixed(2)}M
          </p>
          <p className="text-xs text-kcb-pierre mt-1">Revenu total</p>
        </div>
      </div>

      {/* Real-time Stats */}
      {realtime && (
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex items-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-green-400" />
            <h3 className="text-lg font-semibold text-white">Temps réel</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-kcb-noir/50 rounded-[4px] p-3 text-center">
              <p className="text-2xl font-bold text-green-400">{realtime.todayViews}</p>
              <p className="text-xs text-kcb-pierre">Vues aujourd'hui</p>
            </div>
            <div className="bg-kcb-noir/50 rounded-[4px] p-3 text-center">
              <p className="text-2xl font-bold text-kcb-or">{realtime.weekViews}</p>
              <p className="text-xs text-kcb-pierre">Vues cette semaine</p>
            </div>
            <div className="bg-kcb-noir/50 rounded-[4px] p-3 text-center">
              <p className="text-2xl font-bold text-kcb-bronze">{realtime.activeListings}</p>
              <p className="text-xs text-kcb-pierre">Annonces actives</p>
            </div>
            <div className="bg-kcb-noir/50 rounded-[4px] p-3 text-center">
              <p className="text-2xl font-bold text-orange-400">{realtime.inquiriesCount}</p>
              <p className="text-xs text-kcb-pierre">Demandes</p>
            </div>
          </div>
        </div>
      )}

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Package className="w-5 h-5 text-kcb-pierre" />
          </div>
          <p className="text-2xl font-bold text-white">{analytics?.overview?.totalArtworks || 0}</p>
          <p className="text-xs text-kcb-pierre mt-1">Total oeuvres</p>
        </div>
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <ArrowUp className="w-5 h-5 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-green-400">
            {analytics?.overview?.soldArtworks || 0}
          </p>
          <p className="text-xs text-kcb-pierre mt-1">Vendues</p>
        </div>
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <ArrowDown className="w-5 h-5 text-kcb-or" />
          </div>
          <p className="text-2xl font-bold text-kcb-or">
            {analytics?.overview?.unsoldArtworks || 0}
          </p>
          <p className="text-xs text-kcb-pierre mt-1">En vente</p>
        </div>
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <div className="flex justify-between items-center mb-2">
            <Calendar className="w-5 h-5 text-yellow-400" />
          </div>
          <p className="text-2xl font-bold text-yellow-400">
            {analytics?.overview?.pendingArtworks || 0}
          </p>
          <p className="text-xs text-kcb-pierre mt-1">En attente</p>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Sales by Category */}
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <PieChartIcon className="w-5 h-5" />
            Ventes par catégorie
          </h3>
          <div className="h-64">
            {categoryLabels.length > 0 ? (
              <Pie
                data={{
                  labels: categoryLabels,
                  datasets: [
                    {
                      data: categoryData,
                      backgroundColor: [
                        'rgba(59,130,246,0.8)',
                        'rgba(168,85,247,0.8)',
                        'rgba(34,197,94,0.8)',
                        'rgba(251,191,36,0.8)',
                        'rgba(239,68,68,0.8)',
                        'rgba(236,72,153,0.8)',
                        'rgba(20,184,166,0.8)',
                        'rgba(107,114,128,0.8)',
                      ],
                    },
                  ],
                }}
                options={pieOptions}
              />
            ) : (
              <p className="text-kcb-pierre text-center py-8">Aucune donnée</p>
            )}
          </div>
        </div>

        {/* Sales by Price Range */}
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Ventes par fourchette de prix
          </h3>
          <div className="h-64">
            {priceRangeLabels.length > 0 ? (
              <Bar
                data={{
                  labels: priceRangeLabels,
                  datasets: [
                    {
                      label: 'Nombre de ventes',
                      data: priceRangeData,
                      backgroundColor: 'rgba(59,130,246,0.7)',
                      borderRadius: 6,
                    },
                  ],
                }}
                options={barOptions}
              />
            ) : (
              <p className="text-kcb-pierre text-center py-8">Aucune donnée</p>
            )}
          </div>
        </div>
      </div>

      {/* Sales Trend */}
      <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
        <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-kcb-bronze" />
          Tendance des ventes (12 mois)
        </h3>
        <div className="h-64">
          {periodLabels.length > 0 ? (
            <Line
              data={{
                labels: periodLabels,
                datasets: [
                  {
                    label: 'Ventes',
                    data: periodData,
                    borderColor: 'rgba(168,85,247,1)',
                    backgroundColor: 'rgba(168,85,247,0.1)',
                    fill: true,
                    tension: 0.4,
                  },
                ],
              }}
              options={lineOptions}
            />
          ) : (
            <p className="text-kcb-pierre text-center py-8">Aucune donnée</p>
          )}
        </div>
      </div>

      {/* Top Artworks */}
      {analytics?.topArtworks?.length > 0 && (
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-yellow-400" />
            Top 10 Oeuvres vendues
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-3 text-kcb-pierre">#</th>
                  <th className="text-left py-2 px-3 text-kcb-pierre">Titre</th>
                  <th className="text-left py-2 px-3 text-kcb-pierre">Artiste</th>
                  <th className="text-right py-2 px-3 text-kcb-pierre">Prix de vente</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topArtworks.map((artwork, idx) => (
                  <tr key={idx} className="border-b border-white/[0.06]/50 hover:bg-kcb-ardoise/50">
                    <td className="py-2 px-3 text-kcb-pierre">{idx + 1}</td>
                    <td className="py-2 px-3 text-white font-medium truncate max-w-xs">
                      {artwork.title}
                    </td>
                    <td className="py-2 px-3 text-kcb-sable">{artwork.artist}</td>
                    <td className="py-2 px-3 text-right text-green-400 font-medium">
                      {Number(artwork.price).toLocaleString()} CFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Top Artists */}
      {analytics?.topArtists?.length > 0 && (
        <div className="bg-kcb-ardoise rounded-[4px] p-4 border border-white/[0.06]">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-kcb-or" />
            Top Artistes par revenue
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-2 px-3 text-kcb-pierre">#</th>
                  <th className="text-left py-2 px-3 text-kcb-pierre">Artiste</th>
                  <th className="text-right py-2 px-3 text-kcb-pierre">Ventes</th>
                  <th className="text-right py-2 px-3 text-kcb-pierre">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {analytics.topArtists.map((artist, idx) => (
                  <tr key={idx} className="border-b border-white/[0.06]/50 hover:bg-kcb-ardoise/50">
                    <td className="py-2 px-3 text-kcb-pierre">{idx + 1}</td>
                    <td className="py-2 px-3 text-white font-medium">{artist.name}</td>
                    <td className="py-2 px-3 text-right text-kcb-sable">{artist.count}</td>
                    <td className="py-2 px-3 text-right text-green-400 font-medium">
                      {(artist.revenue / 1000000).toFixed(2)}M CFA
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}

export default AnalytiquePro
