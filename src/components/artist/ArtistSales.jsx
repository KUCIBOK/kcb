import { useState, useEffect } from 'react';
import {
  DollarSign,
  TrendingUp,
  ShoppingBag,
  CreditCard,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import { utils } from '../../api/useAPI';

const fmt = (amount, currency = 'XOF') =>
  new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
  }).format(amount ?? 0);

const relativeDate = (iso) => {
  if (!iso) return '';
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  if (d === 0) return "Aujourd'hui";
  if (d === 1) return 'Il y a 1 jour';
  return `Il y a ${d} jours`;
};

export default function ArtistSales() {
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${utils.api}/transactions/artist`, utils.options);
        const body = await res.json();
        if (!res.ok) { setError(body?.error ?? 'Erreur'); return; }
        setData(body?.data ?? body);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="w-8 h-8 border-2 border-kcb-or border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  const stats = data?.stats ?? {};
  const transactions = data?.transactions ?? [];
  const currency = stats.currency ?? 'XOF';
  const recent = transactions.slice(0, 6);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Mes Ventes & Revenus</h1>
        <p className="text-kcb-pierre text-sm mt-1">
          Revenus nets après commission Kucibok (10%)
        </p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Revenu net total"
          value={fmt(stats.totalRevenue, currency)}
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <KPICard
          label="En attente de paiement"
          value={fmt(stats.pendingRevenue, currency)}
          icon={<Clock className="w-5 h-5" />}
          color="yellow"
        />
        <KPICard
          label="Commission Kucibok"
          value={fmt(stats.totalCommission, currency)}
          icon={<CreditCard className="w-5 h-5" />}
          color="blue"
        />
        <KPICard
          label="Ventes complétées"
          value={stats.completedSales ?? 0}
          change={stats.pendingSales ? `${stats.pendingSales} en cours` : null}
          icon={<ShoppingBag className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Transactions récentes */}
      <div className="rounded-xl border border-white/[0.06] bg-kcb-ardoise/40 p-6">
        <h3 className="text-base font-semibold text-white mb-4">Transactions récentes</h3>
        {recent.length === 0 ? (
          <p className="text-kcb-pierre text-sm text-center py-8">
            Aucune vente pour l'instant.
          </p>
        ) : (
          <div className="space-y-3">
            {recent.map((tx) => (
              <div
                key={tx.id ?? tx._id}
                className="flex items-center justify-between p-3 rounded-lg bg-kcb-ardoise/60"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {tx.artworks?.image ? (
                    <img
                      src={tx.artworks.image}
                      alt={tx.artworks.title}
                      className="w-10 h-10 rounded object-cover flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded bg-kcb-ardoise flex-shrink-0" />
                  )}
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      {tx.artworks?.title ?? 'Œuvre'}
                    </p>
                    <p className="text-kcb-pierre text-xs">
                      {tx.buyer?.name ?? 'Acheteur'} · {relativeDate(tx.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <p className="text-white font-semibold text-sm">
                    {fmt(tx.net_amount, tx.currency)}
                  </p>
                  <span className={`text-xs ${tx.status === 'completed' ? 'text-green-400' : 'text-yellow-400'}`}>
                    {tx.status === 'completed' ? 'Reçu' : 'En attente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Répartition */}
      {stats.totalRevenue > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-xl border border-white/[0.06] bg-kcb-ardoise/40 p-4">
            <p className="text-kcb-pierre text-xs mb-1">Valeur moyenne / vente</p>
            <p className="text-2xl font-bold text-white">
              {fmt(
                stats.completedSales > 0
                  ? Math.round(stats.totalRevenue / stats.completedSales)
                  : 0,
                currency
              )}
            </p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-kcb-ardoise/40 p-4">
            <p className="text-kcb-pierre text-xs mb-1">Taux de commission</p>
            <p className="text-2xl font-bold text-white">10 %</p>
            <p className="text-kcb-pierre text-xs mt-1">Prélevé par Kucibok</p>
          </div>
          <div className="rounded-xl border border-white/[0.06] bg-kcb-ardoise/40 p-4">
            <p className="text-kcb-pierre text-xs mb-1">Total brut généré</p>
            <p className="text-2xl font-bold text-white">
              {fmt((stats.totalRevenue ?? 0) + (stats.totalCommission ?? 0), currency)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

function KPICard({ label, value, change, icon, color }) {
  const colors = {
    green:  'bg-green-500/10  border-green-500/30  text-green-300',
    blue:   'bg-blue-500/10   border-blue-500/30   text-blue-300',
    yellow: 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
  };
  return (
    <div className={`border rounded-lg p-4 ${colors[color]}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium opacity-75">{label}</span>
        {icon}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {change && (
        <div className="text-xs mt-1 opacity-75">{change}</div>
      )}
    </div>
  );
}
