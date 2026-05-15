import { useState } from 'react'
import {
  DollarSign,
  Heart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
  Check,
  Pause,
} from 'lucide-react'

export function Analytics({ user, title, artworks, artistProfile }) {
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Statistiques calculées depuis les vraies données
  const list = Array.isArray(artworks) ? artworks : []
  const soldArtworks = list.filter((a) => a.sold === true || a.status === 'sold').length
  const totalRevenue = list.reduce((sum, a) => sum + Number(a.sold_price || 0), 0)
  const approvedCount = list.filter((a) => a.status === 'approved').length
  const pendingCount = list.filter((a) => a.status === 'pending').length

  const stats = {
    soldArtworks,
    totalRevenue,
    approvedCount,
    pendingCount,
    totalArtworks: list.length,
  }

  // Revenus par mois sur l'année courante (données réelles)
  const currentYear = new Date().getFullYear()
  const monthLabels = [
    'Jan',
    'Fév',
    'Mar',
    'Avr',
    'Mai',
    'Juin',
    'Juil',
    'Aoû',
    'Sep',
    'Oct',
    'Nov',
    'Déc',
  ]
  const monthlyRevenue = monthLabels.map((_, month) =>
    list
      .filter(
        (a) =>
          a.sold &&
          a.sold_at &&
          new Date(a.sold_at).getMonth() === month &&
          new Date(a.sold_at).getFullYear() === currentYear
      )
      .reduce((sum, a) => sum + Number(a.sold_price || 0), 0)
  )

  const revenueData = {
    labels: monthLabels,
    datasets: [{ label: 'Revenus (XOF)', data: monthlyRevenue }],
  }

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k'
    }
    return num.toString()
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-3xl font-bold text-white">Analytique</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/15 text-amber-300 border border-amber-500/30">
              Données de démonstration
            </span>
          </div>
          <p className="text-kcb-pierre mt-1">Suivez vos performances en temps réel</p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            autoRefresh
              ? 'bg-green-600/20 text-green-300 border border-green-600/30'
              : 'bg-kcb-ardoise text-kcb-sable'
          }`}
        >
          {autoRefresh ? (
            <>
              <Check className="w-4 h-4 inline mr-1" /> Auto-refresh
            </>
          ) : (
            <>
              <Pause className="w-4 h-4 inline mr-1" /> Paused
            </>
          )}
        </button>
      </div>

      {/* Cartes KPI principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Œuvres totales"
          value={stats.totalArtworks}
          change={`${stats.approvedCount} approuvées`}
          trend="up"
          icon={<BarChart3 className="w-5 h-5" />}
          color="kcb"
        />
        <KPICard
          label="Œuvres vendues"
          value={stats.soldArtworks}
          change={stats.pendingCount > 0 ? `${stats.pendingCount} en attente` : 'À jour'}
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          label="Revenu total"
          value={`${stats.totalRevenue.toLocaleString('fr-FR')} XOF`}
          change="Ventes réalisées"
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          label="En attente"
          value={stats.pendingCount}
          change="Œuvres à valider"
          trend={stats.pendingCount > 0 ? 'down' : 'up'}
          icon={<Heart className="w-5 h-5" />}
          color="red"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Répartition œuvres */}
        <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Répartition du catalogue</h3>
          <div className="space-y-3">
            {[
              { label: 'Approuvées', count: stats.approvedCount, color: 'bg-green-500' },
              { label: 'Vendues', count: stats.soldArtworks, color: 'bg-kcb-or' },
              { label: 'En attente', count: stats.pendingCount, color: 'bg-yellow-500' },
            ].map(({ label, count, color }) => (
              <div key={label}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-kcb-pierre">{label}</span>
                  <span className="text-white font-medium">{count}</span>
                </div>
                <div className="h-2 bg-white/[0.06] rounded-full overflow-hidden">
                  <div
                    className={`h-full ${color} rounded-full transition-all`}
                    style={{
                      width:
                        stats.totalArtworks > 0 ? `${(count / stats.totalArtworks) * 100}%` : '0%',
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenus mensuels réels */}
        <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenus {currentYear} (XOF)</h3>
          <div className="h-48 flex items-end justify-between gap-1">
            {revenueData.labels.map((month, idx) => {
              const maxVal = Math.max(...revenueData.datasets[0].data, 1)
              const h = (revenueData.datasets[0].data[idx] / maxVal) * 100
              return (
                <div key={idx} className="flex-1 flex flex-col items-center">
                  <div
                    className="w-full bg-green-500/80 rounded-t hover:bg-green-500 transition"
                    style={{ height: `${Math.max(h, 2)}%` }}
                  />
                  <span className="text-kcb-pierre text-xs mt-2">{month.slice(0, 3)}</span>
                </div>
              )
            })}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-kcb-pierre">
              Total: {stats.totalRevenue.toLocaleString('fr-FR')} XOF
            </span>
            <span className="text-kcb-or">{stats.soldArtworks} ventes</span>
          </div>
        </div>
      </div>

      {/* Top œuvres vendues réelles */}
      {stats.soldArtworks > 0 && (
        <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-6">
          <h3 className="text-lg font-bold text-white mb-4">Œuvres vendues</h3>
          <div className="space-y-3">
            {list
              .filter((a) => a.sold === true || a.status === 'sold')
              .slice(0, 5)
              .map((artwork, idx) => (
                <div
                  key={artwork.id ?? idx}
                  className="flex items-center justify-between p-3 bg-kcb-ardoise/50 rounded-[4px]"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-bold text-kcb-pierre">#{idx + 1}</span>
                    <div>
                      <p className="text-white font-medium">{artwork.title}</p>
                      <p className="text-xs text-kcb-pierre">{artwork.kucibok_id ?? '—'}</p>
                    </div>
                  </div>
                  <span className="text-green-400 font-semibold">
                    {Number(artwork.sold_price || 0).toLocaleString('fr-FR')}{' '}
                    {artwork.currency ?? 'XOF'}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}

function KPICard({ label, value, change, trend, icon, color }) {
  const colorClasses = {
    blue: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    kcb: 'bg-kcb-bronze/10 border-kcb-bronze/30 text-kcb-sable',
    red: 'bg-red-500/10 border-red-500/30 text-red-300',
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
  }

  return (
    <div className={`border rounded-[4px] p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium opacity-75">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      <div className="flex items-center gap-1 text-xs mt-2 opacity-75">
        {trend === 'up' ? (
          <ArrowUpRight className="w-3 h-3 text-green-400" />
        ) : (
          <ArrowDownRight className="w-3 h-3 text-red-400" />
        )}
        {change}
      </div>
    </div>
  )
}
