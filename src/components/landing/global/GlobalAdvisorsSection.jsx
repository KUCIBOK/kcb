/**
 * GlobalAdvisorsSection.jsx — SaaS Dashboard for art advisors
 *
 * Interactive demo of Kucibok's infrastructure:
 * - Client portfolio management
 * - Curated deal flow
 * - Market intelligence
 * - Secure transactions
 * - Commission tracking
 */

import { memo, useState, useEffect, useRef } from 'react'
import { useLang } from '../../../store/LangContext'

// ─── View 0: Portfolio Management ─────────────────────────────────

const CLIENTS_DATA = [
  { initials: 'ML', name: 'Marie Lefèvre', loc: 'Paris, France', works: 3, total: '€4 200', tag: 'Actif' },
  { initials: 'JA', name: 'James Adeyemi', loc: 'London, UK', works: 2, total: '€2 800', tag: 'Actif' },
  { initials: 'SC', name: 'Sofia Chen', loc: 'Dubai, UAE', works: 1, total: '€1 400', tag: 'Prospect' },
]

const PORTFOLIO_STATS = [
  { number: '24', label: 'Clients actifs', trend: '+6 ce mois', trendColor: '#34d399' },
  { number: '€92K', label: 'Volume total', trend: 'Acquisitions', trendColor: 'rgba(201,168,76,0.8)' },
  { number: '48', label: 'Œuvres gérées', trend: 'Via KCB', trendColor: '#34d399' },
]

