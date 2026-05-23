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
import { useT } from '../../i18n'
import { curatorT } from '../../i18n/curator'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 1 },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 0.86 },
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1.09 },
  { code: 'XOF', symbol: 'CFA', label: 'XOF CFA', rate: 655.96 },
]

export function BudgetTrackerContent() {
  const t = useT(curatorT).budgetTracker
  const [currency, setCurrency] = useState('EUR')
  const [totalBudget, setTotalBudget] = useState('')
  const [budgetSet, setBudgetSet] = useState(false)
  const [lines, setLines] = useState([])
  const [newLine, setNewLine] = useState({ category: t.categories[0], allocated: '', spent: '', note: '' })
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
    setNewLine({ category: t.categories[0], allocated: '', spent: '', note: '' })
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
          <h2 className="font-playfair text-xl text-white">{t.pageTitle}</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">{t.pageSubtitle}</p>
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
            <h3 className="font-playfair text-lg text-white mb-2">{t.setupTitle}</h3>
            <p className="text-sm text-kcb-pierre mb-6">{t.setupDesc}</p>

            <div className="space-y-4 text-left">
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">{t.currencyLabel}</label>
                <div className="relative">
                  <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 pr-8 rounded-[4px] focus:outline-none focus:border-kcb-or">
                    {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">{t.budgetTotalLabel(cur.symbol)}</label>
                <input
                  type="number"
                  value={totalBudget}
                  onChange={(e) => setTotalBudget(e.target.value)}
                  placeholder={t.budgetPlaceholder}
                  className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre"
                />
              </div>
              <button
                onClick={() => { if (totalBudget) setBudgetSet(true) }}
                disabled={!totalBudget}
                className="w-full py-2.5 text-sm font-semibold rounded-[4px] transition disabled:opacity-40 disabled:cursor-not-allowed bg-kcb-or text-kcb-noir hover:bg-kcb-bronze"
              >
                {t.startTracking}
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
          <h2 className="font-playfair text-xl text-white">{t.pageTitle}</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">{t.budgetTotalSubtitle(fmt(budget))}</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="appearance-none bg-kcb-ardoise border border-white/[0.08] text-white text-sm px-4 py-2 pr-8 rounded-[4px] focus:outline-none cursor-pointer">
              {CURRENCIES.map((c) => <option key={c.code} value={c.code}>{c.label}</option>)}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
          </div>
          <button onClick={() => { setBudgetSet(false); setLines([]); setPayments([]) }} className="text-xs text-kcb-pierre hover:text-white border border-white/[0.06] px-3 py-2 rounded-[4px] transition">
            {t.resetBtn}
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: t.kpiBudgetTotal, value: fmt(budget), icon: DollarSign, color: 'text-white' },
          { label: t.kpiSpent, value: fmt(totalSpent), icon: TrendingDown, color: 'text-emerald-400' },
          { label: t.kpiAllocated, value: fmt(totalAllocated), icon: TrendingUp, color: 'text-[#9B4D96]' },
          { label: t.kpiAvailable, value: fmt(remaining), icon: AlertCircle, color: remaining < 0 ? 'text-red-400' : 'text-kcb-or' },
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
          <h3 className="text-sm font-semibold text-white">{t.usageTitle}</h3>
          <span className="text-xs text-kcb-pierre">{t.usagePct(usedPct)}</span>
        </div>
        <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden mb-2">
          <div className="h-full rounded-full transition-all duration-700" style={{ width: `${usedPct}%`, background: usedPct > 90 ? '#ef4444' : 'linear-gradient(90deg, #9B4D96, #C9A84C)' }} />
        </div>
        <div className="flex gap-4 text-xs text-kcb-pierre">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-kcb-or" /> {t.legendSpent(usedPct)}</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-white/10" /> {t.legendAvailable(100 - usedPct)}</span>
        </div>
      </div>

      {/* Budget lines */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white">{t.budgetLinesTitle}</h3>
          <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-bronze transition">
            <Plus className="w-3.5 h-3.5" /> {t.addLineBtn}
          </button>
        </div>

        {showAdd && (
          <div className="px-5 py-4 border-b border-white/[0.06] bg-kcb-noir/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <select value={newLine.category} onChange={(e) => setNewLine((p) => ({ ...p, category: e.target.value }))} className="w-full appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 pr-7 rounded-[4px] focus:outline-none">
                  {t.categories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-kcb-pierre pointer-events-none" />
              </div>
              <input type="number" placeholder={t.allocatedPlaceholder(cur.symbol)} value={newLine.allocated} onChange={(e) => setNewLine((p) => ({ ...p, allocated: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              <input type="number" placeholder={t.spentPlaceholder(cur.symbol)} value={newLine.spent} onChange={(e) => setNewLine((p) => ({ ...p, spent: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
            </div>
            <div className="flex gap-2">
              <button onClick={addLine} className="px-4 py-1.5 bg-kcb-or text-kcb-noir text-xs font-semibold rounded-[4px] hover:bg-kcb-bronze transition">{t.addBtn}</button>
              <button onClick={() => setShowAdd(false)} className="px-4 py-1.5 text-kcb-pierre text-xs border border-white/[0.06] rounded-[4px] hover:text-white transition">{t.cancelBtn}</button>
            </div>
          </div>
        )}

        {lines.length === 0 ? (
          <div className="px-5 py-10 text-center text-kcb-pierre text-sm">
            {t.noLines}
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
          <h3 className="text-sm font-semibold text-white flex items-center gap-2"><Calendar className="w-4 h-4 text-kcb-or" />{t.transactionsTitle}</h3>
          <button onClick={() => setShowAddPayment(!showAddPayment)} className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-bronze transition">
            <Plus className="w-3.5 h-3.5" /> {t.addTransactionBtn}
          </button>
        </div>

        {showAddPayment && (
          <div className="px-5 py-4 border-b border-white/[0.06] bg-kcb-noir/20 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input type="text" placeholder={t.descriptionPlaceholder} value={newPayment.description} onChange={(e) => setNewPayment((p) => ({ ...p, description: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              <input type="number" placeholder={t.amountPlaceholder(cur.symbol)} value={newPayment.amount} onChange={(e) => setNewPayment((p) => ({ ...p, amount: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              <input type="date" value={newPayment.date} onChange={(e) => setNewPayment((p) => ({ ...p, date: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none" />
            </div>
            <div className="flex gap-2">
              <button onClick={addPayment} className="px-4 py-1.5 bg-kcb-or text-kcb-noir text-xs font-semibold rounded-[4px] hover:bg-kcb-bronze transition">{t.addBtn}</button>
              <button onClick={() => setShowAddPayment(false)} className="px-4 py-1.5 text-kcb-pierre text-xs border border-white/[0.06] rounded-[4px] hover:text-white transition">{t.cancelBtn}</button>
            </div>
          </div>
        )}

        {payments.length === 0 ? (
          <div className="px-5 py-10 text-center text-kcb-pierre text-sm">{t.noTransactions}</div>
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
  const t = useT(curatorT).budgetTracker
  return (
    <PlanGate
      minLevel={PLAN_PREMIUM}
      feature={t.planFeature}
      description={t.planDesc}
    >
      <BudgetTrackerContent />
    </PlanGate>
  )
}
