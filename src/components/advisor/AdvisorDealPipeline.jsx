import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Briefcase,
  Clock,
  TrendingUp,
  Filter,
  ChevronRight,
} from 'lucide-react'

const STAGES = ['prospect', 'analysis', 'offer', 'closing']
const STAGE_CONFIG = {
  prospect: { label: 'Prospect', color: 'border-kcb-pierre/30 text-kcb-pierre' },
  analysis: { label: 'Analyse', color: 'border-kcb-bronze/40 text-kcb-bronze' },
  offer: { label: 'Offre', color: 'border-kcb-or/40 text-kcb-or' },
  closing: { label: 'Closing', color: 'border-kcb-or text-kcb-or' },
}
const PRIORITY_COLORS = {
  high: { dot: 'bg-kcb-or', label: 'text-kcb-or', bg: 'bg-kcb-or/10' },
  medium: { dot: 'bg-kcb-bronze', label: 'text-kcb-bronze', bg: 'bg-kcb-bronze/10' },
  low: { dot: 'bg-kcb-pierre', label: 'text-kcb-pierre', bg: 'bg-white/[0.05]' },
}

const ALL_DEALS = [
  { id: 1, stage: 'prospect', title: 'Sunset in Dakar', artist: 'Aminata Diop', price: 18000, client: 'Marie Dubois', days: 3, priority: 'high', category: 'Peinture' },
  { id: 2, stage: 'prospect', title: 'Forest Study #7', artist: 'Kofi Mensah', price: 9500, client: 'John Smith', days: 8, priority: 'medium', category: 'Dessin' },
  { id: 3, stage: 'prospect', title: 'Abstract #3', artist: 'Cheick Mbaye', price: 12000, client: 'Fondation Lumière', days: 1, priority: 'high', category: 'Art contemporain' },
  { id: 4, stage: 'prospect', title: 'Visage I', artist: 'Fanta Koné', price: 7200, client: 'Elena Petrov', days: 14, priority: 'low', category: 'Sculpture' },
  { id: 5, stage: 'analysis', title: 'Lagos Dusk', artist: 'Ngozi Adeyemi', price: 24000, client: 'Ahmed Al-Rashid', days: 5, priority: 'high', category: 'Peinture' },
  { id: 6, stage: 'analysis', title: 'Masque Série IV', artist: 'Oumar Diallo', price: 6800, client: 'Sophie Laurent', days: 12, priority: 'low', category: 'Sculpture' },
  { id: 7, stage: 'analysis', title: 'Harmattan', artist: 'Ibrahim Traoré', price: 15500, client: 'Chioma Okafor', days: 4, priority: 'medium', category: 'Photographie' },
  { id: 8, stage: 'offer', title: 'Femme au Marché', artist: 'Bineta Sow', price: 32000, client: 'Marcus Weber', days: 7, priority: 'high', category: 'Peinture' },
  { id: 9, stage: 'offer', title: 'Sahel #2', artist: 'Moussa Coulibaly', price: 11000, client: 'John Smith', days: 3, priority: 'medium', category: 'Photographie' },
  { id: 10, stage: 'closing', title: 'Baobab Series I', artist: 'Adama Traoré', price: 15000, client: 'Chioma Okafor', days: 2, priority: 'high', category: 'Peinture' },
  { id: 11, stage: 'closing', title: 'Okoye Portrait', artist: 'Emeka Okonkwo', price: 8500, client: 'Marie Dubois', days: 1, priority: 'high', category: 'Peinture' },
]

function fmt(n) {
  if (n >= 1000) return `€${(n / 1000).toFixed(0)}K`
  return `€${n}`
}

const totalValue = ALL_DEALS.reduce((s, d) => s + d.price, 0)
const conversionRate = ((ALL_DEALS.filter(d => d.stage === 'closing').length / ALL_DEALS.length) * 100).toFixed(0)
const avgDays = Math.round(ALL_DEALS.reduce((s, d) => s + d.days, 0) / ALL_DEALS.length)

