/**
 * GlobalCuratorsSection.jsx — SaaS Dashboard for art curators
 *
 * Interactive demo of Kucibok's infrastructure:
 * - Inventory management
 * - Digital certification
 * - Logistics tracking
 * - Valuation analytics
 * - Multi-entity governance
 */

import { memo, useState, useEffect, useRef } from 'react'
import { useLang } from '../../../store/LangContext'

// ─── View 0: Inventory Dashboard ──────────────────────────────────────

const INVENTORY_DATA = [
  { title: 'Harmattan Series #3', id: 'KCB-8B2F1A3E', status: 'certified', color: '#3d2b10', date: '12 mar.' },
  { title: 'Marché de Dakar', id: 'KCB-7A1E9C2D', status: 'certified', color: '#1a2030', date: '08 mar.' },
  { title: 'Sahel Blues', id: 'KCB-9C3D4B5A', status: 'transit', color: '#201a10', date: '05 mar.' },
]

const CURATOR_STATS = [
  { number: '48', label: 'Œuvres gérées', trend: '+12 ce mois', trendColor: '#34d399' },
  { number: '€127K', label: 'Valeur certifiée', trend: '+€32K', trendColor: '#34d399' },
  { number: '12', label: 'En transit', trend: 'EU/UAE', trendColor: 'rgba(168,176,188,0.5)' },
]

