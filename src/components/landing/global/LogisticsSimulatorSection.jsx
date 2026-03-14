import { useState, useEffect, useRef } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, Package, Shield, Truck, FileCheck, Info } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"

// ── Data ────────────────────────────────────────────────────────────────────

const ORIGINS = [
  { id: "dakar",    label: "Dakar, Sénégal" },
  { id: "abidjan",  label: "Abidjan, Côte d'Ivoire" },
  { id: "lagos",    label: "Lagos, Nigeria" },
  { id: "accra",    label: "Accra, Ghana" },
  { id: "cotonou",  label: "Cotonou, Bénin" },
  { id: "nairobi",  label: "Nairobi, Kenya" },
]

const DESTINATIONS = [
  { id: "paris",    label: "Paris, France",      region: "eu",      transit: "10–18 jours" },
  { id: "brussels", label: "Bruxelles, Belgique", region: "eu",      transit: "12–20 jours" },
  { id: "london",   label: "Londres, UK",         region: "uk",      transit: "12–20 jours" },
  { id: "newyork",  label: "New York, USA",        region: "us",      transit: "14–21 jours" },
  { id: "dubai",    label: "Dubai, UAE",           region: "gulf",    transit: "8–14 jours"  },
  { id: "tokyo",    label: "Tokyo, Japon",         region: "asia",    transit: "18–28 jours" },
  { id: "sydney",   label: "Sydney, Australie",    region: "oceania", transit: "22–32 jours" },
]

const ARTWORK_TYPES = [
  { id: "painting",   label: "Peinture / Tableau" },
  { id: "sculpture",  label: "Sculpture" },
  { id: "photo",      label: "Photographie" },
  { id: "textile",    label: "Textile / Tapisserie" },
  { id: "mixed",      label: "Œuvre mixte / Installation" },
]

const SIZES = [
  { id: "s",  label: "S",  desc: "< 50 cm",    sizeMult: 1.0, packing: 80  },
  { id: "m",  label: "M",  desc: "50–100 cm",  sizeMult: 1.5, packing: 130 },
  { id: "l",  label: "L",  desc: "100–200 cm", sizeMult: 2.2, packing: 195 },
  { id: "xl", label: "XL", desc: "> 200 cm",   sizeMult: 3.5, packing: 320 },
]

// Base transport cost (€) by destination region
const TRANSPORT_BASE = { eu: 310, uk: 370, us: 510, gulf: 395, asia: 610, oceania: 730 }

// Import & customs handling flat rate (€) by region
// EU: 0% customs duty on original art (CN 97.01) — only admin/brokerage fees
const IMPORT_FEES = { eu: 90, uk: 145, us: 175, gulf: 80, asia: 245, oceania: 275 }

// ── Compute quote ────────────────────────────────────────────────────────────

function computeQuote({ destId, size, value }) {
  const dest    = DESTINATIONS.find(d => d.id === destId)
  const sizeObj = SIZES.find(s => s.id === size)

  const transport  = Math.round(TRANSPORT_BASE[dest.region] * sizeObj.sizeMult)
  const packing    = sizeObj.packing
  const insurance  = Math.max(55, Math.round(value * 0.018))
  const importFees = IMPORT_FEES[dest.region]
  const kucibok    = 95
  const total      = transport + packing + insurance + importFees + kucibok

  return { transport, packing, insurance, importFees, kucibok, total, transit: dest.transit }
}

// ── Animated number ──────────────────────────────────────────────────────────

function AnimatedNumber({ value, className = "" }) {
  const [displayed, setDisplayed] = useState(value)
  const prevRef  = useRef(value)
  const frameRef = useRef(null)

  useEffect(() => {
    const from     = prevRef.current
    const to       = value
    const duration = 550
    const start    = performance.now()

    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplayed(Math.round(from + (to - from) * eased))
      if (progress < 1) frameRef.current = requestAnimationFrame(tick)
      else prevRef.current = to
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => { if (frameRef.current) cancelAnimationFrame(frameRef.current) }
  }, [value])

  return (
    <span className={className}>
      {displayed.toLocaleString("fr-FR")} €
    </span>
  )
}

