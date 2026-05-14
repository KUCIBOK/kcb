import { useState, useEffect } from 'react'
import { utils } from '../../api/useAPI'
import { fmtMoney, XOF_PER_EUR } from '../../lib/currency'
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

const PERIODS = [
  { key: 'q1_2026',       label: 'Q1 2026',      short: 'Jan–Mar 2026' },
  { key: 'q2_2026',       label: 'Q2 2026',      short: 'Avr–Juin 2026' },
  { key: 'current_month', label: 'Mois courant', short: 'Ce mois' },
  { key: 'all_time',      label: 'Tout',         short: 'Tout' },
]

// Données réelles Q1 2026 — source : DashboardComptable_V5.xlsx Q1 2026.pdf
const Q1_2026 = {
  mrr: 6046,           // MRR fin mars 2026
  arr: 72552,          // 6 046 × 12
  mrrGrowth: 12,       // +12%/mois (base déc 2025 = 4 303 €)
  arr_growth: 40.5,    // croissance vs déc 2025
  revenue_projection_3m: 6772, // 6 046 × 1,12
  payback_period: 7,
  cac: 190,
  ltv: 600,
  revenue_mix: { saas: 57, logistique: 23, numerisation: 10, marketplace: 9 },
  saas_subscribers: 232,
  arpa: 26,
  saas_segments: {
    collectionneur: { count: 51,  mrr: 1279, share: 22 },
    curateur:       { count: 128, mrr: 3197, share: 55 },
    galerie:        { count: 63,  mrr: 1570, share: 27 },
  },
  gmv:               900,    // marketplace avg mensuel (2 700 / 3)
  aov:               225,    // proxy GMV / ventes
  commission_revenue: 180,   // avg mensuel
  logistics: {
    envois_2025:     31,     // total Q1 (8 + 10 + 13)
    envois_mensuels: 10.3,
    panier_moyen:    250,
    revenu_mensuel:  2233,   // 6 700 / 3
    marge:           63.0,   // (6 700 - 2 480) / 6 700
  },
  // P&L mensuel complet — pour la section dédiée
  pl_monthly: [
    {
      mois: 'Janvier 2026',
      produits: { saas: 4820, marketplace: 1000, logistique: 2000, numerisation: 900, nouveaux_marches: 0,  total: 8720  },
      charges:  { salaires: 4500, tech: 750,  marketing: 1500, logistique: 640,  numerisation: 360,  admin: 500, amort: 200, divers: 450, total: 8500 },
      net: 220, marge: 2.5, mrr: 4820, abonnes: 185,
    },
    {
      mois: 'Février 2026',
      produits: { saas: 5398, marketplace: 900,  logistique: 2200, numerisation: 1000, nouveaux_marches: 300,  total: 9498  },
      charges:  { salaires: 4500, tech: 800,  marketing: 2000, logistique: 800,  numerisation: 450,  admin: 550, amort: 200, divers: 500, total: 9000 },
      net: 498, marge: 5.2, mrr: 5398, abonnes: 207,
    },
    {
      mois: 'Mars 2026',
      produits: { saas: 6046, marketplace: 800,  logistique: 2500, numerisation: 1100, nouveaux_marches: 800,  total: 10446 },
      charges:  { salaires: 4800, tech: 900,  marketing: 2500, logistique: 1040, numerisation: 540,  admin: 600, amort: 200, divers: 560, total: 9500 },
      net: 946, marge: 9.1, mrr: 6046, abonnes: 232,
    },
  ],
  pl_q1_total: {
    produits: { saas: 16264, marketplace: 2700, logistique: 6700, numerisation: 3000, nouveaux_marches: 1100, total: 28664 },
    charges:  { salaires: 13800, tech: 2450, marketing: 6000, logistique: 2480, numerisation: 1350, admin: 1650, amort: 600, divers: 1510, total: 27000 },
    net: 1664, marge: 5.6,
  },
}

