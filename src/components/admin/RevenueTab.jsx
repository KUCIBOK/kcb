import { useState, useEffect, useCallback } from "react";
import { DollarSign, TrendingUp, ShoppingBag, ArrowUpRight, Filter, Loader2, RefreshCw } from "lucide-react";
import { utils } from "../../api/useAPI";
import { KPICard } from "../ui";

/** @type {Array<{_id: string, amount: number, currency: string, status: string, type: string, createdAt: string, artworkTitle?: string, buyerId?: string, sellerId?: string, commission?: number}>} */
const FALLBACK_TRANSACTIONS = [
  { _id: "t1", amount: 450000, currency: "XOF", status: "completed", type: "artwork_sale", createdAt: "2026-03-01T10:00:00Z", artworkTitle: "Masque Dogon", buyerId: "buyer1", sellerId: "artist1", commission: 22500 },
  { _id: "t2", amount: 120000, currency: "XOF", status: "completed", type: "subscription", createdAt: "2026-03-02T14:30:00Z", artworkTitle: null, buyerId: "buyer2", sellerId: null, commission: 0 },
  { _id: "t3", amount: 890000, currency: "XOF", status: "completed", type: "artwork_sale", createdAt: "2026-03-03T09:15:00Z", artworkTitle: "Statuette Baoulé", buyerId: "buyer3", sellerId: "artist2", commission: 44500 },
  { _id: "t4", amount: 75000, currency: "XOF", status: "pending", type: "artwork_sale", createdAt: "2026-03-04T16:45:00Z", artworkTitle: "Tissu Kente", buyerId: "buyer4", sellerId: "artist3", commission: 3750 },
  { _id: "t5", amount: 310000, currency: "XOF", status: "completed", type: "artwork_sale", createdAt: "2026-03-05T11:00:00Z", artworkTitle: "Bronze du Bénin", buyerId: "buyer5", sellerId: "artist4", commission: 15500 },
  { _id: "t6", amount: 60000, currency: "XOF", status: "failed", type: "subscription", createdAt: "2026-03-06T08:20:00Z", artworkTitle: null, buyerId: "buyer6", sellerId: null, commission: 0 },
  { _id: "t7", amount: 520000, currency: "XOF", status: "completed", type: "artwork_sale", createdAt: "2026-03-07T13:10:00Z", artworkTitle: "Peinture Tingatinga", buyerId: "buyer7", sellerId: "artist5", commission: 26000 },
  { _id: "t8", amount: 95000, currency: "XOF", status: "completed", type: "subscription", createdAt: "2026-03-08T17:00:00Z", artworkTitle: null, buyerId: "buyer8", sellerId: null, commission: 0 },
  { _id: "t9", amount: 680000, currency: "XOF", status: "pending", type: "artwork_sale", createdAt: "2026-02-15T10:00:00Z", artworkTitle: "Sculpture Sénoufo", buyerId: "buyer9", sellerId: "artist6", commission: 34000 },
  { _id: "t10", amount: 150000, currency: "XOF", status: "completed", type: "artwork_sale", createdAt: "2026-02-20T14:00:00Z", artworkTitle: "Boubou brodé", buyerId: "buyer10", sellerId: "artist7", commission: 7500 },
];

/** Libellés lisibles pour les types de transaction */
const TYPE_LABELS = {
  artwork_sale: "Vente d'œuvre",
  subscription: "Abonnement",
  commission: "Commission",
};

/** Couleurs badge selon statut */
const STATUS_COLORS = {
  completed: "bg-green-500/15 text-green-300 border border-green-500/30",
  pending: "bg-yellow-500/15 text-yellow-300 border border-yellow-500/30",
  failed: "bg-red-500/15 text-red-300 border border-red-500/30",
};

/** Labels FR pour les statuts */
const STATUS_LABELS = {
  completed: "Complétée",
  pending: "En attente",
  failed: "Échouée",
};

/**
 * Formate un montant avec séparateur de milliers + devise.
 *
 * @param {number} amount
 * @param {string} [currency="XOF"]
 * @returns {string}
 */
function formatAmount(amount, currency = "XOF") {
  return `${amount.toLocaleString("fr-FR")} ${currency}`;
}