function DealCard({ deal }) {
  const pc = PRIORITY_COLORS[deal.priority]
  return (
    <div className="bg-kcb-noir/50 border border-white/[0.04] rounded-[4px] p-3 hover:border-kcb-or/15 transition group">
      <div className="flex items-start justify-between mb-2">
        <p className="text-sm text-white font-medium leading-snug line-clamp-1">{deal.title}</p>
        <span className={`ml-2 shrink-0 text-[9px] px-1.5 py-0.5 rounded-[4px] font-semibold ${pc.bg} ${pc.label}`}>
          {deal.priority === 'high' ? 'URGENT' : deal.priority === 'medium' ? 'MOY.' : 'LOW'}
        </span>
      </div>
      <p className="text-xs text-kcb-bronze mb-1">{deal.artist}</p>
      <p className="text-xs text-kcb-pierre mb-3 line-clamp-1">{deal.client}</p>
      <div className="flex items-center justify-between">
        <span className="text-sm font-bold text-kcb-or tabular-nums">{fmt(deal.price)}</span>
        <div className="flex items-center gap-1 text-xs text-kcb-pierre">
          <Clock className="w-3 h-3" />
          {deal.days}j
        </div>
      </div>
      <p className="text-[10px] text-kcb-pierre/60 mt-1">{deal.category}</p>
    </div>
  )
}

export function AdvisorDealPipeline() {
  const [filterPriority, setFilterPriority] = useState('all')

  const filtered = filterPriority === 'all'
    ? ALL_DEALS
    : ALL_DEALS.filter(d => d.priority === filterPriority)

  return (
    <div className="space-y-6 pb-8">
      {/* Metrics */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Valeur totale', value: `€${(totalValue / 1000).toFixed(0)}K` },
          { label: 'Deals actifs', value: ALL_DEALS.length },
          { label: 'Taux conversion', value: `${conversionRate}%` },
          { label: 'Durée moy.', value: `${avgDays}j` },
        ].map((m, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-3 text-center">
            <p className="text-xl font-bold text-kcb-or tabular-nums">{m.value}</p>
            <p className="text-xs text-kcb-pierre mt-0.5">{m.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filter */}
      <div className="flex items-center gap-2">
        <Filter className="w-4 h-4 text-kcb-pierre shrink-0" />
        <span className="text-xs text-kcb-pierre">Priorité :</span>
        {['all', 'high', 'medium', 'low'].map((p) => (
          <button
            key={p}
            onClick={() => setFilterPriority(p)}
            className={`text-xs px-3 py-1 rounded-[4px] border transition ${
              filterPriority === p
                ? 'bg-kcb-or text-kcb-noir border-kcb-or font-semibold'
                : 'border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30'
            }`}
          >
            {p === 'all' ? 'Tous' : p === 'high' ? 'Urgent' : p === 'medium' ? 'Moyen' : 'Faible'}
          </button>
        ))}
      </div>

      {/* Kanban */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {STAGES.map((stage) => {
          const deals = filtered.filter((d) => d.stage === stage)
          const cfg = STAGE_CONFIG[stage]
          const stageTotal = deals.reduce((s, d) => s + d.price, 0)
          return (
            <div key={stage} className="bg-kcb-ardoise rounded-[4px] border border-white/[0.06] p-3 flex flex-col gap-2 min-h-[300px]">
              {/* Column header */}
              <div className={`flex items-center justify-between pb-2 border-b ${cfg.color} border-current/20`}>
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-semibold ${cfg.color.split(' ')[1]}`}>
                    {cfg.label}
                  </span>
                  <span className={`text-xs tabular-nums ${cfg.color.split(' ')[1]}`}>
                    ({deals.length})
                  </span>
                </div>
                <span className={`text-xs font-bold tabular-nums ${cfg.color.split(' ')[1]}`}>
                  {fmt(stageTotal)}
                </span>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2 flex-1">
                {deals.map((deal, i) => (
                  <motion.div
                    key={deal.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <DealCard deal={deal} />
                  </motion.div>
                ))}
                {deals.length === 0 && (
                  <div className="flex-1 flex items-center justify-center text-xs text-kcb-pierre/40 border border-dashed border-white/[0.04] rounded-[4px] py-6">
                    Aucun deal
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </motion.div>
    </div>
  )
}
