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
  Trash2,
  ChevronDown,
} from 'lucide-react'
import { PlanGate } from '../shared/PlanGate'
import { PLAN_PREMIUM } from '../../utils/planUtils'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 1 },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 0.86 },
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1.09 },
  { code: 'XOF', symbol: 'CFA', label: 'XOF CFA', rate: 655.96 },
]

const DEFAULT_CATEGORIES = [
  'Honoraires artistes',
  'Logistique & transport',
  'Services Concierge',
  'Assurance œuvres',
  'Droits & taxes',
  'Communication',
  'Réception & vernissage',
  'Contingences',
]

export function BudgetTrackerContent() {
  const [currency, setCurrency] = useState('EUR')
  const [totalBudget, setTotalBudget] = useState('')
  const [budgetSet, setBudgetSet] = useState(false)
  const [lines, setLines] = useState([])
  const [newLine, setNewLine] = useState({ category: DEFAULT_CATEGORIES[0], allocated: '', spent: '', note: '' })
  const [showAdd, setShowAdd] = useState(false)
  const [payments, setPayments] = useState([])
  const [newPayment, setNewPayment] = useState({ description: '', amount: '', date: '' })
  const [showAddPayment, setShowAddPayment] = useState(false)

  const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]

  const fmt = (amount) => {
    const n = Number(amount) || 0
    if (cur.code === 'XOF') return `${Math.round(n).toLocaleString()} CFA`
    return `${cur.symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  const totalAllocated = lines.reduce((s, l) => s + (Number(l.allocated) || 0), 0)
  const totalSpent = lines.reduce((s, l) => s + (Number(l.spent) || 0), 0)
  const budget = Number(totalBudget) || 0
  const remaining = budget - totalSpent
  const usedPct = budget > 0 ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0

  const addLine = () => {
    if (!newLine.allocated) return
    setLines((prev) => [...prev, { ...newLine, id: Date.now() }])
    setNewLine({ category: DEFAULT_CATEGORIES[0], allocated: '', spent: '', note: '' })
    setShowAdd(false)
  }

  const removeLine = (id) => setLines((prev) => prev.filter((l) => l.id !== id))

  const addPayment = () => {
    if (!newPayment.description || !newPayment.amount) return
    setPayments((prev) => [...prev, { ...newPayment, id: Date.now() }])
    setNewPayment({ description: '', amount: '', date: '' })
    setShowAddPayment(false)
  }

  // Setup screen
  if (!budgetSet) {
    return (
      <div className="space-y-6 pb-8">
        <div>
          <h2 className="font-playfair text-xl text-white">Suivi budget</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">Gérez votre budget d'exposition en multi-devises</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-kcb-or/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="w-8 h-8 text-kcb-or" />
            </div>
            <h3 className="font-playfair text-lg text-white mb-2">Configurer votre budget</h3>
            <p className="text-sm text-kcb-pierre mb-6">Renseignez le budget total de votre exposition pour commencer le suivi.</p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Devise principale</label>
                <div className="relative">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 pr-8 rounded-[4px] focus:outline-none focus:border-kcb-or">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Budget total ({cur.symbol})</label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder="Ex : 250000"
                  className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre"
                />
              </div>
              <button
                onClick={() => { if (totalBudget) setBudgetSet(true) }}
                disabled={!totalBudget}
                className="w-full py-2.5 text-sm font-semibold rounded-[4px] transition disabled:opacity-40 disabled:cursor-not-allowed bg-kcb-or text-kcb-noir hover:bg-kcb-bronze"
              >
                Démarrer le suivi
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-playfair text-xl text-white">Suivi budget</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">Budget total : {fmt(budget)}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="appearance-none bg-kcb-ardoise border border-white/[0.08] text-white text-sm px-4 py-2 pr-8 rounded-[4px] focus:outline-none cursor-pointer">
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
          </div>
          <button onClick={() => { setBudgetSet(false); setLines([]); setPayments([]) }} className="text-xs text-kcb-pierre hover:text-white border border-white/[0.06] px-3 py-2 rounded-[4px] transition">
            Réinitialiser
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Budget total', value: fmt(budget), icon: DollarSign, color: 'text-white' },
          { label: 'Dépensé', value: fmt(totalSpent), icon: TrendingDown, color: 'text-emerald-400' },
          { label: 'Alloué (postes)', value: fmt(totalAllocated), icon: TrendingUp, color: 'text-[#9B4D96]' },
          { label: 'Disponible', value: fmt(remaining), icon: AlertCircle, color: remaining < 0 ? 'text-red-400' : 'text-kcb-or' },
        ].map((kpi, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-kcb-pierre">{kpi.label}</p>
              <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
            </div>
            <p className={`text-xl font-bold font-jetbrains ${kpi.color}`}>{kpi.value}</p>
          </div>
        ))}
      </div>

      {/* Budget bar */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
        <div className="flex justify-between items-baseline mb-3">
          <h3 className="text-sm font-semibold text-white">Utilisation du budget</h3>
          <span className="text-xs text-kcb-pierre">{usedPct}% utilisé</span>
        </div>
        <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${usedPct}%`, background: usedPct > 90 ? '#ef4444' : 'linear-gradient(90deg, #9B4D96, #C9A84C)' }} />
        </div>
        <div className="flex gap-4 text-xs text-kcb-pierre">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-kcb-or" /> Dépensé {usedPct}%</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/10" /> Disponible {100 - usedPct}%</span>
        </div>
      </div>

      {/* Budget lines */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">Postes budgétaires</h3>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-bronze transition">
            <Plus className="w-3.5 h-3.5" /> Ajouter un poste
          </button>
        </div>

        {showAdd && (
          <div className="px-5 py-4 border-b border-white/[0.06] bg-kcb-noir/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <select value={newLine.category} onChange={(e) => setNewLine((p) => ({ ...p, category: e.target.value }))} className="w-full appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 pr-7 rounded-[4px] focus:outline-none">
                  {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-kcb-pierre pointer-events-none" />
              </div>
              <input type="number" placeholder={`Alloué (${cur.symbol})`} value={newLine.allocated} onChange={(e) => setNewLine((p) => ({ ...p, allocated: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              <input type="number" placeholder={`Dépensé (${cur.symbol})`} value={newLine.spent} onChange={(e) => setNewLine((p) => ({ ...p, spent: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
            </div>
            <div className="flex gap-2">
              <button onClick={addLine} className="px-4 py-1.5 bg-kcb-or text-kcb-noir text-xs font-semibold rounded-[4px] hover:bg-kcb-bronze transition">Ajouter</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 text-kcb-pierre text-xs border border-white/[0.06] rounded-[4px] hover:text-white transition">Annuler</button>
            </div>
          </div>
        )}

        {lines.length === 0 ? (
          <div className="px-5 py-10 text-center text-kcb-pierre text-sm">
            Aucun poste. Ajoutez votre premier poste budgétaire.
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {lines.map((line) => {
              const alloc = Number(line.allocated) || 0
              const spent = Number(line.spent) || 0
              const pct = alloc > 0 ? Math.min(100, Math.round((spent / alloc) * 100)) : 0
              return (
                <div key={line.id} className="px-5 py-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <p className="text-sm text-white truncate">{line.category}</p>
                      {spent > alloc && <AlertCircle className="w-3.5 h-3.5 text-red-400 flex-shrink-0" />}
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0 ml-4">
                      <div className="text-right">
                        <span className="text-sm font-semibold text-white">{fmt(spent)}</span>
                        <span className="text-xs text-kcb-pierre"> / {fmt(alloc)}</span>
                      </div>
                      <button onClick={() => removeLine(line.id)} className="text-kcb-pierre hover:text-red-400 transition p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </div>
                  <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : '#C9A84C' }} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Transactions */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-kcb-or" />Transactions</h3>
          <button onClick={() => setShowAddPayment(!showAddPayment)} className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-bronze transition">
            <Plus className="w-3.5 h-3.5" /> Ajouter
          </button>
        </div>

        {showAddPayment && (
          <div className="px-5 py-4 border-b border-white/[0.06] bg-kcb-noir/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder="Description" value={newPayment.description} onChange={(e) => setNewPayment((p) => ({ ...p, description: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              <input type="number" placeholder={`Montant (${cur.symbol})`} value={newPayment.amount} onChange={(e) => setNewPayment((p) => ({ ...p, amount: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              <input type="date" value={newPayment.date} onChange={(e) => setNewPayment((p) => ({ ...p, date: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={addPayment} className="px-4 py-1.5 bg-kcb-or text-kcb-noir text-xs font-semibold rounded-[4px] hover:bg-kcb-bronze transition">Ajouter</button>
              <button onClick={() => setShowAddPayment(false)} className="px-4 py-1.5 text-kcb-pierre text-xs border border-white/[0.06] rounded-[4px] hover:text-white transition">Annuler</button>
            </div>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="px-5 py-10 text-center text-kcb-pierre text-sm">Aucune transaction enregistrée.</div>
        ) : (
          <div className="divide-y divide-white/[0.04] max-h-64 overflow-y-auto">
            {payments.map((p) => (
              <div key={p.id} className="flex items-center justify-between px-5 py-3 gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-white truncate">{p.description}</p>
                  <p className="text-xs text-kcb-pierre">{p.date || '—'}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-sm font-bold text-white font-jetbrains">{fmt(p.amount)}</span>
                  <button onClick={() => setPayments((prev) => prev.filter((x) => x.id !== p.id))} className="text-kcb-pierre hover:text-red-400 transition p-1"><Trash2 className="w-3 h-3" /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}


export function BudgetTracker() {
  return (
    <PlanGate
      minLevel={PLAN_PREMIUM}
      feature="Suivi Budget"
      description="Gérez vos budgets d'acquisition projet par projet, ajoutez des lignes de dépenses et suivez vos transactions — inclus dans le plan Premium."
    >
      <BudgetTrackerContent />
    </PlanGate>
  )
}
