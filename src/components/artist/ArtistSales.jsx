import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  CreditCard,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

export default function ArtistSales() {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  // Données par défaut
  const defaultStats = {
    totalRevenue: 15850,
    monthlyRevenue: 3250,
    pendingPayments: 1200,
    completedSales: 24,
    pendingSales: 5,
    averageOrderValue: 660,
    revenueGrowth: 12.5,
  };

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => setLoading(false), 500);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-gray-400">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">💰 Mes Ventes & Revenus</h1>
          <p className="text-gray-400 mt-1">Suivez vos revenus et performances financières</p>
        </div>
        <select className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700">
          <option>Ce mois</option>
          <option>3 derniers mois</option>
          <option>Cette année</option>
          <option>Tout</option>
        </select>
      </div>

      {/* Cartes KPI */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Revenu total"
          value={formatCurrency(defaultStats.totalRevenue)}
          change={`+${defaultStats.revenueGrowth}% vs mois dernier`}
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          label="Ce mois"
          value={formatCurrency(defaultStats.monthlyRevenue)}
          change="En cours"
          icon={<TrendingUp className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          label="En attente"
          value={formatCurrency(defaultStats.pendingPayments)}
          change="Paiements non reçus"
          icon={<CreditCard className="w-5 h-5" />}
          color="yellow"
        />
        <KPICard
          label="Ventes complétées"
          value={defaultStats.completedSales}
          change={`${defaultStats.pendingSales} en cours`}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Graphique et détails */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenu par mois */}
        <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Revenus mensuels</h3>
          <div className="space-y-4">
            {[
              { month: 'Février 2026', amount: 3250, sales: 5 },
              { month: 'Janvier 2026', amount: 4100, sales: 7 },
              { month: 'Décembre 2025', amount: 2800, sales: 4 },
              { month: 'Novembre 2025', amount: 3500, sales: 5 },
              { month: 'Octobre 2025', amount: 2200, sales: 3 },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-300">{item.month}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-400 text-sm">{item.sales} ventes</span>
                  <span className="text-white font-semibold">{formatCurrency(item.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Commandes récentes */}
        <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Dernières ventes</h3>
          <div className="space-y-3">
            {[
              { buyer: 'Collectionneur A', amount: 1500, status: 'completed', date: 'Il y a 2h' },
              { buyer: 'Collectionneur B', amount: 2200, status: 'pending', date: 'Il y a 1j' },
              { buyer: 'Collectionneur C', amount: 850, status: 'completed', date: 'Il y a 3j' },
              { buyer: 'Professionnel D', amount: 3500, status: 'pending', date: 'Il y a 5j' },
            ].map((sale, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div>
                  <p className="text-white font-medium text-sm">{sale.buyer}</p>
                  <p className="text-gray-400 text-xs">{sale.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-semibold">{formatCurrency(sale.amount)}</p>
                  <span className={`text-xs ${sale.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {sale.status === 'completed' ? 'Reçu' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Valeur moyenne par commande</span>
            <ArrowUpRight className="w-4 h-4 text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatCurrency(defaultStats.averageOrderValue)}</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Taux de conversion</span>
            <span className="text-green-400 text-sm">+5%</span>
          </div>
          <p className="text-2xl font-bold text-white">3.2%</p>
        </div>
        <div className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400 text-sm">Meilleur mois</span>
          </div>
          <p className="text-2xl font-bold text-white">Janvier 2026</p>
          <p className="text-green-400 text-sm">{formatCurrency(4100)}</p>
        </div>
      </div>
    </div>
  );
}

function KPICard({ label, value, change, trend, icon, color }) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
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
          <ArrowUpRight className="w-3 h-3" />
        ) : trend === 'down' ? (
          <ArrowDownRight className="w-3 h-3" />
        ) : null}
        {change}
      </div>
    </div>
  );
}
