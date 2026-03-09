import { useState, useEffect } from 'react';
import {
  DollarSign,
  Eye,
  Heart,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';

export function Analytics({ user, title, artworks, artistProfile }) {
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Données par défaut réalistes
  const stats = {
    profileViews: 1245,
    totalViews: 8540,
    favorites: 234,
    messages: 45,
    soldArtworks: 24,
    totalRevenue: 15850,
    conversionRate: 3.2,
    growth: 12.5,
  };

  // Données pour graphiques
  const viewsData = {
    labels: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'],
    datasets: [
      {
        label: 'Vues',
        data: [120, 145, 132, 178, 165, 198, 156],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const favoritesData = {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [
      {
        label: 'Favoris',
        data: [45, 62, 58, 69],
        backgroundColor: 'rgba(239, 68, 68, 0.8)',
      },
    ],
  };

  const revenueData = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Revenus (XOF)',
        data: [2500, 3200, 2800, 3500, 2100, 1750],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
        tension: 0.4,
      },
    ],
  };

  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(() => {
        // Refresh des données
      }, 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">📊 Analytique</h1>
          <p className="text-gray-400 mt-1">Suivez vos performances en temps réel</p>
        </div>
        <button
          onClick={() => setAutoRefresh(!autoRefresh)}
          className={`px-3 py-2 rounded text-sm font-medium transition ${
            autoRefresh
              ? 'bg-green-600/20 text-green-300 border border-green-600/30'
              : 'bg-gray-700 text-gray-300'
          }`}
        >
          {autoRefresh ? '✓ Auto-refresh' : '⏸ Paused'}
        </button>
      </div>

      {/* Cartes KPI principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Vues du profil"
          value={formatNumber(stats.profileViews)}
          change="+15% cette semaine"
          trend="up"
          icon={<Eye className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          label="Total vues"
          value={formatNumber(stats.totalViews)}
          change="+8% cette semaine"
          trend="up"
          icon={<BarChart3 className="w-5 h-5" />}
          color="purple"
        />
        <KPICard
          label="Favoris"
          value={stats.favorites}
          change="+23 cette semaine"
          trend="up"
          icon={<Heart className="w-5 h-5" />}
          color="red"
        />
        <KPICard
          label="Taux de conversion"
          value={`${stats.conversionRate}%`}
          change="+0.5% cette semaine"
          trend="up"
          icon={<TrendingUp className="w-5 h-5" />}
          color="green"
        />
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Vues temps réel */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">📈 Vues cette semaine</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {viewsData.labels.map((day, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-blue-500/80 rounded-t hover:bg-blue-500 transition"
                  style={{ height: `${(viewsData.datasets[0].data[idx] / 200) * 100}%` }}
                />
                <span className="text-gray-400 text-xs mt-2">{day}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-400">Total: {viewsData.datasets[0].data.reduce((a, b) => a + b, 0)}</span>
            <span className="text-green-400">+12% vs semaine dernière</span>
          </div>
        </div>

        {/* Revenus mensuels */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">💰 Revenus mensuels</h3>
          <div className="h-48 flex items-end justify-between gap-2">
            {revenueData.labels.map((month, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-green-500/80 rounded-t hover:bg-green-500 transition"
                  style={{ height: `${(revenueData.datasets[0].data[idx] / 4000) * 100}%` }}
                />
                <span className="text-gray-400 text-xs mt-2">{month}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-400">Total: {revenueData.datasets[0].data.reduce((a, b) => a + b, 0).toLocaleString()} XOF</span>
            <span className="text-green-400">+{stats.growth}% vs mois dernier</span>
          </div>
        </div>
      </div>

      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Oeuvres vendues</span>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +4
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.soldArtworks}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Revenu total</span>
            <span className="text-green-400 text-sm flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +{stats.growth}%
            </span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.totalRevenue.toLocaleString()} XOF</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Messages reçus</span>
            <span className="text-blue-400 text-sm">+5</span>
          </div>
          <p className="text-3xl font-bold text-white">{stats.messages}</p>
        </div>
      </div>

      {/* Top performances */}
      <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
        <h3 className="text-lg font-bold text-white mb-4">🏆 Top performances</h3>
        <div className="space-y-3">
          {[
            { title: 'Tableau Abstrait', views: 850, favorites: 45, price: 2500 },
            { title: 'Sculpture Moderne', views: 720, favorites: 38, price: 3200 },
            { title: 'Portrait de Famille', views: 650, favorites: 32, price: 1800 },
            { title: 'Paysage Senegal', views: 580, favorites: 28, price: 1500 },
          ].map((artwork, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-600">#{idx + 1}</span>
                <div>
                  <p className="text-white font-medium">{artwork.title}</p>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Eye className="w-3 h-3" /> {artwork.views}</span>
                    <span className="flex items-center gap-1"><Heart className="w-3 h-3" /> {artwork.favorites}</span>
                  </div>
                </div>
              </div>
              <span className="text-green-400 font-semibold">{artwork.price.toLocaleString()} XOF</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, change, trend, icon, color }) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    red: 'bg-red-500/10 border-red-500/30 text-red-300',
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
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
  );
}
