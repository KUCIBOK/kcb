import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Plus,
  Calendar,
  AlertCircle,
  CheckCircle,
  ChevronDown,
} from 'lucide-react'

const CURRENCIES = [
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 1 },
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 1.17 },
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1.27 },
  { code: 'XOF', symbol: 'CFA', label: 'XOF CFA', rate: 768 },
]

const BUDGET_LINES = [
  { category: 'Honoraires artistes', allocated: 80000, spent: 18200, pending: 22000, currency: 'GBP', scheduled: 'Acomptes signés: 6 artistes' },
  { category: 'Frais de logistique', allocated: 55000, spent: 14600, pending: 6800, currency: 'GBP', scheduled: 'Devis Hasenkamp en attente' },
  { category: 'Services Concierge', allocated: 25000, spent: 15000, pending: 3500, currency: 'GBP', scheduled: '2 missions en cours' },
  { category: 'Assurance œuvres', allocated: 12000, spent: 0, pending: 340, currency: 'GBP', scheduled: 'Souscription AXA Art' },
  { category: 'Droits douane & taxes', allocated: 8000, spent: 0, pending: 2100, currency: 'GBP', scheduled: 'Estimation' },
  { category: 'Communication & print', allocated: 15000, spent: 0, pending: 0, currency: 'GBP', scheduled: 'Phase 2' },
  { category: 'Réception & vernissage', allocated: 20000, spent: 0, pending: 0, currency: 'GBP', scheduled: 'Sept 2025' },
  { category: 'Contingences (5%)', allocated: 35000, spent: 0, pending: 0, currency: 'GBP', scheduled: 'Réserve' },
]

const PAYMENTS = [
  { date: '12 mai 2025', description: 'Acompte — Aïcha Diallo (Photographie)', amount: 4500, type: 'debit', status: 'paid' },
  { date: '10 mai 2025', description: 'Due diligence — Kofi Mensah (KCB Concierge)', amount: 500, type: 'debit', status: 'paid' },
  { date: '8 mai 2025', description: 'Visite studio virtuelle — Amara Touré', amount: 350, type: 'debit', status: 'paid' },
  { date: '1 mai 2025', description: 'Acompte — Kofi Mensah (Peinture)', amount: 6000, type: 'debit', status: 'paid' },
  { date: '25 avr. 2025', description: 'Honoraires coordination (Aïcha Diallo)', amount: 2200, type: 'debit', status: 'paid' },
  { date: '15 avr. 2025', description: 'Acompte — Yaw Darko (Vidéo)', amount: 2400, type: 'debit', status: 'paid' },
  { date: '20 mai 2025', description: 'Devis logistique Hasenkamp (à valider)', amount: 6800, type: 'debit', status: 'pending' },
  { date: '1 juin 2025', description: 'Assurance AXA Art (à souscrire)', amount: 340, type: 'debit', status: 'pending' },
]

const MILESTONES = [
  { date: '20 mai 2025', label: 'Visite studio Aïcha Diallo', amount: 350, status: 'upcoming' },
  { date: '1 juin 2025', label: 'Signature contrats — 6 artistes confirmés', amount: 24000, status: 'upcoming' },
  { date: '15 juin 2025', label: 'Paiement acompte logistique (50%)', amount: 3400, status: 'future' },
  { date: '1 sept. 2025', label: 'Solde honoraires artistes', amount: 42000, status: 'future' },
  { date: '15 sept. 2025', label: 'Paiement solde logistique (50%)', amount: 3400, status: 'future' },
]

