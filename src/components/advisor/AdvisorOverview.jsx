import { motion } from 'framer-motion'
import {
  TrendingUp,
  Users,
  Briefcase,
  AlertCircle,
  Clock,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Plus,
  FileText,
  ChevronRight,
  Activity,
} from 'lucide-react'

// ── Mock data ──────────────────────────────────────────────────────────────────

const MOCK_CLIENTS = [
  { id: 1, name: 'Marie Dubois', aum: 450000, ytd: 15.2, status: 'active', nextReview: '2026-06-15' },
  { id: 2, name: 'John Smith', aum: 680000, ytd: 8.4, status: 'active', nextReview: '2026-06-20' },
  { id: 3, name: 'Fondation Lumière', aum: 1200000, ytd: 18.1, status: 'active', nextReview: '2026-07-01' },
  { id: 4, name: 'Ahmed Al-Rashid', aum: 320000, ytd: 5.7, status: 'active', nextReview: '2026-06-10' },
  { id: 5, name: 'Sophie Laurent', aum: 195000, ytd: 22.3, status: 'active', nextReview: '2026-06-05' },
  { id: 6, name: 'Marcus Weber', aum: 540000, ytd: -2.1, status: 'review', nextReview: '2026-05-30' },
  { id: 7, name: 'Chioma Okafor', aum: 280000, ytd: 11.8, status: 'active', nextReview: '2026-06-25' },
  { id: 8, name: 'Elena Petrov', aum: 165000, ytd: 6.2, status: 'inactive', nextReview: '2026-06-12' },
]

const MOCK_PIPELINE = {
  prospect: [
    { id: 1, title: 'Sunset in Dakar', artist: 'Aminata Diop', price: 18000, client: 'Marie Dubois', days: 3, priority: 'high' },
    { id: 2, title: 'Forest Study #7', artist: 'Kofi Mensah', price: 9500, client: 'John Smith', days: 8, priority: 'medium' },
    { id: 3, title: 'Abstract #3', artist: 'Cheick Mbaye', price: 12000, client: 'Fondation Lumière', days: 1, priority: 'high' },
  ],
  analysis: [
    { id: 4, title: 'Lagos Dusk', artist: 'Ngozi Adeyemi', price: 24000, client: 'Ahmed Al-Rashid', days: 5, priority: 'high' },
    { id: 5, title: 'Masque Série IV', artist: 'Oumar Diallo', price: 6800, client: 'Sophie Laurent', days: 12, priority: 'low' },
  ],
  offer: [
    { id: 6, title: 'Femme au Marché', artist: 'Bineta Sow', price: 32000, client: 'Marcus Weber', days: 7, priority: 'high' },
  ],
  closing: [
    { id: 7, title: 'Baobab Series I', artist: 'Adama Traoré', price: 15000, client: 'Chioma Okafor', days: 2, priority: 'high' },
  ],
}

const MOCK_ACTIVITY = [
  { id: 1, type: 'sale', text: 'Vente conclue — "Baobab Series I" pour Chioma Okafor', time: 'Il y a 2h', icon: CheckCircle, color: 'text-kcb-or' },
  { id: 2, type: 'review', text: 'Revue portefeuille due — Marcus Weber', time: 'Il y a 4h', icon: AlertCircle, color: 'text-kcb-bronze' },
  { id: 3, type: 'deal', text: 'Nouvelle opportunité — "Femme au Marché" en offre', time: 'Hier', icon: Briefcase, color: 'text-kcb-or' },
  { id: 4, type: 'client', text: 'Sophie Laurent — Review trimestrielle programmée', time: 'Hier', icon: Users, color: 'text-kcb-pierre' },
  { id: 5, type: 'market', text: 'Art sénégalais +18% YTD — opportunité portefeuille', time: '2j', icon: TrendingUp, color: 'text-kcb-or' },
]

const PIPELINE_STAGES = ['prospect', 'analysis', 'offer', 'closing']
const STAGE_LABELS = { prospect: 'Prospect', analysis: 'Analyse', offer: 'Offre', closing: 'Closing' }

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: 'easeOut' } },
}