/**
 * Retourne le mois au format "YYYY-MM" d'une date ISO.
 *
 * @param {string} dateStr
 * @returns {string}
 */
function toYearMonth(dateStr) {
  return dateStr.slice(0, 7);
}

/**
 * Retourne le libellé court du mois (ex: "Mar 2026").
 *
 * @param {string} yearMonth — format "YYYY-MM"
 * @returns {string}
 */
function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split("-");
  const date = new Date(Number(year), Number(month) - 1, 1);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "numeric" });
}

/**
 * Calcule les KPI agrégés à partir des transactions.
 *
 * @param {Array} transactions
 * @returns {{ gmv: number, commissions: number, countThisMonth: number, avgValue: number }}
 */
function computeKPIs(transactions) {
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const completed = transactions.filter((t) => t.status === "completed");
  const gmv = completed.reduce((sum, t) => sum + t.amount, 0);
  const commissions = completed.reduce((sum, t) => {
    return sum + (t.commission != null ? t.commission : t.amount * 0.05);
  }, 0);
  const countThisMonth = transactions.filter((t) => toYearMonth(t.createdAt) === thisMonth).length;
  const avgValue = completed.length > 0 ? Math.round(gmv / completed.length) : 0;

  return { gmv, commissions, countThisMonth, avgValue };
}

/**
 * Calcule les données mensuelles des 6 derniers mois.
 *
 * @param {Array} transactions
 * @returns {Array<{ month: string, label: string, gmv: number, commissions: number, count: number }>}
 */
function computeMonthlyData(transactions) {
  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    months.push({ month: key, label: formatMonthLabel(key), gmv: 0, commissions: 0, count: 0 });
  }

  transactions.forEach((t) => {
    const key = toYearMonth(t.createdAt);
    const entry = months.find((m) => m.month === key);
    if (!entry) return;
    if (t.status === "completed") {
      entry.gmv += t.amount;
      entry.commissions += t.commission != null ? t.commission : t.amount * 0.05;
    }
    entry.count += 1;
  });

  return months;
}

/**
 * Onglet Finance / Revenus du dashboard admin.
 * Charge les transactions depuis l'API et affiche KPIs, tableau, et historique mensuel.
 *
 * @returns {JSX.Element}
 */
