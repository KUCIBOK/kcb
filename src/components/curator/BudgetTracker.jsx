/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect } from 'react'
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
  ArrowLeft,
  Loader,
} from 'lucide-react'
import { PlanGate } from '../shared/PlanGate'
import { PLAN_PREMIUM } from '../../utils/planUtils'
import { useT } from '../../i18n'
import { curatorT } from '../../i18n/curator'
import {
  useCreateBudget,
  useGetBudgets,
  useGetBudget,
  useUpdateBudget,
  useDeleteBudget,
  useAddBudgetLine,
  useUpdateBudgetLine,
  useDeleteBudgetLine,
  useAddBudgetTransaction,
} from '../../api/useBudget'

const CURRENCIES = [
  { code: 'EUR', symbol: '€', label: 'EUR €', rate: 1 },
  { code: 'GBP', symbol: '£', label: 'GBP £', rate: 0.86 },
  { code: 'USD', symbol: '$', label: 'USD $', rate: 1.09 },
  { code: 'XOF', symbol: 'CFA', label: 'XOF CFA', rate: 655.96 },
]

export function BudgetTrackerContent() {
  const t = useT(curatorT).budgetTracker

  // State
  const [budgets, setBudgets] = useState([])
  const [activeBudgetId, setActiveBudgetId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newBudgetMode, setNewBudgetMode] = useState(false)

  // New budget creation
  const [totalBudget, setTotalBudget] = useState('')
  const [currency, setCurrency] = useState('EUR')

  // New line/transaction
  const [showAddLine, setShowAddLine] = useState(false)
  const [newLine, setNewLine] = useState({ category: t.categories[0], allocated: '', notes: '' })
  const [showAddTransaction, setShowAddTransaction] = useState(false)
  const [newTransaction, setNewTransaction] = useState({ description: '', amount: '', date: '' })

  // Load budgets on mount
  useEffect(() => {
    loadBudgets()
  }, [])

  const loadBudgets = async () => {
    setLoading(true)
    const result = await useGetBudgets({ status: 'active' })
    if (result.error) {
      setError(result.error)
    } else {
      setBudgets(result || [])
      // Auto-select first budget
      if (result?.length > 0) {
        setActiveBudgetId(result[0].id)
      }
    }
    setLoading(false)
  }

  const createNewBudget = async () => {
    if (!totalBudget || totalBudget <= 0) {
      setError('Budget total must be > 0')
      return
    }

    setLoading(true)
    const result = await useCreateBudget({
      totalAmount: totalBudget,
      currency,
      lines: [],
    })

    if (result.error) {
      setError(result.error)
    } else {
      setTotalBudget('')
      setNewBudgetMode(false)
      await loadBudgets()
    }
    setLoading(false)
  }

  const deleteActiveBudget = async () => {
    if (!activeBudgetId || !confirm('Delete this budget and all its data?')) return

    setLoading(true)
    const result = await useDeleteBudget(activeBudgetId)
    if (result.error) {
      setError(result.error)
    } else {
      await loadBudgets()
      setActiveBudgetId(null)
    }
    setLoading(false)
  }

  const addBudgetLine = async () => {
    if (!activeBudgetId || !newLine.category || newLine.allocated <= 0) return

    setLoading(true)
    const result = await useAddBudgetLine(activeBudgetId, newLine)
    if (result.error) {
      setError(result.error)
    } else {
      setNewLine({ category: t.categories[0], allocated: '', notes: '' })
      setShowAddLine(false)
      await loadBudgets()
    }
    setLoading(false)
  }

  const deleteBudgetLine = async (lineId) => {
    if (!activeBudgetId || !confirm('Delete this line?')) return

    setLoading(true)
    const result = await useDeleteBudgetLine(activeBudgetId, lineId)
    if (result.error) {
      setError(result.error)
    } else {
      await loadBudgets()
    }
    setLoading(false)
  }

  const addTransaction = async () => {
    if (!activeBudgetId || !newTransaction.description || newTransaction.amount <= 0) return

    setLoading(true)
    const result = await useAddBudgetTransaction(activeBudgetId, newTransaction)
    if (result.error) {
      setError(result.error)
    } else {
      setNewTransaction({ description: '', amount: '', date: '' })
      setShowAddTransaction(false)
      await loadBudgets()
    }
    setLoading(false)
  }

  // Format helper
  const formatCurrency = (amount, curr = currency) => {
    const c = CURRENCIES.find((x) => x.code === curr) ?? CURRENCIES[0]
    const n = Number(amount) || 0
    if (c.code === 'XOF') return `${Math.round(n).toLocaleString()} CFA`
    return `${c.symbol}${n.toLocaleString(undefined, { maximumFractionDigits: 0 })}`
  }

  // Get active budget
  const activeBudget = activeBudgetId ? budgets.find((b) => b.id === activeBudgetId) : null
  const totalSpent = activeBudget ? (activeBudget.budget_lines?.reduce((s, l) => s + (Number(l.spent) || 0), 0) || 0) : 0
  const totalAllocated = activeBudget ? (activeBudget.budget_lines?.reduce((s, l) => s + (Number(l.allocated) || 0), 0) || 0) : 0
  const remaining = activeBudget ? Number(activeBudget.total_amount) - totalSpent : 0
  const usedPct = activeBudget && activeBudget.total_amount > 0 ? Math.min(100, Math.round((totalSpent / activeBudget.total_amount) * 100)) : 0

  // Loading screen
  if (loading && !activeBudget && budgets.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Loader className="w-6 h-6 animate-spin text-kcb-or" />
      </div>
    )
  }

  // New budget screen
  if (newBudgetMode) {
    const cur = CURRENCIES.find((c) => c.code === currency) ?? CURRENCIES[0]
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <button onClick={() => setNewBudgetMode(false)} className="p-1.5 hover:bg-white/[0.06] rounded-[4px] transition">
            <ArrowLeft className="w-4 h-4 text-kcb-pierre" />
          </button>
          <div>
            <h2 className="font-playfair text-xl text-white">Create Budget</h2>
            <p className="text-sm text-kcb-pierre mt-0.5">Set up your new budget allocation</p>
          </div>
        </div>

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
          <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-8 space-y-6">
            <div>
              <label className="text-xs text-kcb-pierre block mb-2">{t.currencyLabel}</label>
              <div className="relative">
                <select value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 pr-8 rounded-[4px] focus:outline-none focus:border-kcb-or">
                  {CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
              </div>
            </div>

            <div>
              <label className="text-xs text-kcb-pierre block mb-2">{t.budgetTotalLabel(cur.symbol)}</label>
              <input
                type="number"
                value={totalBudget}
                onChange={(e) => setTotalBudget(e.target.value)}
                placeholder={t.budgetPlaceholder}
                className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre"
              />
            </div>

            {error && <div className="text-xs text-red-400 bg-red-400/10 p-3 rounded-[4px]">{error}</div>}

            <div className="flex gap-2 pt-2">
              <button
                onClick={createNewBudget}
                disabled={!totalBudget || loading}
                className="flex-1 py-2.5 text-sm font-semibold rounded-[4px] transition disabled:opacity-40 disabled:cursor-not-allowed bg-kcb-or text-kcb-noir hover:bg-kcb-bronze"
              >
                {loading ? <Loader className="w-4 h-4 animate-spin mx-auto" /> : t.startTracking}
              </button>
              <button
                onClick={() => setNewBudgetMode(false)}
                className="flex-1 py-2.5 text-sm font-semibold border border-white/[0.06] text-kcb-pierre hover:text-white transition rounded-[4px]"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // Budget list / active budget view
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-playfair text-xl text-white">{t.pageTitle}</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">
            {activeBudget ? `${formatCurrency(activeBudget.total_amount, activeBudget.currency)} budget` : 'No active budget'}
          </p>
        </div>
        <button
          onClick={() => setNewBudgetMode(true)}
          className="flex items-center gap-2 text-xs font-semibold px-4 py-2 bg-kcb-or text-kcb-noir rounded-[4px] hover:bg-kcb-bronze transition"
        >
          <Plus className="w-4 h-4" /> New Budget
        </button>
      </div>

      {error && <div className="text-xs text-red-400 bg-red-400/10 p-4 rounded-[4px]">{error}</div>}

      {/* Budgets list sidebar */}
      {budgets.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-1 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
            <div className="px-4 py-3 border-b border-white/[0.06]">
              <h3 className="text-sm font-semibold text-white">Budgets</h3>
            </div>
            <div className="divide-y divide-white/[0.04] max-h-96 overflow-y-auto">
              {budgets.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBudgetId(b.id)}
                  className={`w-full text-left px-4 py-3 transition ${
                    activeBudgetId === b.id ? 'bg-kcb-or/20 border-l-2 border-kcb-or' : 'hover:bg-kcb-noir/50'
                  }`}
                >
                  <p className="text-xs text-kcb-pierre mb-1">{b.currency}</p>
                  <p className="text-sm font-semibold text-white">{formatCurrency(b.total_amount, b.currency)}</p>
                  <p className="text-xs text-kcb-pierre/60 mt-1">Created {new Date(b.created_at).toLocaleDateString()}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Active budget details */}
          {activeBudget && (
            <div className="sm:col-span-2 space-y-4">
              {/* KPIs */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
                  <p className="text-xs text-kcb-pierre mb-1">{t.kpiBudgetTotal}</p>
                  <p className="text-lg font-bold text-white">{formatCurrency(activeBudget.total_amount, activeBudget.currency)}</p>
                </div>
                <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
                  <p className="text-xs text-kcb-pierre mb-1">{t.kpiSpent}</p>
                  <p className="text-lg font-bold text-emerald-400">{formatCurrency(totalSpent, activeBudget.currency)}</p>
                </div>
                <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
                  <p className="text-xs text-kcb-pierre mb-1">{t.kpiAllocated}</p>
                  <p className="text-lg font-bold text-[#9B4D96]">{formatCurrency(totalAllocated, activeBudget.currency)}</p>
                </div>
                <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
                  <p className="text-xs text-kcb-pierre mb-1">{t.kpiAvailable}</p>
                  <p className={`text-lg font-bold ${remaining < 0 ? 'text-red-400' : 'text-kcb-or'}`}>{formatCurrency(remaining, activeBudget.currency)}</p>
                </div>
              </div>

              {/* Budget bar */}
              <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
                <div className="flex justify-between items-baseline mb-2">
                  <h3 className="text-sm font-semibold text-white">{t.usageTitle}</h3>
                  <span className="text-xs text-kcb-pierre">{usedPct}%</span>
                </div>
                <div className="h-3 bg-white/[0.06] rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{ width: `${usedPct}%`, background: usedPct > 90 ? '#ef4444' : 'linear-gradient(90deg, #9B4D96, #C9A84C)' }} />
                </div>
              </div>

              {/* Delete button */}
              <button onClick={deleteActiveBudget} className="w-full text-xs text-red-400 border border-red-400/30 px-3 py-2 rounded-[4px] hover:border-red-400 transition">
                Delete Budget
              </button>
            </div>
          )}
        </div>
      )}

      {/* Budget lines section */}
      {activeBudget && (
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
          <div className="px-5 py-4 border-b border-white/[0.06] flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">{t.budgetLinesTitle}</h3>
            <button onClick={() => setShowAddLine(!showAddLine)} className="flex items-center gap-1 text-xs text-kcb-or hover:text-kcb-bronze transition">
              <Plus className="w-3.5 h-3.5" /> {t.addLineBtn}
            </button>
          </div>

          {showAddLine && (
            <div className="px-5 py-4 border-b border-white/[0.06] bg-kcb-noir/20 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="relative">
                  <select value={newLine.category} onChange={(e) => setNewLine((p) => ({ ...p, category: e.target.value }))} className="w-full appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 pr-7 rounded-[4px] focus:outline-none">
                    {t.categories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-kcb-pierre pointer-events-none" />
                </div>
                <input type="number" placeholder={`Allocated (${activeBudget.currency})`} value={newLine.allocated} onChange={(e) => setNewLine((p) => ({ ...p, allocated: e.target.value }))} className="bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none placeholder-kcb-pierre" />
              </div>
              <div className="flex gap-2">
                <button onClick={addBudgetLine} disabled={loading} className="px-4 py-1.5 bg-kcb-or text-kcb-noir text-xs font-semibold rounded-[4px] hover:bg-kcb-bronze transition disabled:opacity-40">
                  {loading ? <Loader className="w-3 h-3 animate-spin" /> : t.addBtn}
                </button>
                <button onClick={() => setShowAddLine(false)} className="px-4 py-1.5 text-kcb-pierre text-xs border border-white/[0.06] rounded-[4px] hover:text-white transition">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {(activeBudget.budget_lines?.length || 0) === 0 ? (
            <div className="px-5 py-10 text-center text-kcb-pierre text-sm">{t.noLines}</div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {activeBudget.budget_lines?.map((line) => {
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
                          <span className="text-sm font-semibold text-white">{formatCurrency(spent, activeBudget.currency)}</span>
                          <span className="text-xs text-kcb-pierre"> / {formatCurrency(alloc, activeBudget.currency)}</span>
                        </div>
                        <button onClick={() => deleteBudgetLine(line.id)} disabled={loading} className="text-kcb-pierre hover:text-red-400 transition p-1 disabled:opacity-40">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
      )}
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