function ViewPortfolio() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Portfolio Management</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Client collections overview
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {PORTFOLIO_STATS.map((card) => (
          <div
            key={card.label}
            className="p-4 rounded-sm border border-kcb-silver/[0.08]"
            style={{ background: 'rgba(44,52,66,0.6)' }}
          >
            <p className="font-playfair font-bold text-xl text-white leading-none">{card.number}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.12em] uppercase text-kcb-pierre mt-1.5">
              {card.label}
            </p>
            <p className="text-[9px] mt-2 font-dm-sans" style={{ color: card.trendColor }}>
              {card.trend}
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60">
            Your clients
          </span>
        </div>
        {CLIENTS_DATA.map((c, i) => (
          <div
            key={c.name}
            className={['flex items-center gap-3 py-2.5', i < CLIENTS_DATA.length - 1 ? 'border-b border-kcb-silver/[0.05]' : ''].join(' ')}
          >
            <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-dm-sans text-[9px] font-bold text-black" style={{ background: 'var(--accent)' }}>
              {c.initials}
            </div>
            <div className="min-w-0">
              <p className="font-dm-sans text-[12px] text-white leading-tight truncate">{c.name}</p>
              <p className="font-jetbrains text-[9px] text-kcb-pierre/50 mt-0.5">{c.loc}</p>
            </div>
            <div className="flex-1" />
            <div className="text-right mr-3">
              <p className="font-jetbrains text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                {c.total}
              </p>
              <p className="font-jetbrains text-[8px] text-kcb-pierre/40 mt-0.5">
                {c.works} artwork{c.works > 1 ? 's' : ''}
              </p>
            </div>
            <span className="font-jetbrains text-[8px] tracking-[0.06em] px-2 py-0.5 rounded-[2px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40">
              {c.tag}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View 1: Deal Flow ──────────────────────────────────────

const DEALS = [
  { artwork: 'Harmattan Series #3', artist: 'Ibrahim Maïga · Dakar', price: '€8 400', status: 'Available', statusColor: 'text-emerald-400' },
  { artwork: 'Urban Reflections', artist: 'Ama Boateng · Accra', price: '€6 200', status: 'Inquiry', statusColor: 'text-amber-400' },
  { artwork: 'Coastal Dreams', artist: 'Tunde Adebayo · Lagos', price: '€12 500', status: 'Pending', statusColor: 'text-blue-400' },
]

function ViewDealFlow() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Deal Flow</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Curated sourcing pipeline
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { num: '142', label: 'Artworks available', color: '#34d399' },
          { num: '28', label: 'Active inquiries', color: 'rgba(201,168,76,0.8)' },
          { num: '€2.4M', label: 'Total sourced', color: '#34d399' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-sm border border-kcb-silver/[0.08]" style={{ background: 'rgba(44,52,66,0.6)' }}>
            <p className="font-playfair font-bold text-xl text-white leading-none">{s.num}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.12em] uppercase text-kcb-pierre mt-1.5">{s.label}</p>
            <p className="text-[9px] mt-2 font-dm-sans" style={{ color: s.color }}>
              Live
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60">
            New opportunities
          </span>
        </div>
        {DEALS.map((deal, i) => (
          <div key={deal.artwork} className={['flex items-center gap-3 py-2.5', i < DEALS.length - 1 ? 'border-b border-kcb-silver/[0.05]' : ''].join(' ')}>
            <div className="min-w-0 flex-1">
              <p className="font-dm-sans text-[12px] text-white leading-tight truncate">{deal.artwork}</p>
              <p className="font-jetbrains text-[9px] text-kcb-pierre/50 mt-0.5">{deal.artist}</p>
            </div>
            <div className="flex-1" />
            <div className="text-right mr-3">
              <p className="font-jetbrains text-[10px] font-bold" style={{ color: 'var(--accent)' }}>
                {deal.price}
              </p>
            </div>
            <span className={`font-jetbrains text-[8px] tracking-[0.06em] px-2 py-0.5 rounded-[2px] ${deal.statusColor}`}>{deal.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View 2: Commission Tracking ──────────────────────────────────

function ViewCommissions() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Commissions</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Revenue tracking & reporting
        </p>
      </div>
      <div
        className="flex items-center justify-between px-5 py-4 my-5 border rounded-sm"
        style={{
          background: 'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))',
          borderColor: 'rgba(201,168,76,0.2)',
        }}
      >
        <div>
          <p className="font-jetbrains text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: 'rgba(201,168,76,0.5)' }}>
            Total earned this month
          </p>
          <p className="font-playfair font-bold text-2xl text-white leading-none">€18 400</p>
          <p className="font-jetbrains text-[9px] mt-1" style={{ color: '#34d399' }}>
            +€4 200 from 8 sales ↑
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: '€142K', label: 'Annual earnings', color: '#34d399' },
          { num: '24%', label: 'Avg commission', color: 'rgba(201,168,76,0.8)' },
          { num: '18', label: 'Completed sales', color: '#34d399' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-sm border border-kcb-silver/[0.08]" style={{ background: 'rgba(44,52,66,0.6)' }}>
            <p className="font-playfair font-bold text-xl text-white leading-none">{s.num}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.12em] uppercase text-kcb-pierre mt-1.5">{s.label}</p>
            <p className="text-[9px] mt-2 font-dm-sans" style={{ color: s.color }}>
              YTD
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

const VIEWS = [<ViewPortfolio key={0} />, <ViewDealFlow key={1} />, <ViewCommissions key={2} />]
const NAV_LABELS = ['Portfolio', 'Deal Flow', 'Commissions']
const CYCLE_MS = 4000

export default memo(function GlobalAdvisorsSection() {
  const { lang } = useLang()
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const pausedRef = useRef(false)

  const translations = {
    en: {
      heading: 'Invest. Advise. Build Portfolio.',
      subheading: 'A real SaaS tool, not a simple marketplace. Manage client portfolios, source deals, and scale your advisory business on one integrated platform.',
    },
    fr: {
      heading: 'Investissez. Conseillez. Construisez le portefeuille.',
      subheading: 'Un vrai outil SaaS, non une simple marketplace. Gérez les portefeuilles clients, sourcez les offres et développez votre activité de conseil sur une seule plateforme intégrée.',
    },
  }

  const t = translations[lang] || translations.en

  // Auto-advance animation
  useEffect(() => {
    startRef.current = performance.now()
    function tick(now) {
      if (pausedRef.current) {
        startRef.current = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }
      const elapsed = now - startRef.current
      const pct = Math.min(elapsed / CYCLE_MS, 1)
      setProgress(pct)
      if (pct >= 1) {
        setActive((a) => (a + 1) % 3)
        startRef.current = now
      }
      rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  function goTo(i) {
    setActive(i)
    setProgress(0)
    startRef.current = performance.now()
  }

  return (
    <section className="py-20 lg:py-32 px-[clamp(24px,5vw,80px)] bg-kcb-noir-deep">
      <div className="max-w-[1280px] mx-auto">
        {/* Header */}
        <div className="mb-16 lg:mb-24">
          <div className="inline-block bg-kcb-or/10 border border-kcb-or/20 rounded-[4px] px-4 py-2 mb-6">
            <span className="font-jetbrains text-[10px] tracking-[0.15em] uppercase text-kcb-or">
              For Advisors
            </span>
          </div>
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-white mb-4">
            <span className="text-kcb-or">{t.heading.split('.')[0]}.</span>{' '}
            {t.heading.split('.').slice(1).join('.')}
          </h2>
          <p className="text-kcb-sable text-lg max-w-3xl border-l-2 border-kcb-or/30 pl-4">
            {t.subheading}
          </p>
        </div>

        {/* Dashboard Mock */}
        <div
          className="w-full overflow-hidden bg-kcb-noir-deep border border-kcb-or/20 rounded-sm mb-6"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 2px rgba(201,168,76,0.15)' }}
          onMouseEnter={() => { pausedRef.current = true }}
          onMouseLeave={() => { pausedRef.current = false }}
        >
          {/* Top Bar */}
          <div className="flex items-center gap-3 px-4 py-3 border-b border-kcb-silver/[0.07]" style={{ background: 'rgba(255,255,255,0.025)' }}>
            <div className="w-5 h-5 flex items-center justify-center rounded-[2px]" style={{ background: 'var(--accent)' }}>
              <span className="font-jetbrains text-[7px] font-bold text-black leading-none">K</span>
            </div>
            <span className="font-jetbrains text-[10px] tracking-[0.08em] text-white/70">Kucibok Bridge</span>
            <div className="ml-auto flex items-center gap-1.5 mr-3">
              <span className="block w-2 h-2 rounded-full bg-kcb-silver/20" />
              <span className="block w-2 h-2 rounded-full bg-kcb-silver/20" />
              <span className="block w-2 h-2 rounded-full bg-kcb-silver/20" />
            </div>
            <span className="font-jetbrains text-[9px] text-kcb-pierre/70 mr-2">Advisor Plus</span>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-black font-dm-sans" style={{ background: 'var(--accent)' }}>AP</div>
          </div>

          {/* Body */}
          <div className="flex" style={{ minHeight: '260px' }}>
            {/* Sidebar */}
            <div className="hidden sm:block flex-shrink-0 border-r border-kcb-silver/[0.06] pt-5" style={{ width: '160px', background: '#0b0e14' }}>
              {NAV_LABELS.map((label, i) => {
                const isActive = i === active
                return (
                  <div
                    key={label}
                    onClick={() => goTo(i)}
                    className="font-jetbrains text-[11px] tracking-[0.05em] py-2.5 px-4 cursor-pointer select-none transition-colors duration-300"
                    style={{
                      color: isActive ? 'var(--accent)' : 'rgba(168,176,188,0.35)',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                      paddingLeft: isActive ? '14px' : '16px',
                    }}
                  >
                    {label}
                  </div>
                )
              })}
            </div>

            {/* Main Content */}
            <div className="flex-1 relative overflow-hidden">
              {VIEWS.map((view, i) => (
                <div
                  key={i}
                  className="absolute inset-0 flex"
                  style={{
                    opacity: i === active ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    pointerEvents: i === active ? 'auto' : 'none',
                  }}
                >
                  {view}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { num: '01', title: 'Client Portfolio Management', desc: 'Track collections and manage client relationships', icon: '👥' },
            { num: '02', title: 'Curated Deal Flow', desc: 'Access pre-vetted artworks & direct sourcing', icon: '🎯' },
            { num: '03', title: 'Commission Tracking', desc: 'Automated revenue reporting & payments', icon: '💰' },
          ].map((f, i) => (
            <button
              key={f.num}
              onClick={() => goTo(i)}
              className="text-left bg-kcb-noir border border-kcb-silver/[0.08] rounded-[4px] p-6 h-full relative overflow-hidden focus:outline-none group transition-all duration-300 hover:border-kcb-silver/[0.15] hover:bg-kcb-noir/80"
              style={{
                borderTop: i === active ? '2px solid var(--accent)' : '2px solid transparent',
              }}
            >
              {i === active && (
                <div
                  className="absolute bottom-0 left-0 h-px"
                  style={{
                    width: `${progress * 100}%`,
                    background: 'var(--accent)',
                    transition: 'none',
                  }}
                />
              )}
              <div className="mb-4 text-3xl">{f.icon}</div>
              <span className="font-jetbrains text-[10px] tracking-[0.15em]" style={{ color: i === active ? 'var(--accent)' : 'rgba(201,168,76,0.4)' }}>
                {f.num}
              </span>
              <p className={`font-dm-sans font-bold text-base lg:text-lg mt-3 mb-2 transition-colors duration-300 ${i === active ? 'text-white' : 'text-white/70'}`}>
                {f.title}
              </p>
              <p className={`font-dm-sans text-sm leading-relaxed mb-4 transition-colors duration-300 ${i === active ? 'text-kcb-pierre' : 'text-kcb-pierre/50'}`}>
                {f.desc}
              </p>
              <div className="flex items-center gap-1 text-xs font-semibold transition-colors duration-300" style={{ color: i === active ? 'var(--accent)' : 'rgba(201,168,76,0.5)' }}>
                Learn more <span>→</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
})