// ── Select component ─────────────────────────────────────────────────────────

function Select({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block font-jetbrains text-[9px] tracking-[0.14em] text-kcb-pierre/70 uppercase mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full bg-kcb-noir border border-kcb-silver/[0.1] text-white text-[13px] px-3.5 py-2.5 appearance-none cursor-pointer transition-colors hover:border-kcb-silver/20 focus:outline-none focus:border-[var(--accent)]/50"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23787f8a' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`, backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center" }}
      >
        {options.map(o => (
          <option key={o.id} value={o.id}>{o.label}</option>
        ))}
      </select>
    </div>
  )
}

// ── Cost row ─────────────────────────────────────────────────────────────────

function CostRow({ icon: Icon, label, value, accent = false }) {
  return (
    <div className={`flex items-center justify-between py-3 border-b border-kcb-silver/[0.06] ${accent ? "border-b-0 pt-4" : ""}`}>
      <div className="flex items-center gap-3">
        <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${accent ? "text-[var(--accent)]" : "text-kcb-pierre/50"}`} />
        <span className={`text-[12px] ${accent ? "text-white font-semibold" : "text-kcb-pierre"}`}>{label}</span>
      </div>
      <AnimatedNumber
        value={value}
        className={`font-jetbrains text-[13px] ${accent ? "text-[var(--accent)] text-[16px] font-bold" : "text-white/80"}`}
      />
    </div>
  )
}

// ── Main component ───────────────────────────────────────────────────────────

export default function LogisticsSimulatorSection() {
  const [params, setParams] = useState({
    originId: "dakar",
    destId:   "paris",
    typeId:   "painting",
    size:     "m",
    value:    5000,
  })

  const set = (key) => (val) => setParams(p => ({ ...p, [key]: val }))

  const quote = computeQuote(params)
  const dest  = DESTINATIONS.find(d => d.id === params.destId)

  return (
    <section id="simulator" className="py-32 bg-kcb-ardoise-cool/40">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">

        <RevealOnScroll>
          <div className="mb-14">
            <SectionLabel text="Quote Simulator" />
            <h2 className="font-playfair font-bold text-[clamp(26px,3vw,38px)] text-white mt-6 mb-3">
              Estimate your shipment in seconds
            </h2>
            <p className="text-[15px] leading-[1.8] text-kcb-pierre max-w-[560px]">
              Select your origin, destination, and artwork parameters. We'll break down every cost — transport, insurance, customs, and packing — before you commit to anything.
            </p>
          </div>
        </RevealOnScroll>

        <RevealOnScroll>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-0.5">

            {/* ── Left: Parameters ── */}
            <div className="bg-kcb-noir px-8 py-10 border border-kcb-silver/[0.07]">
              <div className="font-jetbrains text-[9px] tracking-[0.18em] text-[var(--accent)] mb-8 uppercase">
                01 — Shipment Parameters
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
                <Select
                  label="Origin"
                  value={params.originId}
                  onChange={set("originId")}
                  options={ORIGINS}
                />
                <Select
                  label="Destination"
                  value={params.destId}
                  onChange={set("destId")}
                  options={DESTINATIONS}
                />
                <Select
                  label="Artwork type"
                  value={params.typeId}
                  onChange={set("typeId")}
                  options={ARTWORK_TYPES}
                />
                <div>
                  <label className="block font-jetbrains text-[9px] tracking-[0.14em] text-kcb-pierre/70 uppercase mb-2">
                    Declared value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-kcb-pierre/50 text-[13px]">€</span>
                    <input
                      type="number"
                      min={500}
                      max={500000}
                      step={500}
                      value={params.value}
                      onChange={e => set("value")(Math.max(500, Number(e.target.value)))}
                      className="w-full bg-kcb-noir border border-kcb-silver/[0.1] text-white text-[13px] pl-8 pr-3.5 py-2.5 appearance-none focus:outline-none focus:border-[var(--accent)]/50 transition-colors hover:border-kcb-silver/20"
                    />
                  </div>
                </div>
              </div>

              {/* Size selector */}
              <div>
                <label className="block font-jetbrains text-[9px] tracking-[0.14em] text-kcb-pierre/70 uppercase mb-3">
                  Artwork size (largest dimension)
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {SIZES.map(s => (
                    <button
                      key={s.id}
                      onClick={() => set("size")(s.id)}
                      className={`py-3 px-2 border text-center transition-all ${
                        params.size === s.id
                          ? "border-[var(--accent)] bg-[var(--accent)]/[0.08]"
                          : "border-kcb-silver/[0.1] hover:border-kcb-silver/25"
                      }`}
                    >
                      <div className={`font-jetbrains text-[11px] font-bold mb-0.5 ${params.size === s.id ? "text-[var(--accent)]" : "text-white/70"}`}>
                        {s.label}
                      </div>
                      <div className="text-[9px] text-kcb-pierre/60 leading-tight">{s.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Value slider */}
              <div className="mt-7">
                <div className="flex justify-between mb-2">
                  <span className="font-jetbrains text-[9px] tracking-[0.14em] text-kcb-pierre/70 uppercase">Value range</span>
                  <span className="font-jetbrains text-[10px] text-[var(--accent)]">{params.value.toLocaleString("fr-FR")} €</span>
                </div>
                <input
                  type="range"
                  min={500}
                  max={100000}
                  step={500}
                  value={params.value}
                  onChange={e => set("value")(Number(e.target.value))}
                  className="w-full accent-[#C9A84C] h-0.5 bg-kcb-silver/[0.12] appearance-none cursor-pointer"
                />
                <div className="flex justify-between mt-1">
                  <span className="font-jetbrains text-[8px] text-kcb-pierre/40">500 €</span>
                  <span className="font-jetbrains text-[8px] text-kcb-pierre/40">100 000 €</span>
                </div>
              </div>
            </div>

            {/* ── Right: Cost breakdown ── */}
            <div className="bg-kcb-noir px-8 py-10 border border-kcb-silver/[0.07] flex flex-col">
              <div className="font-jetbrains text-[9px] tracking-[0.18em] text-[var(--accent)] mb-8 uppercase">
                02 — Cost Breakdown
              </div>

              <div className="flex-1">
                <CostRow icon={Truck}      label="Transport international" value={quote.transport}  />
                <CostRow icon={Package}    label="Emballage muséal"          value={quote.packing}   />
                <CostRow icon={Shield}     label="Assurance valeur déclarée" value={quote.insurance} />
                <CostRow icon={FileCheck}  label="Frais douane & transit"    value={quote.importFees}/>
                <CostRow icon={FileCheck}  label="Kucibok Bridge fee"        value={quote.kucibok}   />

                {/* Separator */}
                <div className="border-t border-kcb-silver/[0.12] mt-1 mb-1" />

                <CostRow icon={ArrowRight} label="Total estimé" value={quote.total} accent />
              </div>

              {/* Transit + cert */}
              <div className="mt-6 space-y-2.5 pb-6 border-b border-kcb-silver/[0.07]">
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  <span className="text-[12px] text-kcb-pierre">
                    Transit estimé vers <span className="text-white">{dest.label}</span> : <span className="text-white font-medium">{quote.transit}</span>
                  </span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  <span className="text-[12px] text-kcb-pierre">Certificat d'authenticité KCB : <span className="text-white font-medium">inclus</span></span>
                </div>
                <div className="flex items-center gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] flex-shrink-0" />
                  <span className="text-[12px] text-kcb-pierre">Tracking en temps réel : <span className="text-white font-medium">inclus</span></span>
                </div>
              </div>

              {/* CTA */}
              <div className="mt-6 space-y-3">
                <Link
                  to="/contact"
                  className="flex items-center justify-center gap-2 bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-6 py-3.5 w-full transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline"
                >
                  Obtenir une cotation formelle <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <p className="text-[10px] text-kcb-pierre/50 leading-relaxed flex gap-1.5 items-start">
                  <Info className="w-3 h-3 flex-shrink-0 mt-0.5" />
                  Estimation indicative. Cotation précise et contractuelle sous 24h. Les frais de douane peuvent varier selon la classification douanière exacte de l'œuvre.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

      </div>
    </section>
  )
}
