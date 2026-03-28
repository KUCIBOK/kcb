import { useState, useEffect } from 'react'
import { utils } from '../../api/useAPI'
import { fmtMoney } from '../../lib/currency'
import { SkeletonKPI, SkeletonChart } from '../ui'
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
  Check,
  Pause,
} from 'lucide-react'

export function Analytics({ currency = 'EUR' }) {
  const [data, setData] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  // Données complètes par défaut
  const defaultData = {
    // Revenue & Finance
    mrr: 4303,
    arr: 51636,
    mrrGrowth: 12.5,
    arr_growth: 18.2,
    // Mix: Marketplace 20% / SaaS 40% / Numérisation 10% / Logistique 30%
    revenue_mix: { marketplace: 20, subscriptions: 40, artworks: 10, logistique: 30 },
    cac: 190,       // CAC = Budget marketing annuel ÷ Nouveaux abonnés = 12 700 ÷ 67
    ltv: 325,       // LTV 12 mois = ARPA × 12 = 27 × 12
    payback_period: 7, // CAC ÷ ARPA = 190 ÷ 27
    revenue_projection_3m: 14460, // 3 × MRR mois prochain

    // SaaS — Sous-segments abonnements
    saas_subscribers: 159,
    arpa: 27,
    saas_segments: {
      collectionneur: { count: 34, mrr: 1760, share: 22 },
      curateur:       { count: 87, mrr: 2368, share: 55 },
      galerie:        { count: 43, mrr: 175,  share: 23 }, // ajusté pour total MRR = 4 303 €
    },

    // Utilisateurs & Croissance
    totalUsers: 5500,
    mau: 5500,
    dau: 3668, // DAU/MAU 66,7 % × 5 500
    acquisition_growth: 15,
    channels: {
      organic:  { users: 8,  roi: 3.2 },
      paid:     { users: 10, roi: 1.8 },
      referral: { users: 5,  roi: 4.1 },
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
    gmv: 1707,        // GMV mensuel
    aov: 279,         // Panier moyen
    conversion_rate: 3.8,
    views_total: 12450,
    favorites: 856,
    messages: 234,
    sales: 228,
    best_sellers: [
      { title: 'Artwork 1', sales: 45, revenue: 22500 },
      { title: 'Artwork 2', sales: 32, revenue: 16000 },
    ],
    commission_revenue: 341, // 20 % du GMV

    // Logistique
    logistics: {
      envois_2025: 110,
      envois_mensuels: 9,
      panier_moyen: 279,
      revenu_mensuel: 2561,
      marge: 71.4,
    },

    // Engagement & Rétention
    dau_mau_ratio: 66.7,
    retention_30d: 72,
    retention_7d: 89,
    feature_adoption: { bidding: 78, favorites: 92, messaging: 65 },
    at_risk_users: 7,

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
    mrr_projection: 4820,
    churn_risk_users: 7,
    upsell_opportunities: 7,
    alerts: [
      { type: 'warning', message: '7 utilisateurs à risque de churn' },
      { type: 'info', message: "7 opportunités d'upsell identifiées" },
    ],
  }

  const loadData = async () => {
    try {
      const response = await fetch(`${utils.api}/analytics/latest`, {
        headers: utils.options.headers,
      })
      const result = await response.json()
      if (result.success && result.data) {
        setData(result.data)
      }
    } catch (_err) {
      // Fallback to default data
    }
  }

  useEffect(() => {
    setData(defaultData) // eslint-disable-line react-hooks/set-state-in-effect
    loadData()
    if (autoRefresh) {
      const interval = setInterval(() => loadData(), 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!data)
    return (
      <div className="space-y-6 pb-10">
        {/* Header skeleton */}
        <div className="flex items-center justify-between mb-8 animate-pulse">
          <div className="space-y-2">
            <div className="animate-pulse bg-white/[0.08] rounded-[4px] w-64 h-9" />
            <div className="animate-pulse bg-white/[0.08] rounded-[4px] w-48 h-4" />
          </div>
          <div className="flex gap-2">
            <div className="animate-pulse bg-white/[0.08] rounded-[4px] w-28 h-9" />
            <div className="animate-pulse bg-white/[0.08] rounded-[4px] w-20 h-9" />
          </div>
        </div>
        {/* KPI grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonKPI key={i} />
          ))}
        </div>
        {/* Chart skeleton */}
        <SkeletonChart height="h-48" />
        {/* Second KPI grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonKPI key={i} />
          ))}
        </div>
        {/* Second chart skeleton */}
        <SkeletonChart height="h-48" />
      </div>
    )

  return (
    <div className="space-y-6 pb-10">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard Principal</h1>
          <p className="text-kcb-pierre mt-2">Vue d'ensemble complète de la plateforme</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-4 py-2 rounded text-sm font-medium transition ${
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
          <button
            onClick={loadData}
            className="px-4 py-2 bg-kcb-or hover:bg-kcb-bronze rounded text-kcb-noir text-sm font-medium transition"
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
              className={`p-4 rounded-[4px] border ${
                alert.type === 'warning'
                  ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
                  : 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable'
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

      {/* Section 1: Revenue & Finance */}
      <Section title="Revenue & Finance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="MRR"
            value={fmtMoney(data.mrr, currency)}
            change={`+${data.mrrGrowth}% MoM`}
            trend="up"
            color="green"
          />
          <MetricCard
            label="ARR"
            value={fmtMoney(data.arr, currency)}
            change={`+${data.arr_growth}% YoY`}
            trend="up"
            color="green"
          />
          <MetricCard
            label="CAC"
            value={fmtMoney(data.cac, currency)}
            change="Coût d'acquisition"
            trend="down"
            color="blue"
          />
          <MetricCard
            label="LTV"
            value={fmtMoney(data.ltv, currency)}
            change={`Ratio LTV:CAC = ${(data.ltv / data.cac).toFixed(1)}x`}
            trend="up"
            color="purple"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueBreakdown
            title="Mix de revenu"
            data={data.revenue_mix}
            colors={['#2D6A4F', '#C9A84C', '#8B6914']}
          />
          <MetricCard
            label="Payback Period"
            value={`${data.payback_period} mois`}
            change="Temps de récupération"
            color="indigo"
          />
          <MetricCard
            label="Projection 3M"
            value={fmtMoney(data.revenue_projection_3m, currency)}
            change="Revenu estimé"
            color="emerald"
          />
        </div>
      </Section>

      {/* Section 1b: SaaS — Sous-segments */}
      <Section title="SaaS — Sous-segments Abonnements">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Abonnés payants"
            value={data.saas_subscribers}
            change={`ARPA moyen : ${data.arpa} €/mois`}
            trend="up"
            color="green"
          />
          {data.saas_segments && Object.entries(data.saas_segments).map(([seg, info]) => (
            <div key={seg} className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
              <p className="text-kcb-pierre text-sm mb-1 capitalize">{seg} <span className="text-kcb-or">({info.share}%)</span></p>
              <p className="text-2xl font-bold text-white">{info.count} <span className="text-base font-normal text-kcb-pierre">abonnés</span></p>
              <p className="text-green-300 font-semibold mt-1">{fmtMoney(info.mrr, currency)} MRR</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Section 2: Utilisateurs & Croissance */}
      <Section title="Utilisateurs & Croissance">
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
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-kcb-pierre text-sm mb-2">Canaux d'acquisition</p>
            <div className="space-y-2">
              {Object.entries(data.channels).map(([channel, metrics]) => (
                <div key={channel} className="flex justify-between text-sm">
                  <span className="text-kcb-sable capitalize">{channel}</span>
                  <span className="text-white font-semibold">
                    {metrics.users} (ROI: {metrics.roi}x)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 3: Contenu & Inventaire */}
      <Section title="Contenu & Inventaire">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Œuvres Total"
            value={data.totalArtworks}
            change={`+${data.artworks_growth}% ce mois`}
            trend="up"
            color="purple"
          />
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-kcb-pierre text-sm mb-2">Par catégorie</p>
            <div className="space-y-1">
              {Object.entries(data.artworks_by_category).map(([cat, count]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-kcb-sable capitalize">{cat}</span>
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
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-kcb-pierre text-sm mb-2">Top Artistes</p>
            <div className="space-y-1">
              {data.top_artists.slice(0, 3).map((artist, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-kcb-sable">{artist.name}</span>
                  <span className="text-green-300 font-semibold">
                    {fmtMoney(artist.revenue, currency, { compact: true })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4: Marketplace & Ventes */}
      <Section title="Marketplace & Ventes">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="GMV"
            value={fmtMoney(data.gmv, currency, { compact: true })}
            change="Volume marchand brut"
            color="green"
          />
          <MetricCard
            label="AOV"
            value={fmtMoney(data.aov, currency)}
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
            value={fmtMoney(data.commission_revenue, currency, { compact: true })}
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
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-white font-semibold mb-3">Meilleures ventes</p>
            <div className="space-y-2">
              {data.best_sellers.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-kcb-pierre text-xs">{item.sales} ventes</p>
                  </div>
                  <span className="text-green-300 font-semibold">
                    {fmtMoney(item.revenue, currency, { compact: true })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4b: Logistique */}
      {data.logistics && (
        <Section title="Logistique">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Envois 2025 (total)"
              value={data.logistics.envois_2025}
              change={`${data.logistics.envois_mensuels} envois/mois en moyenne`}
              color="blue"
            />
            <MetricCard
              label="Panier moyen logistique"
              value={fmtMoney(data.logistics.panier_moyen, currency)}
              change="Par envoi"
              color="indigo"
            />
            <MetricCard
              label="Revenu logistique/mois"
              value={fmtMoney(data.logistics.revenu_mensuel, currency)}
              trend="up"
              color="green"
            />
            <MetricCard
              label="Marge logistique"
              value={`${data.logistics.marge}%`}
              change="Marge nette"
              trend="up"
              color="emerald"
            />
          </div>
        </Section>
      )}

      {/* Section 5: Engagement & Rétention */}
      <Section title="Engagement & Rétention">
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
            label="À Risque"
            value={data.at_risk_users}
            change="Utilisateurs de churn"
            trend="down"
            color="red"
          />
        </div>
        <div className="mt-4 bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
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

      {/* Section 6: Technique & Performance */}
      <Section title="Technique & Performance">
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
        <div className="mt-4 bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
          <p className="text-white font-semibold mb-3">Web Vitals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VitalCard label="LCP" value={`${data.lcp}s`} target="< 2.5s" status="good" />
            <VitalCard label="FID" value={`${data.fid}ms`} target="< 100ms" status="good" />
            <VitalCard label="CLS" value={data.cls} target="< 0.1" status="needs-improvement" />
          </div>
        </div>
      </Section>

      {/* Section 7: Support & Satisfaction */}
      <Section title="Support & Satisfaction">
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
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-white font-semibold mb-3">Catégories de problèmes</p>
            <div className="space-y-2">
              {Object.entries(data.ticket_categories).map(([category, count]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-kcb-sable capitalize">{category}</span>
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

      {/* Section 8: Prédictions & Alertes */}
      <Section title="Prédictions & Opportunités">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            label="MRR Projection"
            value={fmtMoney(data.mrr_projection, currency)}
            change="Estimé le mois prochain"
            color="green"
          />
          <MetricCard
            label="Churn Risk"
            value={data.churn_risk_users}
            change="Utilisateurs à risque"
            trend="down"
            color="orange"
          />
          <MetricCard
            label="Upsell"
            value={data.upsell_opportunities}
            change="Opportunités identifiées"
            color="purple"
          />
        </div>
      </Section>

      {/* Section 9: Actions Rapides */}
      <Section title="Actions Rapides">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <ActionButton
            icon=""
            label="Réviser Œuvres"
            badge={data.pendingArtworks || 18}
            onClick={() => {}}
          />
          <ActionButton
            icon=""
            label="Gérer Utilisateurs"
            badge={data.totalUsers || 23}
            onClick={() => {}}
          />
          <ActionButton
            icon=""
            label="Tickets Support"
            badge={data.openTickets || 8}
            onClick={() => {}}
          />
        </div>
      </Section>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-white font-playfair">{title}</h2>
      {children}
    </div>
  )
}

function MetricCard({ label, value, change, trend, color = 'gray' }) {
  const colorClasses = {
    green: 'bg-green-500/10 border-green-500/30 text-green-300',
    blue: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    purple: 'bg-kcb-bronze/10 border-kcb-bronze/30 text-kcb-sable',
    indigo: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    violet: 'bg-kcb-bronze/10 border-kcb-bronze/30 text-kcb-sable',
    amber: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    emerald: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    orange: 'bg-kcb-or/10 border-kcb-or/30 text-kcb-sable',
    red: 'bg-red-500/10 border-red-500/30 text-red-300',
  }

  return (
    <div className={`border rounded-[4px] p-4 ${colorClasses[color]}`}>
      <p className="text-kcb-pierre text-sm mb-2">{label}</p>
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
  )
}

function RevenueBreakdown({ title, data, colors }) {
  const total = Object.values(data).reduce((a, b) => a + b, 0)
  return (
    <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
      <p className="text-white font-semibold mb-3">{title}</p>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value], idx) => (
          <div key={key}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-kcb-sable capitalize">{key}</span>
              <span className="text-white font-semibold">
                {((value / total) * 100).toFixed(0)}%
              </span>
            </div>
            <div className="h-2 bg-kcb-ardoise rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${(value / total) * 100}%`, backgroundColor: colors[idx] }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function FunnelChart({ title, stages }) {
  const maxValue = Math.max(...stages.map((s) => s.value))
  return (
    <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
      <p className="text-white font-semibold mb-4">{title}</p>
      <div className="space-y-3">
        {stages.map((stage, idx) => {
          const width = (stage.value / maxValue) * 100
          const colorMap = {
            blue: '#C9A84C',
            purple: '#8B6914',
            indigo: '#C9A84C',
            green: '#10b981',
          }
          return (
            <div key={idx}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-kcb-sable">{stage.label}</span>
                <span className="text-white font-semibold">{stage.value.toLocaleString()}</span>
              </div>
              <div className="h-3 bg-kcb-ardoise rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{ width: `${width}%`, backgroundColor: colorMap[stage.color] }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function ProgressBar({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-kcb-sable">{label}</span>
        <span className="text-white font-semibold">{value}%</span>
      </div>
      <div className="h-2 bg-kcb-ardoise rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-kcb-or to-kcb-bronze"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

function VitalCard({ label, value, target, status }) {
  const statusColor = status === 'good' ? 'text-green-400' : 'text-yellow-400'
  return (
    <div className="bg-kcb-ardoise/50 rounded-[4px] p-3 text-center border border-white/[0.06]">
      <p className="text-kcb-pierre text-xs mb-1">{label}</p>
      <p className={`text-2xl font-bold ${statusColor}`}>{value}</p>
      <p className="text-kcb-pierre text-xs mt-1">{target}</p>
    </div>
  )
}

function ActionButton({ icon, label, badge, onClick }) {
  return (
    <button
      onClick={onClick}
      className="bg-kcb-ardoise/50 border border-white/[0.06] hover:border-kcb-or/50 rounded-[4px] p-4 text-left transition group"
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-2xl">{icon}</span>
        {badge && (
          <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>
      <p className="text-white font-semibold group-hover:text-kcb-or transition">{label}</p>
    </button>
  )
}
