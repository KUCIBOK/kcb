import { useState } from 'react'
import { motion } from 'framer-motion'
import { Users, Search, ArrowUp, ArrowDown, Filter, ChevronRight } from 'lucide-react'
import { useT } from '../../i18n'
import { advisorT } from '../../i18n/advisor'

const MOCK_CLIENTS = [
  {
    id: 1,
    name: 'Marie Dubois',
    initials: 'MD',
    aum: 450000,
    ytd: 15.2,
    artworks: 12,
    lastContact: '2026-05-10',
    nextReview: '2026-06-15',
    status: 'active',
    country: 'France',
  },
  {
    id: 2,
    name: 'John Smith',
    initials: 'JS',
    aum: 680000,
    ytd: 8.4,
    artworks: 18,
    lastContact: '2026-05-08',
    nextReview: '2026-06-20',
    status: 'active',
    country: 'USA',
  },
  {
    id: 3,
    name: 'Fondation Lumière',
    initials: 'FL',
    aum: 1200000,
    ytd: 18.1,
    artworks: 35,
    lastContact: '2026-05-12',
    nextReview: '2026-07-01',
    status: 'active',
    country: 'Suisse',
  },
  {
    id: 4,
    name: 'Ahmed Al-Rashid',
    initials: 'AA',
    aum: 320000,
    ytd: 5.7,
    artworks: 8,
    lastContact: '2026-04-28',
    nextReview: '2026-06-10',
    status: 'active',
    country: 'UAE',
  },
  {
    id: 5,
    name: 'Sophie Laurent',
    initials: 'SL',
    aum: 195000,
    ytd: 22.3,
    artworks: 6,
    lastContact: '2026-05-14',
    nextReview: '2026-06-05',
    status: 'active',
    country: 'Belgique',
  },
  {
    id: 6,
    name: 'Marcus Weber',
    initials: 'MW',
    aum: 540000,
    ytd: -2.1,
    artworks: 14,
    lastContact: '2026-04-15',
    nextReview: '2026-05-30',
    status: 'review',
    country: 'Allemagne',
  },
  {
    id: 7,
    name: 'Chioma Okafor',
    initials: 'CO',
    aum: 280000,
    ytd: 11.8,
    artworks: 9,
    lastContact: '2026-05-01',
    nextReview: '2026-06-25',
    status: 'active',
    country: 'Nigeria',
  },
  {
    id: 8,
    name: 'Elena Petrov',
    initials: 'EP',
    aum: 165000,
    ytd: 6.2,
    artworks: 5,
    lastContact: '2026-04-22',
    nextReview: '2026-06-12',
    status: 'inactive',
    country: 'France',
  },
]

function fmt(n) {
  if (n >= 1000000) return `€${(n / 1000000).toFixed(1)}M`
  if (n >= 1000) return `€${(n / 1000).toFixed(0)}K`
  return `€${n}`
}

const totalAUM = MOCK_CLIENTS.reduce((s, c) => s + c.aum, 0)
const avgPortfolio = totalAUM / MOCK_CLIENTS.length
const avgYTD = (MOCK_CLIENTS.reduce((s, c) => s + c.ytd, 0) / MOCK_CLIENTS.length).toFixed(1)

export function AdvisorClients() {
  const t = useT(advisorT).clients
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const filtered = MOCK_CLIENTS.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.country.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || c.status === filterStatus
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6 pb-8">
      {/* Stats bar */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: t.statTotalClients, value: MOCK_CLIENTS.length },
          { label: t.statAumTotal, value: fmt(totalAUM) },
          { label: t.statAvgPortfolio, value: fmt(avgPortfolio) },
          { label: t.statAvgYtd, value: `+${avgYTD}%` },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-3 text-center"
          >
            <p className="text-xl font-bold text-kcb-or tabular-nums">{s.value}</p>
            <p className="text-xs text-kcb-pierre mt-0.5">{s.label}</p>
          </div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-kcb-pierre" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-kcb-ardoise border border-white/[0.08] rounded-[4px] text-white text-sm placeholder-kcb-pierre focus:outline-none focus:border-kcb-or transition"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-kcb-pierre shrink-0" />
          {['all', 'active', 'review', 'inactive'].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`text-xs px-3 py-1.5 rounded-[4px] border transition ${
                filterStatus === s
                  ? 'bg-kcb-or text-kcb-noir border-kcb-or font-semibold'
                  : 'border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30'
              }`}
            >
              {s === 'all'
                ? t.filterAll
                : s === 'active'
                  ? t.filterActive
                  : s === 'review'
                    ? t.filterReview
                    : t.filterInactive}
            </button>
          ))}
        </div>
      </div>

      {/* Client grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((client, i) => (
          <motion.div
            key={client.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 hover:border-kcb-or/20 transition group"
          >
            {/* Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-kcb-or/10 border border-kcb-or/20 flex items-center justify-center shrink-0">
                <span className="text-sm font-bold text-kcb-or">{client.initials}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">{client.name}</p>
                <p className="text-xs text-kcb-pierre">{client.country}</p>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-[4px] font-medium shrink-0 ${
                  client.status === 'active'
                    ? 'bg-kcb-or/10 text-kcb-or'
                    : client.status === 'review'
                      ? 'bg-kcb-bronze/20 text-kcb-bronze'
                      : 'bg-white/[0.05] text-kcb-pierre'
                }`}
              >
                {client.status === 'active'
                  ? t.statusActive
                  : client.status === 'review'
                    ? t.statusReview
                    : t.statusInactive}
              </span>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              <div className="text-center">
                <p className="text-sm font-bold text-kcb-or tabular-nums">{fmt(client.aum)}</p>
                <p className="text-[10px] text-kcb-pierre">AUM</p>
              </div>
              <div className="text-center">
                <p
                  className={`text-sm font-bold tabular-nums flex items-center justify-center gap-0.5 ${client.ytd >= 0 ? 'text-kcb-or' : 'text-red-400'}`}
                >
                  {client.ytd >= 0 ? (
                    <ArrowUp className="w-3 h-3" />
                  ) : (
                    <ArrowDown className="w-3 h-3" />
                  )}
                  {Math.abs(client.ytd)}%
                </p>
                <p className="text-[10px] text-kcb-pierre">YTD</p>
              </div>
              <div className="text-center">
                <p className="text-sm font-bold text-white">{client.artworks}</p>
                <p className="text-[10px] text-kcb-pierre">{t.labelArtworks}</p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.04] text-xs text-kcb-pierre">
              <span>{t.labelNextReview} {client.nextReview}</span>
              <button className="flex items-center gap-1 text-kcb-or opacity-0 group-hover:opacity-100 transition hover:text-kcb-bronze">
                {t.see} <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center h-40 text-kcb-pierre text-sm gap-2">
          <Users className="w-8 h-8 opacity-40" />
          {t.emptyState}
        </div>
      )}
    </div>
  )
}