function fmt(n) {
  if (n >= 1000000) return `€${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `€${(n / 1000).toFixed(0)}K`
  return `€${n}`
}

const totalAUM = MOCK_CLIENTS.reduce((s, c) => s + c.aum, 0)
const avgYTD = (MOCK_CLIENTS.reduce((s, c) => s + c.ytd, 0) / MOCK_CLIENTS.length).toFixed(1)
const totalDeals = Object.values(MOCK_PIPELINE).reduce((s, arr) => s + arr.length, 0)
const pendingReviews = MOCK_CLIENTS.filter((c) => c.status === 'review').length

const PriorityDot = ({ p }) => {
  const colors = { high: 'bg-kcb-or', medium: 'bg-kcb-bronze', low: 'bg-kcb-pierre' }
  return <span className={`w-1.5 h-1.5 rounded-full inline-block ${colors[p] ?? colors.low}`} />
}

export function AdvisorOverview({ setTab }) {
  return (
    <div className="space-y-6 pb-8">
      {/* KPI header */}
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {[
          { label: 'Total AUM', value: fmt(totalAUM), sub: `${MOCK_CLIENTS.length} clients`, icon: TrendingUp, color: 'text-kcb-or' },
          { label: 'Perf. YTD moy.', value: `+${avgYTD}%`, sub: 'Tous portefeuilles', icon: Activity, color: 'text-kcb-or' },
          { label: 'Clients actifs', value: MOCK_CLIENTS.filter(c => c.status === 'active').length, sub: `${MOCK_CLIENTS.length} total`, icon: Users, color: 'text-kcb-bronze' },
          { label: 'Deals pipeline', value: totalDeals, sub: `${pendingReviews} revue(s) due(s)`, icon: Briefcase, color: 'text-kcb-bronze' },
        ].map((kpi, i) => (
          <motion.div
            key={i}
            variants={fadeUp}
            className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] p-4"
          >
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs text-kcb-pierre">{kpi.label}</p>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <p className={`text-2xl font-bold tabular-nums ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs text-kcb-pierre mt-1">{kpi.sub}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Alerts */}
      {(pendingReviews > 0 || MOCK_CLIENTS.some(c => c.status === 'review')) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex items-center gap-3 bg-kcb-bronze/10 border border-kcb-bronze/20 rounded-[4px] px-4 py-3 text-sm"
        >
          <AlertCircle className="w-4 h-4 text-kcb-bronze shrink-0" />
          <p className="text-kcb-sable">
            {pendingReviews} portefeuille{pendingReviews > 1 ? 's' : ''} nécessite{pendingReviews > 1 ? 'nt' : ''} une revue.{' '}
            <button onClick={() => setTab(1)} className="text-kcb-or underline hover:text-kcb-bronze">
              Voir les clients
            </button>
          </p>
        </motion.div>
      )}

      {/* Pipeline compact */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-kcb-or" />
            Deal Pipeline
          </h3>
          <button
            onClick={() => setTab(2)}
            className="text-xs text-kcb-or hover:text-kcb-bronze flex items-center gap-1 transition"
          >
            Vue complète <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {PIPELINE_STAGES.map((stage) => {
            const deals = MOCK_PIPELINE[stage]
            const total = deals.reduce((s, d) => s + d.price, 0)
            return (
              <div key={stage} className="bg-kcb-noir/40 rounded-[4px] p-3 border border-white/[0.04]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-kcb-pierre">{STAGE_LABELS[stage]}</span>
                  <span className="text-xs font-bold text-kcb-or tabular-nums">{deals.length}</span>
                </div>
                <p className="text-sm font-bold text-white tabular-nums">{fmt(total)}</p>
                <div className="mt-2 space-y-1">
                  {deals.slice(0, 2).map((d) => (
                    <div key={d.id} className="flex items-center gap-1.5 text-[11px] text-kcb-pierre truncate">
                      <PriorityDot p={d.priority} />
                      <span className="truncate">{d.artist}</span>
                    </div>
                  ))}
                  {deals.length > 2 && (
                    <p className="text-[11px] text-kcb-pierre/60">+{deals.length - 2} autres</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Activity + Quick actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Activity feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.38 }}
          className="lg:col-span-2 bg-kcb-ardoise rounded-[4px] border border-white/[0.06] p-4"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Activity className="w-4 h-4 text-kcb-bronze" />
            Activité récente
          </h3>
          <div className="space-y-3">
            {MOCK_ACTIVITY.map((event) => (
              <div key={event.id} className="flex items-start gap-3 py-2 border-b border-white/[0.04] last:border-0">
                <event.icon className={`w-4 h-4 mt-0.5 shrink-0 ${event.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-kcb-sable leading-snug">{event.text}</p>
                </div>
                <span className="text-xs text-kcb-pierre shrink-0">{event.time}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Quick actions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.42 }}
          className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] p-4"
        >
          <h3 className="text-sm font-semibold text-white mb-4">Actions rapides</h3>
          <div className="space-y-2">
            {[
              { label: 'Nouveau client', icon: Users, tab: 1 },
              { label: 'Créer un deal', icon: Plus, tab: 2 },
              { label: 'Marché & intelligence', icon: TrendingUp, tab: 3 },
              { label: 'Générer un rapport', icon: FileText, tab: 4 },
            ].map((action, i) => (
              <button
                key={i}
                onClick={() => setTab(action.tab)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[4px] border border-white/[0.06] hover:bg-white/[0.04] hover:border-kcb-or/20 transition text-left"
              >
                <action.icon className="w-4 h-4 text-kcb-or shrink-0" />
                <span className="text-sm text-kcb-sable">{action.label}</span>
                <ChevronRight className="w-3.5 h-3.5 text-kcb-pierre ml-auto" />
              </button>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top clients snapshot */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.48 }}
        className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-kcb-or" />
            Clients — vue portefeuille
          </h3>
          <button
            onClick={() => setTab(1)}
            className="text-xs text-kcb-or hover:text-kcb-bronze flex items-center gap-1 transition"
          >
            Tous les clients <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="text-left py-2 px-2 text-xs text-kcb-pierre font-medium">Client</th>
                <th className="text-right py-2 px-2 text-xs text-kcb-pierre font-medium">AUM</th>
                <th className="text-right py-2 px-2 text-xs text-kcb-pierre font-medium">YTD</th>
                <th className="text-right py-2 px-2 text-xs text-kcb-pierre font-medium hidden sm:table-cell">Prochaine revue</th>
                <th className="text-center py-2 px-2 text-xs text-kcb-pierre font-medium">Statut</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_CLIENTS.slice(0, 5).map((client) => (
                <tr key={client.id} className="border-b border-white/[0.03] hover:bg-white/[0.02]">
                  <td className="py-2.5 px-2 text-white font-medium">{client.name}</td>
                  <td className="py-2.5 px-2 text-right text-kcb-or tabular-nums font-semibold">
                    {fmt(client.aum)}
                  </td>
                  <td className="py-2.5 px-2 text-right tabular-nums">
                    <span className={`flex items-center justify-end gap-0.5 ${client.ytd >= 0 ? 'text-kcb-or' : 'text-red-400'}`}>
                      {client.ytd >= 0 ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                      {Math.abs(client.ytd)}%
                    </span>
                  </td>
                  <td className="py-2.5 px-2 text-right text-kcb-pierre hidden sm:table-cell">
                    {client.nextReview}
                  </td>
                  <td className="py-2.5 px-2 text-center">
                    <span className={`text-[10px] px-2 py-0.5 rounded-[4px] font-medium ${
                      client.status === 'active' ? 'bg-kcb-or/10 text-kcb-or' :
                      client.status === 'review' ? 'bg-kcb-bronze/20 text-kcb-bronze' :
                      'bg-white/[0.05] text-kcb-pierre'
                    }`}>
                      {client.status === 'active' ? 'Actif' : client.status === 'review' ? 'Revue' : 'Inactif'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  )
}