function ViewInventory() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Tableau de bord</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Activité de votre collection
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {CURATOR_STATS.map((card) => (
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
            Dernières certifications
          </span>
        </div>
        {INVENTORY_DATA.map((aw, i) => (
          <div
            key={aw.id}
            className={['flex items-center gap-3 py-2.5', i < INVENTORY_DATA.length - 1 ? 'border-b border-kcb-silver/[0.05]' : ''].join(' ')}
          >
            <div className="w-8 h-8 flex-shrink-0 rounded-[2px]" style={{ background: aw.color }} />
            <div className="min-w-0">
              <p className="font-dm-sans text-[12px] text-white leading-tight truncate">{aw.title}</p>
              <p className="font-jetbrains text-[9px] text-kcb-pierre/50 mt-0.5">{aw.id}</p>
            </div>
            <div className="flex-1" />
            <span className="font-jetbrains text-[8px] tracking-[0.06em] px-2 py-0.5 rounded-[2px] text-emerald-400 bg-emerald-950/60 border border-emerald-800/40">
              Certifié
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View 1: Logistics Dashboard ──────────────────────────────────────

const SHIPMENTS = [
  { artwork: 'Harmattan Series #3', destination: 'Paris, France', status: 'In Transit', statusColor: 'text-blue-400', date: '14 mar.' },
  { artwork: 'Portrait III', destination: 'Dubai, UAE', status: 'Customs', statusColor: 'text-amber-400', date: '10 mar.' },
  { artwork: 'Sahel Blues', destination: 'London, UK', status: 'Ready', statusColor: 'text-emerald-400', date: '08 mar.' },
]

function ViewLogistics() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Expéditions</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Suivi logistique en direct
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {[
          { num: '24', label: 'Œuvres expédiées', color: '#34d399' },
          { num: '3', label: 'En transit', color: 'rgba(201,168,76,0.8)' },
          { num: '€18K', label: 'Assurance totale', color: '#34d399' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-sm border border-kcb-silver/[0.08]" style={{ background: 'rgba(44,52,66,0.6)' }}>
            <p className="font-playfair font-bold text-xl text-white leading-none">{s.num}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.12em] uppercase text-kcb-pierre mt-1.5">{s.label}</p>
            <p className="text-[9px] mt-2 font-dm-sans" style={{ color: s.color }}>
              Actualisé
            </p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60">
            Expéditions actives
          </span>
        </div>
        {SHIPMENTS.map((ship, i) => (
          <div key={ship.artwork} className={['flex items-center gap-3 py-2.5', i < SHIPMENTS.length - 1 ? 'border-b border-kcb-silver/[0.05]' : ''].join(' ')}>
            <div className="min-w-0 flex-1">
              <p className="font-dm-sans text-[12px] text-white leading-tight truncate">{ship.artwork}</p>
              <p className="font-jetbrains text-[9px] text-kcb-pierre/50 mt-0.5">{ship.destination}</p>
            </div>
            <div className="flex-1" />
            <span className={`font-jetbrains text-[8px] tracking-[0.06em] px-2 py-0.5 rounded-[2px] ${ship.statusColor}`}>{ship.status}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── View 2: Valuation & Analytics ──────────────────────────────────────

function ViewValuation() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Analyses</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Intelligence de marché en temps réel
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
            Valeur du portefeuille
          </p>
          <p className="font-playfair font-bold text-2xl text-white leading-none">€127 400</p>
          <p className="font-jetbrains text-[9px] mt-1" style={{ color: '#34d399' }}>
            +€12 100 ce mois ↑
          </p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {[
          { num: '+14%', label: 'Tendance YoY', color: '#34d399' },
          { num: '127', label: 'Avg. Price Index', color: 'rgba(201,168,76,0.8)' },
          { num: '48', label: 'Total Managed', color: '#34d399' },
        ].map((s) => (
          <div key={s.label} className="p-4 rounded-sm border border-kcb-silver/[0.08]" style={{ background: 'rgba(44,52,66,0.6)' }}>
            <p className="font-playfair font-bold text-xl text-white leading-none">{s.num}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.12em] uppercase text-kcb-pierre mt-1.5">{s.label}</p>
            <p className="text-[9px] mt-2 font-dm-sans" style={{ color: s.color }}>
              Actuel
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────

const VIEWS = [<ViewInventory key={0} />, <ViewLogistics key={1} />, <ViewValuation key={2} />]
const NAV_LABELS = ['Inventaire', 'Expéditions', 'Analyses']
const CYCLE_MS = 4000

export default memo(function GlobalCuratorsSection() {
  const { lang } = useLang()
  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const pausedRef = useRef(false)

  const translations = {
    en: {
      heading: 'Organize. Certify. Scale.',
      subheading: 'A real SaaS tool, not a simple marketplace. Manage your entire art curatorial operations from a single dashboard. Inventory, certifications, shipments, valuation.',
    },
    fr: {
      heading: 'Organisez. Certifiez. Développez.',
      subheading: 'Un vrai outil SaaS, non une simple marketplace. Gérez l\'intégralité de votre activité curatoriale depuis un seul tableau de bord. Inventaire, certifications, expéditions, valorisation.',
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
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-white mb-4">
            {t.heading}
          </h2>
          <p className="text-kcb-sable text-lg max-w-3xl">
            {t.subheading}
          </p>
        </div>

        {/* Dashboard Mock */}
        <div
          className="w-full overflow-hidden bg-kcb-noir-deep border border-kcb-silver/[0.08] rounded-sm mb-6"
          style={{ boxShadow: '0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.06)' }}
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
            <span className="font-jetbrains text-[9px] text-kcb-pierre/70 mr-2">Curator Pro</span>
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-black font-dm-sans" style={{ background: 'var(--accent)' }}>CP</div>
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

        {/* Feature Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5">
          {[
            { num: '01', title: 'Inventory Management', desc: 'Real-time tracking of all artworks, certifications & shipments' },
            { num: '02', title: 'Digital Certification', desc: 'Immutable provenance & KCB certification records' },
            { num: '03', title: 'Market Analytics', desc: 'Valuation trends, pricing intelligence & portfolio insights' },
          ].map((f, i) => (
            <button
              key={f.num}
              onClick={() => goTo(i)}
              className="text-left bg-kcb-noir p-4 md:p-8 h-full relative overflow-hidden focus:outline-none group transition-colors duration-300"
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
              <span className="font-jetbrains text-[10px] tracking-[0.15em]" style={{ color: i === active ? 'var(--accent)' : 'rgba(201,168,76,0.4)' }}>
                {f.num}
              </span>
              <p className={`font-dm-sans font-semibold text-sm mt-3 mb-2 transition-colors duration-300 ${i === active ? 'text-white' : 'text-white/50'}`}>
                {f.title}
              </p>
              <p className={`font-dm-sans text-xs leading-relaxed transition-colors duration-300 ${i === active ? 'text-kcb-pierre' : 'text-kcb-pierre/40'}`}>
                {f.desc}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
})
