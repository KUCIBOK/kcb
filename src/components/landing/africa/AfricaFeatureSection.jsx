import { useState, useEffect, useRef } from "react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { africaT } from "../../../i18n/africa"

// ─── Shared sidebar nav ────────────────────────────────────────────────────────

const NAV_LABELS = ["Tableau de bord", "Mes œuvres", "Clients", "Revenus", "Mon profil"]
const VIEW_NAV = [1, 2, 3] // which nav item is active per view index

// ─── View 0 — Inventaire ──────────────────────────────────────────────────────

const STAT_CARDS = [
  { number: "12", label: "Œuvres certifiées", trend: "+3 ce mois", trendColor: "#34d399" },
  { number: "3",  label: "En transit",        trend: "Europe · UAE", trendColor: "rgba(168,176,188,0.5)" },
  { number: "€8 400", label: "Valeur certifiée", trend: "+€1 200",  trendColor: "#34d399" },
]

const ARTWORKS = [
  { title: "Harmattan Series #3", id: "KCB-8B2F1A3E", status: "certified", color: "#3d2b10", date: "12 mar." },
  { title: "Marché de Dakar",     id: "KCB-7A1E9C2D", status: "certified", color: "#1a2030", date: "08 mar." },
  { title: "Sahel Blues",         id: "KCB-9C3D4B5A", status: "transit",   color: "#201a10", date: "05 mar." },
  { title: "Portrait III",        id: "KCB-5E2A8D1F", status: "pending",   color: "#151a25", date: "01 mar." },
]

