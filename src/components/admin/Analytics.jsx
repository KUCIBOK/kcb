import { useState, useEffect } from 'react';
import { utils } from '../../api/useAPI';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  DollarSign,
  Truck,
  MessageSquare,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  ZoomIn,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export function Analytics() {
  const [data, setData] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Données complètes par défaut
  const defaultData = {
    // Revenue & Finance
    mrr: 12500,
    arr: 150000,
    mrrGrowth: 12.5,
    arr_growth: 18.2,
    revenue_mix: { marketplace: 65, artworks: 25, subscriptions: 10 },
    cac: 45,
    ltv: 1250,
    payback_period: 2.1,
    revenue_projection_3m: 165000,

    // Utilisateurs & Croissance
    totalUsers: 23,
    mau: 18,
    dau: 12,
    acquisition_growth: 15,
    channels: {
      organic: { users: 8, roi: 3.2 },
      paid: { users: 10, roi: 1.8 },
      referral: { users: 5, roi: 4.1 },
    },

    // Contenu & Inventaire
    totalArtworks: 236,
    artworks_growth: 18,
    artworks_by_category: { paintings: 120, sculptures: 65, digital: 51 },
    top_artists: [
      { name: 'Artist 1', revenue: 8500 },
      { name: 'Artist 2', revenue: 6200 },
      { name: 'Artist 3', revenue: 4800 },
    ],
    quality_score: 87,
    artworks_with_cert: 215,

    // Marketplace & Ventes
    gmv: 285000,
    aov: 1250,
    conversion_rate: 3.8,
    views_total: 12450,
    favorites: 856,
    messages: 234,
    sales: 228,
    best_sellers: [
      { title: 'Artwork 1', sales: 45, revenue: 22500 },
      { title: 'Artwork 2', sales: 32, revenue: 16000 },
    ],
    commission_revenue: 28500,

    // Engagement & Rétention
    dau_mau_ratio: 66.7,
    retention_30d: 72,
    retention_7d: 89,
    feature_adoption: { bidding: 78, favorites: 92, messaging: 65 },
    at_risk_users: 3,

    // Technique & Performance
    uptime: 99.8,
    api_response_time: 145,
    error_rate: 0.2,
    lcp: 1.8,
    fid: 35,
    cls: 0.08,
    certs_generated: 215,

    // Support & Satisfaction
    nps: 72,
    csat: 4.3,
    total_tickets: 45,
    avg_response_time: 2.5,
    avg_resolution_time: 24,
    ticket_categories: {
      billing: 12,
      technical: 18,
      general: 15,
    },

    // Prédictions
    mrr_projection: 14200,
    churn_risk_users: 2,
    upsell_opportunities: 7,
    alerts: [
      { type: 'warning', message: '3 utilisateurs à risque de churn' },
      { type: 'info', message: '7 opportunités d\'upsell identifiées' },
    ],
  };

  useEffect(() => {
    setData(defaultData);
    loadData();
    if (autoRefresh) {
      const interval = setInterval(() => loadData(), 30000);
      return () => clearInterval(interval);
    }
  }, [autoRefresh]);

  const loadData = async () => {
    try {
      const response = await fetch(`${utils.api}/analytics/latest`, {
        headers: utils.options.headers,
      });
      const result = await response.json();
      if (result.success && result.data) {
        setData(result.data);
      }
    } catch (err) {
      console.warn('Données par défaut utilisées');
    }
  };

  if (!data) return <div className="text-white">Chargement...</div>;

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">📊 Dashboard Principal</h1>
          <p className="text-gray-400 mt-2">Vue d'ensemble complète de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
              autoRefresh
                ? 'bg-green-600/20 text-green-300 border border-green-600/30'
                : 'bg-gray-700 text-gray-300'
            }`}
          >
            {autoRefresh ? '✓ Auto-refresh' : '⏸ Paused'}
          </button>
          <button
            onClick={loadData}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded text-white text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Alertes & Actions Rapides */}
      {data.alerts && data.alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.alerts.map((alert, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-lg border ${
                alert.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                  : 'bg-blue-500/10 border-blue-500/30 text-blue-300'
              }`}
            >
              <div className="flex items-start gap-2">
                {alert.type === 'warning' ? (
                  <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <Zap className="w-5 h-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{alert.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Section 1: 💰 Revenue & Finance */}
      <Section title="💰 Revenue & Finance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="MRR"
            value={`$${data.mrr.toLocaleString()}`}
            change={`+${data.mrrGrowth}% MoM`}
            trend="up"
            color="green"
          />
          <MetricCard
            label="ARR"
            value={`$${data.arr.toLocaleString()}`}
            change={`+${data.arr_growth}% YoY`}
            trend="up"
            color="green"
          />
          <MetricCard
            label="CAC"
            value={`$${data.cac}`}
            change="Coût d'acquisition"
            trend="down"
            color="blue"
          />
          <MetricCard
            label="LTV"
            value={`$${data.ltv}`}
            change={`Ratio LTV:CAC = ${(data.ltv / data.cac).toFixed(1)}x`}
            trend="up"
            color="purple"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueBreakdown
            title="Mix de revenu"
            data={data.revenue_mix}
            colors={['#10b981', '#3b82f6', '#a855f7']}
          />
          <MetricCard
            label="Payback Period"
            value={`${data.payback_period} mois`}
            change="Temps de récupération"
            color="indigo"
          />
          <MetricCard
            label="Projection 3M"
            value={`$${data.revenue_projection_3m.toLocaleString()}`}
            change="Revenu estimé"
            color="emerald"
          />
        </div>
      </Section>

      {/* Section 2: 👥 Utilisateurs & Croissance */}
      <Section title="👥 Utilisateurs & Croissance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Utilisateurs"
            value={data.totalUsers}
            change={`+${data.acquisition_growth}% ce mois`}
            trend="up"
            color="blue"
          />
          <MetricCard
            label="MAU"
            value={data.mau}
            change="Utilisateurs actifs mensuels"
            color="indigo"
          />
          <MetricCard
            label="DAU"
            value={data.dau}
            change="Utilisateurs actifs quotidiens"
            color="violet"
          />
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Canaux d'acquisition</p>
            <div className="space-y-2">
              {Object.entries(data.channels).map(([channel, metrics]) => (
                <div key={channel} className="flex justify-between text-sm">
                  <span className="text-gray-300 capitalize">{channel}</span>
                  <span className="text-white font-semibold">
                    {metrics.users} (ROI: {metrics.roi}x)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: 🎨 Contenu & Inventaire */}
      <Section title="🎨 Contenu & Inventaire">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Œuvres Total"
            value={data.totalArtworks}
            change={`+${data.artworks_growth}% ce mois`}
            trend="up"
            color="purple"
          />
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Par catégorie</p>
            <div className="space-y-1">
              {Object.entries(data.artworks_by_category).map(([cat, count]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-gray-300 capitalize">{cat}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <MetricCard
            label="Score Qualité"
            value={`${data.quality_score}%`}
            change={`${data.artworks_with_cert}/${data.totalArtworks} avec cert`}
            trend="up"
            color="green"
          />
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-gray-400 text-sm mb-2">Top Artistes</p>
            <div className="space-y-1">
              {data.top_artists.slice(0, 3).map((artist, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-gray-300">{artist.name}</span>
                  <span className="text-green-300 font-semibold">${(artist.revenue / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: 🛒 Marketplace & Ventes */}
      <Section title="🛒 Marketplace & Ventes">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="GMV"
            value={`$${(data.gmv / 1000).toFixed(0)}k`}
            change="Volume marchand brut"
            color="green"
          />
          <MetricCard
            label="AOV"
            value={`$${data.aov}`}
            change="Valeur moyenne par commande"
            color="blue"
          />
          <MetricCard
            label="Conversion"
            value={`${data.conversion_rate}%`}
            change="Taux de conversion"
            color="purple"
          />
          <MetricCard
            label="Commission"
            value={`$${(data.commission_revenue / 1000).toFixed(1)}k`}
            change="Revenu commission"
            color="amber"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FunnelChart
            title="Funnel Marketplace"
            stages={[
              { label: 'Vues', value: data.views_total, color: 'blue' },
              { label: 'Favoris', value: data.favorites, color: 'purple' },
              { label: 'Messages', value: data.messages, color: 'indigo' },
              { label: 'Ventes', value: data.sales, color: 'green' },
            ]}
          />
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-white font-semibold mb-3">Meilleures ventes</p>
            <div className="space-y-2">
              {data.best_sellers.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-gray-400 text-xs">{item.sales} ventes</p>
                  </div>
                  <span className="text-green-300 font-semibold">${(item.revenue / 1000).toFixed(1)}k</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 5: 📊 Engagement & Rétention */}
      <Section title="📊 Engagement & Rétention">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Stickiness"
            value={`${data.dau_mau_ratio.toFixed(1)}%`}
            change="DAU/MAU ratio"
            trend={data.dau_mau_ratio > 50 ? 'up' : 'down'}
            color="indigo"
          />
          <MetricCard
            label="Rétention 7J"
            value={`${data.retention_7d}%`}
            change="Utilisateurs revenant"
            color="green"
          />
          <MetricCard
            label="Rétention 30J"
            value={`${data.retention_30d}%`}
            change="Rétention à 30 jours"
            color="blue"
          />
          <MetricCard
            label="⚠️ À Risque"
            value={data.at_risk_users}
            change="Utilisateurs de churn"
            trend="down"
            color="red"
          />
        </div>
        <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-white font-semibold mb-3">Adoption des features</p>
          <div className="space-y-2">
            {Object.entries(data.feature_adoption).map(([feature, adoption]) => (
              <ProgressBar
                key={feature}
                label={feature.charAt(0).toUpperCase() + feature.slice(1)}
                value={adoption}
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Section 6: ⚙️ Technique & Performance */}
      <Section title="⚙️ Technique & Performance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Uptime"
            value={`${data.uptime}%`}
            change="Disponibilité du service"
            trend="up"
            color="green"
          />
          <MetricCard
            label="API Response"
            value={`${data.api_response_time}ms`}
            change="Temps de réponse moyen"
            color="blue"
          />
          <MetricCard
            label="Error Rate"
            value={`${data.error_rate}%`}
            change="Taux d'erreur"
            trend="down"
            color="red"
          />
          <MetricCard
            label="Certificats"
            value={data.certs_generated}
            change="Générés ce mois"
            color="purple"
          />
        </div>
        <div className="mt-4 bg-gray-900/50 border border-gray-800 rounded-lg p-4">
          <p className="text-white font-semibold mb-3">Web Vitals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VitalCard label="LCP" value={`${data.lcp}s`} target="< 2.5s" status="good" />
            <VitalCard label="FID" value={`${data.fid}ms`} target="< 100ms" status="good" />
            <VitalCard label="CLS" value={data.cls} target="< 0.1" status="needs-improvement" />
          </div>
        </div>
      </Section>

      {/* Section 7: 📞 Support & Satisfaction */}
      <Section title="📞 Support & Satisfaction">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="NPS"
            value={data.nps}
            change="Score promoteur net"
            trend="up"
            color="green"
          />
          <MetricCard
            label="CSAT"
            value={`${data.csat.toFixed(1)}/5`}
            change="Satisfaction client"
            color="blue"
          />
          <MetricCard
            label="Total Tickets"
            value={data.total_tickets}
            change="Demandes de support"
            color="purple"
          />
          <MetricCard
            label="Temps Résolution"
            value={`${data.avg_resolution_time}h`}
            change="Moyenne"
            color="indigo"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
            <p className="text-white font-semibold mb-3">Catégories de problèmes</p>
            <div className="space-y-2">
              {Object.entries(data.ticket_categories).map(([category, count]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-gray-300 capitalize">{category}</span>
                  <span className="text-white font-semibold">{count} tickets</span>
                </div>
              ))}
            </div>
          </div>
          <MetricCard
            label="Temps Réponse"
            value={`${data.avg_response_time}h`}
            change="Moyenne de réponse"
            color="amber"
          />
        </div>
      </Section>

      {/* Section 8: 🔮 Prédictions & Alertes */}
      <Section title="🔮 Prédictions & Opportunités">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="MRR Projection"
            value={`$${data.mrr_projection.toLocaleString()}`}
            change="Estimé le mois prochain"
            color="green"
          />
          <MetricCard
            label="⚠️ Churn Risk"
            value={data.churn_risk_users}
            change="Utilisateurs à risque"
            trend="down"
            color="orange"
          />
          <MetricCard
            label="🎯 Upsell"
            value={data.upsell_opportunities}
            change="Opportunités identifiées"
            color="purple"
          />
        </div>
      </Section>

      {/* Section 9: ⚡ Actions Rapides */}
      <Section title="⚡ Actions Rapides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            icon="📋"
            label="Réviser Œuvres"
            badge={data.pendingArtworks || 18}
            onClick={() => console.log('Réviser')}
          />
          <ActionButton
            icon="👥"
            label="Gérer Utilisateurs"
            badge={data.totalUsers || 23}
            onClick={() => console.log('Gérer users')}
          />
          <ActionButton
            icon="🎫"
            label="Tickets Support"
            badge={data.openTickets || 8}
            onClick={() => console.log('Support')}
          />
        </div>
      </Section>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      {children}
    </div>
  );
}

function MetricCard({ label, value, change, trend, color = 'gray' }) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
    blue: 'bg-blue-500/10 border-blue-500/30 text-blue-300',
    purple: 'bg-purple-500/10 border-purple-500/30 text-purple-300',
    indigo: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300',
    violet: 'bg-violet-500/10 border-violet-500/30 text-violet-300',
    amber: 'bg-amber-500/10 border-amber-500/30 text-amber-300',
    emerald: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300',
    orange: 'bg-orange-500/10 border-orange-500/30 text-orange-300',
    red: 'bg-red-500/10 border-red-500/30 text-red-300',
  };

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <p className="text-gray-400 text-sm mb-2">{label}</p>
      <div className="flex items-end justify-between">
        <div className="text-3xl font-bold text-white">{value}</div>
        {trend && (
          <div className="flex items-center gap-1">
            {trend === 'up' ? (
              <ArrowUpRight className="w-4 h-4 text-green-400" />
            ) : (
              <ArrowDownRight className="w-4 h-4 text-red-400" />
            )}
          </div>
        )}
      </div>
      {change && <p className="text-xs mt-2 opacity-75">{change}</p>}
    </div>
  );
}

function RevenueBreakdown({ title, data, colors }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0);
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <p className="text-white font-semibold mb-3">{title}</p>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value], idx) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-300 capitalize">{key}</span>
              <span className="text-white font-semibold">{((value / total) * 100).toFixed(0)}%</span>
            </div>
            <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${(value / total) * 100}%`, backgroundColor: colors[idx] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FunnelChart({ title, stages }) {
  const maxValue = Math.max(...stages.map((s) => s.value));
  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
      <p className="text-white font-semibold mb-4">{title}</p>
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const width = (stage.value / maxValue) * 100;
          const colorMap = { blue: '#3b82f6', purple: '#a855f7', indigo: '#6366f1', green: '#10b981' };
          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-300">{stage.label}</span>
                <span className="text-white font-semibold">{stage.value.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${width}%`, backgroundColor: colorMap[stage.color] }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-300">{label}</span>
        <span className="text-white font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function VitalCard({ label, value, target, status }) {
  const statusColor = status === 'good' ? 'text-green-400' : 'text-yellow-400';
  return (
    <div className="bg-gray-800/50 rounded-lg p-3 text-center">
      <p className="text-gray-400 text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${statusColor}`}>{value}</p>
      <p className="text-gray-500 text-xs mt-1">{target}</p>
    </div>
  );
}

function ActionButton({ icon, label, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-gray-900/50 border border-gray-800 hover:border-indigo-500/50 rounded-lg p-4 text-left transition group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {badge && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white font-semibold group-hover:text-indigo-300 transition">{label}</p>
    </button>
  );
}