export function BudgetTracker() {
  const [currency, setCurrency] = useState('GBP')
  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]

  const totalBudget = 250000
  const totalSpent = BUDGET_LINES.reduce((s, l) => s + l.spent, 0)
  const totalPending = BUDGET_LINES.reduce((s, l) => s + l.pending, 0)
  const totalAllocated = BUDGET_LINES.reduce((s, l) => s + l.allocated, 0)
  const remaining = totalBudget - totalSpent - totalPending
  const usedPct = Math.round((totalSpent / totalBudget) * 100)
  const pendingPct = Math.round((totalPending / totalBudget) * 100)

  const fmt = (amount) => {
    const converted = amount * cur.rate
    if (cur.code === 'XOF') return `${Math.round(converted).toLocaleString()} CFA`
    return `${cur.symbol}${Math.round(converted).toLocaleString()}`
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-playfair text-xl text-white">Suivi budget</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">New Voices: Contemporary African Art · Tate Modern</p>
        </div>
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="appearance-none bg-kcb-ardoise border border-white/[0.08] text-white text-sm px-4 py-2 pr-8 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 cursor-pointer"
          >
            {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Budget total', value: fmt(totalBudget), icon: DollarSign, color: 'text-white', bg: 'bg-white/[0.06]' },
          { label: 'Dépensé', value: fmt(totalSpent), icon: TrendingDown, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'En attente', value: fmt(totalPending), icon: AlertCircle, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Disponible', value: fmt(remaining), icon: TrendingUp, color: 'text-kcb-or', bg: 'bg-kcb-or/10' },
        ].map((kpi, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-kcb-pierre">{kpi.label}</p>
              <div className={`w-7 h-7 rounded-full flex items-center justify-center ${kpi.bg}`}>
                <kpi.icon className={`w-3.5 h-3.5 ${kpi.color}`} />
              </div>
            </div>
            <p className={`text-xl font-bold font-jetbrains ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </motion.div>

      {/* Budget bar */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-sm font-semibold text-white">Utilisation du budget</h3>
          <span className="text-xs text-kcb-pierre">{usedPct + pendingPct}% engagé</span>
        </div>
        <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden flex mb-2">
          <div
            className="h-full bg-emerald-500 transition-all duration-700"
            style={{ width: `${usedPct}%` }}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-700"
            style={{ width: `${pendingPct}%` }}
          />
        </div>
        <div className="flex gap-4 text-xs text-kcb-pierre">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" /> Dépensé {usedPct}%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> En attente {pendingPct}%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/10" /> Disponible {100 - usedPct - pendingPct}%</span>
        </div>
      </div>

      {/* Budget lines */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06]">
          <h3 className="text-sm font-semibold text-white">Ventilation par poste</h3>
        </div>
        <div className="divide-y divide-white/[0.04]">
          {BUDGET_LINES.map((line, i) => {
            const pctSpent = Math.round((line.spent / line.allocated) * 100)
            const pctPending = Math.round((line.pending / line.allocated) * 100)
            const isOver = (line.spent + line.pending) > line.allocated
            return (
              <div key={i} className="px-5 py-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2 min-w-0">
                    <p className="text-sm text-white truncate">{line.category}</p>
                    {isOver && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <span className="text-sm font-semibold text-white">{fmt(line.spent)}</span>
                    <span className="text-xs text-kcb-pierre"> / {fmt(line.allocated)}</span>
                  </div>
                </div>
                <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden flex mb-1">
                  <div className="h-full bg-emerald-500" style={{ width: `${Math.min(pctSpent, 100)}%` }} />
                  <div className="h-full bg-amber-400" style={{ width: `${Math.min(pctPending, 100 - pctSpent)}%` }} />
                </div>
                {line.pending > 0 && (
                  <p className="text-xs text-amber-300">+ {fmt(line.pending)} en attente · {line.scheduled}</p>
                )}
                {line.pending === 0 && line.scheduled && (
                  <p className="text-xs text-kcb-pierre">{line.scheduled}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Payment schedule */}
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-kcb-or" />
              Échéancier de paiement
            </h3>
            <button className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-bronze transition">
              <Plus className="w-3 h-3" /> Ajouter
            </button>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
            {MILESTONES.map((m, i) => (
              <div key={i} className="flex items-start justify-between px-5 py-3 gap-3">
                <div className="flex items-start gap-2.5">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${m.status === 'upcoming' ? 'bg-kcb-or' : 'bg-white/20'}`} />
                  <div>
                    <p className="text-xs font-medium text-white">{m.label}</p>
                    <p className="text-xs text-kcb-pierre">{m.date}</p>
                  </div>
                </div>
                <span className={`text-xs font-bold flex-shrink-0 ${m.status === 'upcoming' ? 'text-kcb-or' : 'text-kcb-pierre'}`}>
                  {fmt(m.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction history */}
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06]">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-emerald-400" />
              Historique des transactions
            </h3>
          </div>
          <div className="divide-y divide-white/[0.04] max-h-72 overflow-y-auto">
            {PAYMENTS.map((p, i) => (
              <div key={i} className="flex items-start justify-between px-5 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.description}</p>
                  <p className="text-xs text-kcb-pierre">{p.date}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {p.status === 'paid'
                    ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    : <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                  }
                  <span className={`text-sm font-bold font-jetbrains ${p.status === 'paid' ? 'text-white' : 'text-amber-300'}`}>
                    {fmt(p.amount)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
