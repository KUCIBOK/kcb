import { useEffect, useState } from 'react'
import { getAllSubscriptions } from '../../api/useSubscriptions'
import {
  Loader2,
  Users,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Filter,
  TrendingUp,
} from 'lucide-react'

const STATUS_CFG = {
  active:    { label: 'Actif',    cls: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25' },
  expired:   { label: 'Expiré',  cls: 'bg-red-500/15 text-red-300 border-red-500/25' },
  cancelled: { label: 'Annulé',  cls: 'bg-white/[0.06] text-kcb-pierre border-white/[0.1]' },
}

const PLAN_LEVEL_DOT = {
  0:   'bg-kcb-pierre',
  27:  'bg-[#9B4D96]',
  67:  'bg-kcb-or',
  147: 'bg-emerald-400',
}

function fmt(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('fr-FR')
}

function planDot(price) {
  if (price >= 147) return PLAN_LEVEL_DOT[147]
  if (price >= 67) return PLAN_LEVEL_DOT[67]
  if (price >= 27) return PLAN_LEVEL_DOT[27]
  return PLAN_LEVEL_DOT[0]
}

export function SubscriptionTab() {
  const [all, setAll] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterRole, setFilterRole] = useState('all')

  useEffect(() => {
    getAllSubscriptions()
      .then((res) => {
        if (Array.isArray(res)) setAll(res)
        else setError(res?.error ?? 'Erreur de chargement')
      })
      .catch(() => setError('Erreur de chargement'))
      .finally(() => setLoading(false))
  }, [])

  const filtered = all.filter((s) => {
    const q = search.toLowerCase()
    const matchSearch =
      !q ||
      s.users?.name?.toLowerCase().includes(q) ||
      s.users?.email?.toLowerCase().includes(q) ||
      s.plans?.name?.toLowerCase().includes(q)
    const matchStatus = filterStatus === 'all' || s.status === filterStatus
    const matchRole = filterRole === 'all' || s.plans?.role === filterRole
    return matchSearch && matchStatus && matchRole
  })

  const stats = {
    active:    all.filter((s) => s.status === 'active').length,
    expired:   all.filter((s) => s.status === 'expired').length,
    cancelled: all.filter((s) => s.status === 'cancelled').length,
    mrr: all
      .filter((s) => s.status === 'active' && s.currency === 'EUR')
      .reduce((sum, s) => sum + (s.amount ?? 0), 0),
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Actifs', value: stats.active, icon: CheckCircle, color: 'text-emerald-400' },
          { label: 'Expirés', value: stats.expired, icon: Clock, color: 'text-red-400' },
          { label: 'Annulés', value: stats.cancelled, icon: XCircle, color: 'text-kcb-pierre' },
          { label: 'MRR (EUR)', value: stats.mrr > 0 ? `€${stats.mrr.toLocaleString('fr-FR')}` : '—', icon: TrendingUp, color: 'text-kcb-or' },
        ].map((k, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white/[0.04] flex items-center justify-center flex-shrink-0">
              <k.icon className={`w-4 h-4 ${k.color}`} />
            </div>
            <div>
              <p className={`text-xl font-bold ${k.color}`}>{k.value}</p>
              <p className="text-xs text-kcb-pierre leading-tight">{k.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, email, plan…"
              className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm pl-9 pr-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre"
            />
          </div>

          {/* Status filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-kcb-pierre" />
            {['all', 'active', 'expired', 'cancelled'].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`text-xs px-3 py-1.5 rounded-[4px] border transition ${
                  filterStatus === s
                    ? 'bg-kcb-or text-kcb-noir border-kcb-or font-semibold'
                    : 'border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30 hover:text-white'
                }`}
              >
                {s === 'all' ? 'Tous' : STATUS_CFG[s]?.label ?? s}
              </button>
            ))}
          </div>

          {/* Role filter */}
          <div className="flex items-center gap-1">
            {['all', 'buyer', 'curator'].map((r) => (
              <button
                key={r}
                onClick={() => setFilterRole(r)}
                className={`text-xs px-3 py-1.5 rounded-[4px] border transition ${
                  filterRole === r
                    ? 'bg-[#9B4D96]/30 text-[#c084d8] border-[#9B4D96]/40 font-semibold'
                    : 'border-white/[0.08] text-kcb-pierre hover:border-[#9B4D96]/30 hover:text-white'
                }`}
              >
                {r === 'all' ? 'Tous rôles' : r === 'buyer' ? 'Acheteur' : 'Curateur'}
              </button>
            ))}
          </div>

          <span className="ml-auto text-xs text-kcb-pierre">
            {filtered.length} résultat{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Table */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin text-kcb-or" />
          </div>
        ) : error ? (
          <div className="p-6 text-red-300 text-sm">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <Users className="h-10 w-10 mx-auto mb-3 text-kcb-pierre/40" />
            <p className="text-kcb-pierre text-sm">Aucun abonnement trouvé</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  {['Utilisateur', 'Plan', 'Rôle', 'Statut', 'Montant', 'Début', 'Fin'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-kcb-pierre font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.03]">
                {filtered.map((item, i) => {
                  const statusCfg = STATUS_CFG[item.status] ?? { label: item.status, cls: 'bg-white/[0.06] text-kcb-pierre border-white/[0.1]' }
                  return (
                    <tr key={item.id ?? i} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-4">
                        <p className="font-medium text-white">{item.users?.name ?? '—'}</p>
                        {item.users?.email && (
                          <p className="text-kcb-pierre mt-0.5 truncate max-w-[180px]">{item.users.email}</p>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${planDot(item.plans?.price ?? 0)}`} />
                          <span className="text-kcb-sable">{item.plans?.name ?? '—'}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-kcb-pierre capitalize">{item.plans?.role ?? '—'}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-xs border ${statusCfg.cls}`}>
                          {statusCfg.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-medium text-white">
                        {item.amount != null ? `${item.amount?.toLocaleString('fr-FR')} ${item.currency ?? ''}` : '—'}
                      </td>
                      <td className="py-3 px-4 text-kcb-pierre">{fmt(item.start_date)}</td>
                      <td className="py-3 px-4 text-kcb-pierre">{fmt(item.end_date)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