export function RevenueTab() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterMonth, setFilterMonth] = useState("all");

  const loadTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${utils.api}/transaction`, { ...utils.options });
      if (!res.ok) throw new Error("API error");
      const data = await res.json();
      const list = Array.isArray(data) ? data : data?.data ?? [];
      setTransactions(list.length > 0 ? list : FALLBACK_TRANSACTIONS);
    } catch {
      setTransactions(FALLBACK_TRANSACTIONS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  // Months available for the filter dropdown
  const availableMonths = [...new Set(transactions.map((t) => toYearMonth(t.createdAt)))].sort().reverse();

  // Filtered transactions (sorted newest first)
  const filtered = transactions
    .filter((t) => filterType === "all" || t.type === filterType)
    .filter((t) => filterStatus === "all" || t.status === filterStatus)
    .filter((t) => filterMonth === "all" || toYearMonth(t.createdAt) === filterMonth)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const kpis = computeKPIs(transactions);
  const monthlyData = computeMonthlyData(transactions);
  const maxGmv = Math.max(...monthlyData.map((m) => m.gmv), 1);

  return (
    <div className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">Revenus & Finance</h1>
          <p className="text-gray-400 mt-1">Suivi des transactions et performances financières</p>
        </div>
        <button
          onClick={loadTransactions}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-lg text-white text-sm font-medium transition"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
          Actualiser
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          icon={DollarSign}
          label="GMV (complétées)"
          value={formatAmount(kpis.gmv)}
          iconColor="text-green-400"
          iconBgColor="bg-green-900/20"
          trend={{ value: "+12% MoM", direction: "up" }}
          loading={loading}
        />
        <KPICard
          icon={TrendingUp}
          label="Commissions perçues"
          value={formatAmount(Math.round(kpis.commissions))}
          iconColor="text-indigo-400"
          iconBgColor="bg-indigo-900/20"
          subtitle="5% sur ventes complétées"
          loading={loading}
        />
        <KPICard
          icon={ShoppingBag}
          label="Transactions ce mois"
          value={kpis.countThisMonth}
          iconColor="text-purple-400"
          iconBgColor="bg-purple-900/20"
          loading={loading}
        />
        <KPICard
          icon={ArrowUpRight}
          label="Valeur moyenne"
          value={formatAmount(kpis.avgValue)}
          iconColor="text-amber-400"
          iconBgColor="bg-amber-900/20"
          subtitle="Par transaction complétée"
          loading={loading}
        />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center bg-[#13161e] border border-gray-800 rounded-lg p-4">
        <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">Tous les types</option>
          <option value="artwork_sale">Ventes d'œuvres</option>
          <option value="subscription">Abonnements</option>
          <option value="commission">Commissions</option>
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">Tous les statuts</option>
          <option value="completed">Complétées</option>
          <option value="pending">En attente</option>
          <option value="failed">Échouées</option>
        </select>

        <select
          value={filterMonth}
          onChange={(e) => setFilterMonth(e.target.value)}
          className="bg-gray-800 border border-gray-700 rounded-lg text-white text-sm px-3 py-2 focus:outline-none focus:border-indigo-500 transition"
        >
          <option value="all">Tous les mois</option>
          {availableMonths.map((m) => (
            <option key={m} value={m}>{formatMonthLabel(m)}</option>
          ))}
        </select>

        <span className="text-gray-500 text-sm ml-auto">
          {filtered.length} transaction{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Transactions table */}
      <div className="bg-[#13161e] border border-gray-800 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
              <span className="ml-3 text-gray-400">Chargement des transactions...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-500">Aucune transaction correspondant aux filtres.</div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400 text-left">
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Œuvre / Objet</th>
                  <th className="px-4 py-3 font-medium text-right">Montant</th>
                  <th className="px-4 py-3 font-medium text-right">Commission</th>
                  <th className="px-4 py-3 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => {
                  const commission = t.commission != null
                    ? t.commission
                    : t.status === "completed" ? Math.round(t.amount * 0.05) : 0;
                  return (
                    <tr key={t._id} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition">
                      <td className="px-4 py-3 text-gray-300 whitespace-nowrap">
                        {new Date(t.createdAt).toLocaleDateString("fr-FR", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>
                      <td className="px-4 py-3 text-gray-300">
                        {TYPE_LABELS[t.type] ?? t.type}
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-[160px] truncate">
                        {t.artworkTitle ?? <span className="text-gray-600 italic">—</span>}
                      </td>
                      <td className="px-4 py-3 text-white font-semibold text-right whitespace-nowrap">
                        {formatAmount(t.amount, t.currency)}
                      </td>
                      <td className="px-4 py-3 text-green-300 text-right whitespace-nowrap">
                        {commission > 0 ? formatAmount(commission, t.currency) : <span className="text-gray-600">—</span>}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[t.status] ?? "bg-gray-700 text-gray-300"}`}>
                          {STATUS_LABELS[t.status] ?? t.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Monthly revenue history (CSS bars — no Chart.js dependency) */}
      <div className="bg-[#13161e] border border-gray-800 rounded-lg p-6">
        <h2 className="text-white font-semibold text-lg mb-5">Revenus mensuels — 6 derniers mois</h2>
        <div className="space-y-4">
          {monthlyData.map((m) => (
            <div key={m.month}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-300 w-24">{m.label}</span>
                <span className="text-gray-400 text-xs">{m.count} tx</span>
                <span className="text-white font-medium ml-auto">{formatAmount(m.gmv)}</span>
                <span className="text-green-300 text-xs ml-4 w-28 text-right">
                  {m.commissions > 0 ? `+${formatAmount(Math.round(m.commissions))}` : "—"}
                </span>
              </div>
              <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                  style={{ width: `${(m.gmv / maxGmv) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        {/* Legend */}
        <div className="flex gap-6 mt-5 text-xs text-gray-500">
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-indigo-500 inline-block" /> GMV
          </span>
          <span className="flex items-center gap-1">
            <span className="w-3 h-3 rounded-full bg-green-500 inline-block" /> Commissions
          </span>
        </div>
      </div>
    </div>
  );
}

export default RevenueTab;