const STATUS_CFG = {
  certified: { label: "Certifié",   cls: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40" },
  transit:   { label: "En transit", cls: "bg-blue-950/60 text-blue-400 border border-blue-800/40" },
  pending:   { label: "En attente", cls: "bg-amber-950/60 text-amber-400 border border-amber-800/40" },
}

function ViewInventaire() {
  return (
    <div className="flex-1 p-6 min-w-0">
      <div>
        <p className="font-playfair text-lg text-white leading-tight">Bonjour, Ibrahim</p>
        <p className="font-jetbrains text-[9px] tracking-[0.1em] uppercase text-kcb-pierre/60 mt-0.5">
          Votre activité du mois
        </p>
      </div>
      <div className="grid grid-cols-3 gap-3 mt-5">
        {STAT_CARDS.map((card) => (
          <div key={card.label} className="p-4 rounded-sm border border-kcb-silver/[0.08]" style={{ background: "rgba(44,52,66,0.6)" }}>
            <p className="font-playfair font-bold text-xl text-white leading-none">{card.number}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.12em] uppercase text-kcb-pierre mt-1.5">{card.label}</p>
            <p className="text-[9px] mt-2 font-dm-sans" style={{ color: card.trendColor }}>{card.trend}</p>
          </div>
        ))}
      </div>
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60">Dernières œuvres</span>
          <span className="font-jetbrains text-[9px] cursor-default" style={{ color: "var(--accent)" }}>Voir tout →</span>
        </div>
        {ARTWORKS.map((aw, i) => {
          const s = STATUS_CFG[aw.status]
          return (
            <div key={aw.id} className={["flex items-center gap-3 py-2.5", i < ARTWORKS.length - 1 ? "border-b border-kcb-silver/[0.05]" : ""].join(" ")}>
              <div className="w-8 h-8 flex-shrink-0 rounded-[2px]" style={{ background: aw.color }} />
              <div className="min-w-0">
                <p className="font-dm-sans text-[12px] text-white leading-tight truncate">{aw.title}</p>
                <p className="font-jetbrains text-[9px] text-kcb-pierre/50 mt-0.5">{aw.id}</p>
              </div>
              <div className="flex-1" />
              <span className={`font-jetbrains text-[8px] tracking-[0.06em] px-2 py-0.5 rounded-[2px] whitespace-nowrap ${s.cls}`}>{s.label}</span>
              <span className="font-jetbrains text-[9px] text-kcb-pierre/40 w-12 text-right flex-shrink-0">{aw.date}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ─── View 1 — Portefeuille client ─────────────────────────────────────────────

const CLIENTS = [
  { initials: "ML", name: "Marie Lefèvre",    loc: "Paris, France",  works: 3, total: "€4 200", tag: "Actif",    tagCls: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",  color: "#1a2030" },
  { initials: "JA", name: "James Adeyemi",    loc: "London, UK",     works: 2, total: "€2 800", tag: "Actif",    tagCls: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",  color: "#3d2b10" },
  { initials: "SC", name: "Sofia Chen",       loc: "Dubai, UAE",     works: 1, total: "€1 400", tag: "Prospect", tagCls: "bg-amber-950/60 text-amber-400 border border-amber-800/40",       color: "#201a10" },
  { initials: "PD", name: "Pierre Dubois",    loc: "Genève, CH",     works: 4, total: "€6 100", tag: "Actif",    tagCls: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/40",  color: "#151a25" },
]

function ViewPortefeuille() {
  return (
    <div className="flex-1 p-6 min-w-0">
      {/* Summary bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { num: "8", label: "Clients actifs",    sub: "+2 ce mois",    color: "#34d399" },
          { num: "€14 500", label: "Volume total", sub: "Acquisitions",  color: "rgba(201,168,76,0.8)" },
          { num: "10",  label: "Œuvres vendues",  sub: "Via KCB",       color: "#34d399" },
        ].map((s) => (
          <div key={s.label} className="p-3 rounded-sm border border-kcb-silver/[0.08]" style={{ background: "rgba(44,52,66,0.6)" }}>
            <p className="font-playfair font-bold text-lg text-white leading-none">{s.num}</p>
            <p className="font-jetbrains text-[8px] tracking-[0.1em] uppercase text-kcb-pierre mt-1">{s.label}</p>
            <p className="font-dm-sans text-[9px] mt-1" style={{ color: s.color }}>{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Client list */}
      <div className="flex items-center justify-between mb-2">
        <span className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60">Portefeuille clients</span>
        <span className="font-jetbrains text-[9px] cursor-default" style={{ color: "var(--accent)" }}>Gérer →</span>
      </div>

      {CLIENTS.map((c, i) => (
        <div key={c.name} className={["flex items-center gap-3 py-2.5", i < CLIENTS.length - 1 ? "border-b border-kcb-silver/[0.05]" : ""].join(" ")}>
          {/* Avatar */}
          <div className="w-8 h-8 flex-shrink-0 rounded-full flex items-center justify-center font-dm-sans text-[9px] font-bold text-black" style={{ background: "var(--accent)" }}>
            {c.initials}
          </div>
          {/* Name + location */}
          <div className="min-w-0">
            <p className="font-dm-sans text-[12px] text-white leading-tight truncate">{c.name}</p>
            <p className="font-jetbrains text-[9px] text-kcb-pierre/50 mt-0.5">{c.loc}</p>
          </div>
          <div className="flex-1" />
          {/* Works + total */}
          <div className="text-right mr-3">
            <p className="font-jetbrains text-[10px] font-bold" style={{ color: "var(--accent)" }}>{c.total}</p>
            <p className="font-jetbrains text-[8px] text-kcb-pierre/40 mt-0.5">{c.works} œuvre{c.works > 1 ? "s" : ""}</p>
          </div>
          {/* Status */}
          <span className={`font-jetbrains text-[8px] tracking-[0.06em] px-2 py-0.5 rounded-[2px] whitespace-nowrap ${c.tagCls}`}>
            {c.tag}
          </span>
        </div>
      ))}
    </div>
  )
}

// ─── View 2 — Paiement / compte crédité ──────────────────────────────────────

const TRANSACTIONS = [
  { label: "Harmattan Series #3", buyer: "Marie Lefèvre · Paris",    amount: "+€1 400", date: "14 mar.",  status: "credited",  statusCls: "text-emerald-400" },
  { label: "Marché de Dakar",     buyer: "Pierre Dubois · Genève",   amount: "+€2 100", date: "10 mar.",  status: "credited",  statusCls: "text-emerald-400" },
  { label: "Portrait III",        buyer: "James Adeyemi · London",   amount: "+€700",   date: "07 mar.",  status: "en cours",  statusCls: "text-amber-400" },
]

const PAY_STEPS = [
  { label: "Commande confirmée",    sub: "Acheteur · Marie Lefèvre",  done: true },
  { label: "Paiement reçu",         sub: "€1 400 via Stripe",         done: true },
  { label: "Virement initié",       sub: "KCB → Votre compte",        done: true },
  { label: "Compte crédité",        sub: "Disponible immédiatement",  done: true, active: true },
]

function ViewPaiement() {
  return (
    <div className="flex-1 p-6 min-w-0">
      {/* Balance card */}
      <div
        className="flex items-center justify-between px-5 py-4 mb-5 border rounded-sm"
        style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.08),rgba(201,168,76,0.03))", borderColor: "rgba(201,168,76,0.2)" }}
      >
        <div>
          <p className="font-jetbrains text-[8px] tracking-[0.15em] uppercase mb-1" style={{ color: "rgba(201,168,76,0.5)" }}>
            Solde disponible
          </p>
          <p className="font-playfair font-bold text-2xl text-white leading-none">€8 400</p>
          <p className="font-jetbrains text-[9px] mt-1" style={{ color: "#34d399" }}>+€1 400 aujourd'hui ↑</p>
        </div>
        <div
          className="font-jetbrains text-[9px] tracking-[0.1em] uppercase px-3 py-2 cursor-default"
          style={{ background: "var(--accent)", color: "#000", fontWeight: 600 }}
        >
          Retirer
        </div>
      </div>

      {/* Payment flow — last transaction */}
      <p className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60 mb-3">
        Dernier paiement reçu
      </p>
      <div className="flex gap-3 mb-5">
        {PAY_STEPS.map((step, i) => (
          <div key={step.label} className="flex gap-2 flex-1">
            <div className="flex flex-col items-center">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: step.active ? "var(--accent)" : step.done ? "rgba(52,211,153,0.25)" : "rgba(44,52,66,0.6)",
                  border: step.active ? "2px solid var(--accent)" : step.done ? "1px solid rgba(52,211,153,0.5)" : "1px solid rgba(168,176,188,0.12)",
                }}
              >
                {step.done && !step.active && (
                  <svg width="6" height="5" viewBox="0 0 6 5" fill="none">
                    <path d="M.5 2.5l1.5 1.5 3-3" stroke="#34d399" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
                {step.active && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#000" }} />}
              </div>
              {i < PAY_STEPS.length - 1 && (
                <div className="w-px flex-1 mt-0.5" style={{ background: "rgba(201,168,76,0.15)", minHeight: "28px" }} />
              )}
            </div>
            <div className="pb-0 min-w-0">
              <p className={`font-dm-sans text-[10px] leading-tight ${step.active ? "text-white" : "text-white/60"}`}>{step.label}</p>
              <p className="font-jetbrains text-[8px] text-kcb-pierre/40 mt-0.5">{step.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent transactions */}
      <p className="font-jetbrains text-[9px] tracking-[0.12em] uppercase text-kcb-pierre/60 mb-2">
        Historique
      </p>
      {TRANSACTIONS.map((tx, i) => (
        <div key={tx.label} className={["flex items-center gap-3 py-2", i < TRANSACTIONS.length - 1 ? "border-b border-kcb-silver/[0.05]" : ""].join(" ")}>
          <div className="min-w-0 flex-1">
            <p className="font-dm-sans text-[11px] text-white leading-tight truncate">{tx.label}</p>
            <p className="font-jetbrains text-[8px] text-kcb-pierre/40 mt-0.5">{tx.buyer}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className={`font-jetbrains text-[11px] font-bold ${tx.statusCls}`}>{tx.amount}</p>
            <p className="font-jetbrains text-[8px] text-kcb-pierre/40 mt-0.5">{tx.date}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Feature tabs ─────────────────────────────────────────────────────────────

// FEATURES sourced from i18n — see below in component

const CYCLE_MS = 4000

// ─── Component ─────────────────────────────────────────────────────────────────

export default function AfricaFeatureSection() {
  const { lang } = useLang()
  const ft = africaT[lang].feature
  const FEATURES = ft.tabs

  const [active, setActive] = useState(0)
  const [progress, setProgress] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)
  const pausedRef = useRef(false)

  // Animate progress bar and auto-advance
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

  const activeNavIndex = VIEW_NAV[active]

  const VIEWS = [<ViewInventaire key={0} />, <ViewPortefeuille key={1} />, <ViewPaiement key={2} />]

  return (
    <section className="py-32 bg-kcb-noir">
      <div className="max-w-6xl mx-auto px-6">

        {/* Header */}
        <RevealOnScroll className="mb-12">
          <div className="max-w-2xl">
            <SectionLabel text={ft.label} />
            <h2 className="font-playfair font-bold text-white text-[clamp(28px,3.5vw,44px)] leading-[1.15] mt-5 mb-5 whitespace-pre-line">
              {ft.title}
            </h2>
            <p className="font-dm-sans text-kcb-pierre text-[15px] leading-relaxed">
              {ft.desc}
            </p>
          </div>
        </RevealOnScroll>

        {/* Dashboard mock */}
        <RevealOnScroll delay={0.1}>
          <div
            className="w-full overflow-hidden bg-kcb-noir-deep border border-kcb-silver/[0.08] rounded-sm"
            style={{ boxShadow: "0 32px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(201,168,76,0.06)" }}
            onMouseEnter={() => { pausedRef.current = true }}
            onMouseLeave={() => { pausedRef.current = false }}
          >
            {/* Top bar */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-kcb-silver/[0.07]" style={{ background: "rgba(255,255,255,0.025)" }}>
              <div className="w-5 h-5 flex items-center justify-center rounded-[2px]" style={{ background: "var(--accent)" }}>
                <span className="font-jetbrains text-[7px] font-bold text-black leading-none">K</span>
              </div>
              <span className="font-jetbrains text-[10px] tracking-[0.08em] text-white/70">Kucibok Bridge</span>
              <div className="flex items-center gap-1.5 ml-auto mr-3">
                <span className="block w-2 h-2 rounded-full bg-kcb-silver/20" />
                <span className="block w-2 h-2 rounded-full bg-kcb-silver/20" />
                <span className="block w-2 h-2 rounded-full bg-kcb-silver/20" />
              </div>
              <span className="font-jetbrains text-[9px] text-kcb-pierre/70 mr-2">Ibrahim Maïga</span>
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-bold text-black font-dm-sans" style={{ background: "var(--accent)" }}>
                IM
              </div>
            </div>

            {/* Body */}
            <div className="flex" style={{ minHeight: "380px" }}>
              {/* Sidebar */}
              <div className="flex-shrink-0 border-r border-kcb-silver/[0.06] pt-5" style={{ width: "176px", background: "#0b0e14" }}>
                {NAV_LABELS.map((label, i) => {
                  const isActive = i === activeNavIndex
                  return (
                    <div
                      key={label}
                      className="font-jetbrains text-[11px] tracking-[0.05em] py-2.5 px-4 cursor-default select-none transition-colors duration-300"
                      style={{
                        color: isActive ? "var(--accent)" : "rgba(168,176,188,0.35)",
                        borderLeft: isActive ? "2px solid var(--accent)" : "2px solid transparent",
                        paddingLeft: isActive ? "14px" : "16px",
                      }}
                    >
                      {label}
                    </div>
                  )
                })}
              </div>

              {/* Main content — cross-fade */}
              <div className="flex-1 relative overflow-hidden">
                {VIEWS.map((view, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex"
                    style={{
                      opacity: i === active ? 1 : 0,
                      transition: "opacity 0.5s ease",
                      pointerEvents: i === active ? "auto" : "none",
                    }}
                  >
                    {view}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Feature tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0.5 mt-0.5">
          {FEATURES.map((f, i) => {
            const isActive = i === active
            return (
              <button
                key={f.num}
                onClick={() => goTo(i)}
                className="text-left bg-kcb-noir p-8 h-full relative overflow-hidden focus:outline-none group transition-colors duration-300"
                style={{ borderTop: isActive ? "2px solid var(--accent)" : "2px solid transparent" }}
              >
                {/* Progress bar */}
                {isActive && (
                  <div
                    className="absolute bottom-0 left-0 h-px"
                    style={{
                      width: `${progress * 100}%`,
                      background: "var(--accent)",
                      transition: "none",
                    }}
                  />
                )}

                <span className="font-jetbrains text-[10px] tracking-[0.15em]" style={{ color: isActive ? "var(--accent)" : "rgba(201,168,76,0.4)" }}>
                  {f.num}
                </span>
                <p className={`font-dm-sans font-semibold text-sm mt-3 mb-2 transition-colors duration-300 ${isActive ? "text-white" : "text-white/50"}`}>
                  {f.title}
                </p>
                <p className={`font-dm-sans text-xs leading-relaxed transition-colors duration-300 ${isActive ? "text-kcb-pierre" : "text-kcb-pierre/40"}`}>
                  {f.desc}
                </p>
              </button>
            )
          })}
        </div>

      </div>
    </section>
  )
}