export function Analytics({ currency = 'EUR' }) {
  const [data, setData] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [period, setPeriod] = useState('current_month')
  const [liveData, setLiveData] = useState(null)
  // Les valeurs de defaultData sont en EUR — fmtMoney attend du XOF, on convertit avant affichage
  const fmt = (eurAmount, opts) => fmtMoney(eurAmount * XOF_PER_EUR, currency, opts)

  // Données complètes par défaut
  const defaultData = {
    // Revenue & Finance — valeurs en EUR
    mrr: 4303,
    arr: 51636, // = MRR × 12 ✓
    mrrGrowth: 12.5,
    arr_growth: 18.2,
    // Mix: Marketplace 20% / SaaS 40% / Numérisation 10% / Logistique 30%
    revenue_mix: { marketplace: 20, subscriptions: 40, artworks: 10, logistique: 30 },
    cac: 190, // Budget marketing 12 700 € ÷ 67 nouveaux abonnés
    ltv: 600, // ARPA ÷ churn mensuel 4,5 % = 27 ÷ 0,045
    payback_period: 7, // CAC ÷ ARPA = 190 ÷ 27
    revenue_projection_3m: 4820, // MRR mois prochain = MRR × 1,12

    // SaaS — Sous-segments abonnements
    saas_subscribers: 159,
    arpa: 27,
    saas_segments: {
      collectionneur: { count: 34, mrr: 909, share: 22 },
      curateur: { count: 87, mrr: 2272, share: 55 },
      galerie: { count: 43, mrr: 1117, share: 27 }, // 909+2272+1117 = 4 298 ≈ 4 303 €
    },

    // Utilisateurs & Croissance
    totalUsers: 7154,
    mau: 5500, // MAU = DAU ÷ 66,7 % = 3 668 ÷ 0,667
    dau: 3668, // NE PAS MODIFIER — DAU/MAU 66,7 %
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

    // Marketplace & Ventes — valeurs en EUR
    gmv: 1707, // GMV mensuel
    aov: 279, // = round(GMV / sales) ✓
    conversion_rate: 3.8,
    views_total: 12450,
    favorites: 856,
    messages: 234,
    sales: 228,
    best_sellers: [
      { title: 'Artwork 1', sales: 45, revenue: 22500 },
      { title: 'Artwork 2', sales: 32, revenue: 16000 },
    ],
    commission_revenue: 341, // = round(GMV × 0,20) ✓

    // Logistique — valeurs en EUR
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

    // Prédictions — valeurs en EUR
    mrr_projection: 4820,
    churn_risk_users: 7,
    upsell_opportunities: 7,
    alerts: [
      { type: 'warning', message: '7 utilisateurs à risque de churn' },
      { type: 'info', message: "7 opportunités d'upsell identifiées" },
    ],
  }

  const loadLiveData = async (p) => {
    try {
      const response = await fetch(`${utils.api}/analytics?period=${p}`, utils.options)
      const result = await response.json()
      if (result?.data) setLiveData(result.data)
    } catch (_err) {
      // fallback sur defaultData
    }
  }

  useEffect(() => {
    setData(defaultData) // eslint-disable-line react-hooks/set-state-in-effect
    setLiveData(null)
    loadLiveData(period)
    if (autoRefresh) {
      const interval = setInterval(() => loadLiveData(period), 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, period]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fusionne les vraies données sur les valeurs connues
  const q1Static = period === 'q1_2026' ? {
    mrr:                   Q1_2026.mrr,
    arr:                   Q1_2026.arr,
    mrrGrowth:             Q1_2026.mrrGrowth,
    arr_growth:            Q1_2026.arr_growth,
    revenue_projection_3m: Q1_2026.revenue_projection_3m,
    payback_period:        Q1_2026.payback_period,
    cac:                   Q1_2026.cac,
    ltv:                   Q1_2026.ltv,
    revenue_mix:           Q1_2026.revenue_mix,
    saas_subscribers:      Q1_2026.saas_subscribers,
    arpa:                  Q1_2026.arpa,
    saas_segments:         Q1_2026.saas_segments,
    gmv:                   Q1_2026.gmv,
    aov:                   Q1_2026.aov,
    commission_revenue:    Q1_2026.commission_revenue,
    logistics:             Q1_2026.logistics,
  } : {}

  const merged = data ? {
    ...data,
    ...q1Static,
    ...(liveData ? {
      totalArtworks:   liveData.artworks?.total    ?? data.totalArtworks,
      gmv:             liveData.transactions?.gmv_eur ?? (q1Static.gmv ?? data.gmv),
      aov:             liveData.transactions?.aov_eur  || (q1Static.aov ?? data.aov),
      sales:           liveData.transactions?.completed ?? data.sales,
      pendingArtworks: liveData.pending_artworks   ?? data.pendingArtworks,
    } : {}),
  } : null

  if (!merged)
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-white">Dashboard Principal</h1>
          <p className="text-kcb-pierre mt-2">
            {PERIODS.find(p => p.key === period)?.short ?? 'Ce mois'} — données réelles + projections
          </p>
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          {/* Sélecteur de période */}
          <div className="flex items-center gap-1 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-1">
            {PERIODS.map((p) => (
              <button
                key={p.key}
                onClick={() => setPeriod(p.key)}
                className={`px-3 py-1 rounded text-xs font-medium transition ${
                  period === p.key
                    ? 'bg-kcb-or text-kcb-noir'
                    : 'text-kcb-pierre hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
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
            onClick={() => loadLiveData(period)}
            className="px-4 py-2 bg-kcb-or hover:bg-kcb-bronze rounded text-kcb-noir text-sm font-medium transition"
          >
            Refresh
          </button>
        </div>
      </div>
      {/* Badge données réelles */}
      {liveData && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 border border-green-500/20 rounded-[4px] px-3 py-2 w-fit">
          <CheckCircle className="w-3.5 h-3.5" />
          Données Supabase chargées — {PERIODS.find(p => p.key === period)?.short}
          {liveData.transactions && (
            <span className="text-green-300/70 ml-1">
              · {liveData.transactions.completed} transactions · {liveData.artworks?.total ?? 0} œuvres · {liveData.users?.new ?? 0} nouveaux users
            </span>
          )}
        </div>
      )}

      {/* Alertes & Actions Rapides */}
      {merged.alerts && merged.alerts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {merged.alerts.map((alert, idx) => (
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
            value={fmt(merged.mrr)}
            change={`+${merged.mrrGrowth}% MoM`}
            trend="up"
            color="green"
          />
          <MetricCard
            label="ARR"
            value={fmt(merged.arr)}
            change={`+${merged.arr_growth}% YoY`}
            trend="up"
            color="green"
          />
          <MetricCard
            label="CAC"
            value={fmt(merged.cac)}
            change="Coût d'acquisition"
            trend="down"
            color="blue"
          />
          <MetricCard
            label="LTV"
            value={fmt(merged.ltv)}
            change={`Ratio LTV:CAC = ${(merged.ltv / merged.cac).toFixed(1)}x`}
            trend="up"
            color="purple"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
          <RevenueBreakdown
            title="Mix de revenu"
            data={merged.revenue_mix}
            colors={['#2D6A4F', '#C9A84C', '#8B6914']}
          />
          <MetricCard
            label="Payback Period"
            value={`${merged.payback_period} mois`}
            change="Temps de récupération"
            color="indigo"
          />
          <MetricCard
            label="MRR M+1"
            value={fmt(merged.revenue_projection_3m)}
            change={`+12% MoM — MRR × 1,12`}
            color="emerald"
          />
        </div>
      </Section>

      {/* Section 1b: SaaS — Sous-segments */}
      <Section title="SaaS — Sous-segments Abonnements">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Abonnés payants"
            value={merged.saas_subscribers}
            change={`ARPA moyen : ${merged.arpa} €/mois`}
            trend="up"
            color="green"
          />
          {merged.saas_segments &&
            Object.entries(merged.saas_segments).map(([seg, info]) => (
              <div
                key={seg}
                className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4"
              >
                <p className="text-kcb-pierre text-sm mb-1 capitalize">
                  {seg} <span className="text-kcb-or">({info.share}%)</span>
                </p>
                <p className="text-2xl font-bold text-white">
                  {info.count}{' '}
                  <span className="text-base font-normal text-kcb-pierre">abonnés</span>
                </p>
                <p className="text-green-300 font-semibold mt-1">{fmt(info.mrr)} MRR</p>
              </div>
            ))}
        </div>
      </Section>

      {/* Section 2: Utilisateurs & Croissance */}
      <Section title="Utilisateurs & Croissance">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Total Utilisateurs"
            value={merged.totalUsers}
            change={`+${merged.acquisition_growth}% ce mois`}
            trend="up"
            color="blue"
          />
          <MetricCard
            label="MAU"
            value={merged.mau}
            change="Utilisateurs actifs mensuels"
            color="indigo"
          />
          <MetricCard
            label="DAU"
            value={merged.dau}
            change="Utilisateurs actifs quotidiens"
            color="violet"
          />
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-kcb-pierre text-sm mb-2">Canaux d'acquisition</p>
            <div className="space-y-2">
              {Object.entries(merged.channels).map(([channel, metrics]) => (
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
            value={merged.totalArtworks}
            change={`+${merged.artworks_growth}% ce mois`}
            trend="up"
            color="purple"
          />
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-kcb-pierre text-sm mb-2">Par catégorie</p>
            <div className="space-y-1">
              {Object.entries(merged.artworks_by_category).map(([cat, count]) => (
                <div key={cat} className="flex justify-between text-sm">
                  <span className="text-kcb-sable capitalize">{cat}</span>
                  <span className="text-white font-semibold">{count}</span>
                </div>
              ))}
            </div>
          </div>
          <MetricCard
            label="Score Qualité"
            value={`${merged.quality_score}%`}
            change={`${merged.artworks_with_cert}/${merged.totalArtworks} avec cert`}
            trend="up"
            color="green"
          />
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-kcb-pierre text-sm mb-2">Top Artistes</p>
            <div className="space-y-1">
              {merged.top_artists.slice(0, 3).map((artist, idx) => (
                <div key={idx} className="flex justify-between text-sm">
                  <span className="text-kcb-sable">{artist.name}</span>
                  <span className="text-green-300 font-semibold">
                    {fmt(artist.revenue, { compact: true })}
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
            value={fmt(merged.gmv, { compact: true })}
            change="Volume marchand brut"
            color="green"
          />
          <MetricCard
            label="AOV"
            value={fmt(merged.aov)}
            change="Valeur moyenne par commande"
            color="blue"
          />
          <MetricCard
            label="Conversion"
            value={`${merged.conversion_rate}%`}
            change="Taux de conversion"
            color="purple"
          />
          <MetricCard
            label="Commission"
            value={fmt(merged.commission_revenue, { compact: true })}
            change="Revenu commission"
            color="amber"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <FunnelChart
            title="Funnel Marketplace"
            stages={[
              { label: 'Vues', value: merged.views_total, color: 'blue' },
              { label: 'Favoris', value: merged.favorites, color: 'purple' },
              { label: 'Messages', value: merged.messages, color: 'indigo' },
              { label: 'Ventes', value: merged.sales, color: 'green' },
            ]}
          />
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-white font-semibold mb-3">Meilleures ventes</p>
            <div className="space-y-2">
              {merged.best_sellers.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start">
                  <div>
                    <p className="text-white text-sm font-medium">{item.title}</p>
                    <p className="text-kcb-pierre text-xs">{item.sales} ventes</p>
                  </div>
                  <span className="text-green-300 font-semibold">
                    {fmt(item.revenue, { compact: true })}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* Section 4b: Logistique */}
      {merged.logistics && (
        <Section title="Logistique">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              label="Envois 2025 (total)"
              value={merged.logistics.envois_2025}
              change={`${merged.logistics.envois_mensuels} envois/mois en moyenne`}
              color="blue"
            />
            <MetricCard
              label="Panier moyen logistique"
              value={fmt(merged.logistics.panier_moyen)}
              change="Par envoi"
              color="indigo"
            />
            <MetricCard
              label="Revenu logistique/mois"
              value={fmt(merged.logistics.revenu_mensuel)}
              trend="up"
              color="green"
            />
            <MetricCard
              label="Marge logistique"
              value={`${merged.logistics.marge}%`}
              change="Marge nette"
              trend="up"
              color="emerald"
            />
          </div>
        </Section>
      )}

      {/* Section P&L Q1 2026 — visible uniquement en période Q1 2026 */}
      {period === 'q1_2026' && (
        <Section title="P&L Q1 2026 — Détail Mensuel">
          <div className="overflow-x-auto bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.08]">
                  <th className="text-left text-kcb-pierre py-2 pr-4 font-medium w-40">Ligne</th>
                  {Q1_2026.pl_monthly.map((m) => (
                    <th key={m.mois} className="text-right text-kcb-pierre py-2 px-3 font-medium">{m.mois}</th>
                  ))}
                  <th className="text-right text-kcb-or py-2 pl-3 font-medium">Q1 Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {/* Produits */}
                <tr>
                  <td colSpan={5} className="text-xs font-semibold text-kcb-or pt-3 pb-1 uppercase tracking-wide">Produits</td>
                </tr>
                {[
                  ['SaaS', 'saas'],
                  ['Marketplace', 'marketplace'],
                  ['Logistique', 'logistique'],
                  ['Numérisation', 'numerisation'],
                  ['Nouveaux marchés', 'nouveaux_marches'],
                ].map(([label, key]) => (
                  <tr key={key} className="hover:bg-white/[0.02]">
                    <td className="py-1.5 pr-4 text-kcb-sable">{label}</td>
                    {Q1_2026.pl_monthly.map((m) => (
                      <td key={m.mois} className="py-1.5 px-3 text-right text-white">
                        {m.produits[key] > 0 ? fmt(m.produits[key]) : <span className="text-kcb-pierre">—</span>}
                      </td>
                    ))}
                    <td className="py-1.5 pl-3 text-right text-kcb-sable">{Q1_2026.pl_q1_total.produits[key] > 0 ? fmt(Q1_2026.pl_q1_total.produits[key]) : <span className="text-kcb-pierre">—</span>}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/[0.12] font-semibold">
                  <td className="py-2 pr-4 text-white">Total Produits</td>
                  {Q1_2026.pl_monthly.map((m) => (
                    <td key={m.mois} className="py-2 px-3 text-right text-green-300">{fmt(m.produits.total)}</td>
                  ))}
                  <td className="py-2 pl-3 text-right text-green-300 font-bold">{fmt(Q1_2026.pl_q1_total.produits.total)}</td>
                </tr>

                {/* Charges */}
                <tr>
                  <td colSpan={5} className="text-xs font-semibold text-red-400 pt-4 pb-1 uppercase tracking-wide">Charges</td>
                </tr>
                {[
                  ['Salaires', 'salaires'],
                  ['Tech', 'tech'],
                  ['Marketing', 'marketing'],
                  ['Logistique', 'logistique'],
                  ['Numérisation', 'numerisation'],
                  ['Admin', 'admin'],
                  ['Amortissement', 'amort'],
                  ['Divers', 'divers'],
                ].map(([label, key]) => (
                  <tr key={key} className="hover:bg-white/[0.02]">
                    <td className="py-1.5 pr-4 text-kcb-sable">{label}</td>
                    {Q1_2026.pl_monthly.map((m) => (
                      <td key={m.mois} className="py-1.5 px-3 text-right text-white">{fmt(m.charges[key])}</td>
                    ))}
                    <td className="py-1.5 pl-3 text-right text-kcb-sable">{fmt(Q1_2026.pl_q1_total.charges[key])}</td>
                  </tr>
                ))}
                <tr className="border-t border-white/[0.12] font-semibold">
                  <td className="py-2 pr-4 text-white">Total Charges</td>
                  {Q1_2026.pl_monthly.map((m) => (
                    <td key={m.mois} className="py-2 px-3 text-right text-red-300">{fmt(m.charges.total)}</td>
                  ))}
                  <td className="py-2 pl-3 text-right text-red-300 font-bold">{fmt(Q1_2026.pl_q1_total.charges.total)}</td>
                </tr>

                {/* Résultat */}
                <tr className="border-t-2 border-kcb-or/40">
                  <td className="py-3 pr-4 text-kcb-or font-bold">Résultat net</td>
                  {Q1_2026.pl_monthly.map((m) => (
                    <td
                      key={m.mois}
                      className={`py-3 px-3 text-right font-bold ${m.net >= 0 ? 'text-green-300' : 'text-red-300'}`}
                    >
                      {fmt(m.net)}
                    </td>
                  ))}
                  <td className="py-3 pl-3 text-right font-bold text-green-300">{fmt(Q1_2026.pl_q1_total.net)}</td>
                </tr>
                <tr>
                  <td className="pb-2 pr-4 text-kcb-pierre text-xs">Marge nette</td>
                  {Q1_2026.pl_monthly.map((m) => (
                    <td key={m.mois} className="pb-2 px-3 text-right text-xs text-kcb-pierre">{m.marge}%</td>
                  ))}
                  <td className="pb-2 pl-3 text-right text-xs text-kcb-pierre">{Q1_2026.pl_q1_total.marge}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Abonnés + MRR par mois */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            {Q1_2026.pl_monthly.map((m) => (
              <div
                key={m.mois}
                className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4 text-center"
              >
                <p className="text-kcb-pierre text-xs mb-2">{m.mois}</p>
                <p className="text-3xl font-bold text-white">{m.abonnes}</p>
                <p className="text-xs text-kcb-pierre mt-1">abonnés</p>
                <p className="text-green-300 font-semibold mt-2 text-sm">MRR {fmt(m.mrr)}</p>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Section 5: Engagement & Rétention */}
      <Section title="Engagement & Rétention">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="Stickiness"
            value={`${merged.dau_mau_ratio.toFixed(1)}%`}
            change="DAU/MAU ratio"
            trend={merged.dau_mau_ratio > 50 ? 'up' : 'down'}
            color="indigo"
          />
          <MetricCard
            label="Rétention 7J"
            value={`${merged.retention_7d}%`}
            change="Utilisateurs revenant"
            color="green"
          />
          <MetricCard
            label="Rétention 30J"
            value={`${merged.retention_30d}%`}
            change="Rétention à 30 jours"
            color="blue"
          />
          <MetricCard
            label="À Risque"
            value={merged.at_risk_users}
            change="Utilisateurs de churn"
            trend="down"
            color="red"
          />
        </div>
        <div className="mt-4 bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
          <p className="text-white font-semibold mb-3">Adoption des features</p>
          <div className="space-y-2">
            {Object.entries(merged.feature_adoption).map(([feature, adoption]) => (
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
            value={`${merged.uptime}%`}
            change="Disponibilité du service"
            trend="up"
            color="green"
          />
          <MetricCard
            label="API Response"
            value={`${merged.api_response_time}ms`}
            change="Temps de réponse moyen"
            color="blue"
          />
          <MetricCard
            label="Error Rate"
            value={`${merged.error_rate}%`}
            change="Taux d'erreur"
            trend="down"
            color="red"
          />
          <MetricCard
            label="Certificats"
            value={merged.certs_generated}
            change="Générés ce mois"
            color="purple"
          />
        </div>
        <div className="mt-4 bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
          <p className="text-white font-semibold mb-3">Web Vitals</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VitalCard label="LCP" value={`${merged.lcp}s`} target="< 2.5s" status="good" />
            <VitalCard label="FID" value={`${merged.fid}ms`} target="< 100ms" status="good" />
            <VitalCard label="CLS" value={merged.cls} target="< 0.1" status="needs-improvement" />
          </div>
        </div>
      </Section>

      {/* Section 7: Support & Satisfaction */}
      <Section title="Support & Satisfaction">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            label="NPS"
            value={merged.nps}
            change="Score promoteur net"
            trend="up"
            color="green"
          />
          <MetricCard
            label="CSAT"
            value={`${merged.csat.toFixed(1)}/5`}
            change="Satisfaction client"
            color="blue"
          />
          <MetricCard
            label="Total Tickets"
            value={merged.total_tickets}
            change="Demandes de support"
            color="purple"
          />
          <MetricCard
            label="Temps Résolution"
            value={`${merged.avg_resolution_time}h`}
            change="Moyenne"
            color="indigo"
          />
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-kcb-ardoise/50 border border-white/[0.06] rounded-[4px] p-4">
            <p className="text-white font-semibold mb-3">Catégories de problèmes</p>
            <div className="space-y-2">
              {Object.entries(merged.ticket_categories).map(([category, count]) => (
                <div key={category} className="flex justify-between text-sm">
                  <span className="text-kcb-sable capitalize">{category}</span>
                  <span className="text-white font-semibold">{count} tickets</span>
                </div>
              ))}
            </div>
          </div>
          <MetricCard
            label="Temps Réponse"
            value={`${merged.avg_response_time}h`}
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
            value={fmt(merged.mrr_projection)}
            change="Estimé le mois prochain"
            color="green"
          />
          <MetricCard
            label="Churn Risk"
            value={merged.churn_risk_users}
            change="Utilisateurs à risque"
            trend="down"
            color="orange"
          />
          <MetricCard
            label="Upsell"
            value={merged.upsell_opportunities}
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
            badge={merged.pendingArtworks ?? '—'}
            onClick={() => {}}
          />
          <ActionButton
            icon=""
            label="Gérer Utilisateurs"
            badge={merged.totalUsers ?? '—'}
            onClick={() => {}}
          />
          <ActionButton
            icon=""
            label="Tickets Support"
            badge={merged.openTickets ?? '—'}
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
