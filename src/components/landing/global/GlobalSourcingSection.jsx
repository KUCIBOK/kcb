import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"

const FEATURES = [
  { title: "Curated Selection", text: "We match your brief with artists from our certified network.", icon: "M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" },
  { title: "Full Documentation", text: "Provenance records, certificates, artist portfolios.", icon: "M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM8 8h4M8 12h2" },
  { title: "End-to-End Logistics", text: "Studio to exhibition space. Packing, shipping, customs.", icon: "M10 2a8 8 0 100 16 8 8 0 000-16zM2 10h16M10 2c2 2.5 3 5 3 8s-1 5.5-3 8c-2-2.5-3-5-3-8s1-5.5 3-8z" },
  { title: "Dedicated Account Manager", text: "Single point of contact. Fluent in both art markets.", icon: "M10 10a8 8 0 100-16 8 8 0 000 16zM10 6v4l3 3" },
]

/**
 * B2B sourcing features section for Global portal.
 */
export default function GlobalSourcingSection() {
  return (
    <section className="py-36 bg-kcb-steel">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <RevealOnScroll>
            <SectionLabel text="B2B Sourcing" />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-6">
              Source African Art for Your Programme
            </h2>
            <p className="text-[15px] leading-[1.8] text-kcb-pierre mb-10">
              Whether you're curating an exhibition, building a corporate collection, or scouting for a gallery programme — we connect you with verified African artists and handle everything from selection to delivery.
            </p>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline">
              Request Sourcing <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col gap-7">
              {FEATURES.map((f, i) => (
                <div key={i} className="flex gap-5">
                  <div className="w-10 h-10 shrink-0 border border-kcb-silver/15 flex items-center justify-center text-[var(--accent)]">
                    <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                      <path d={f.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white mb-1">{f.title}</div>
                    <div className="text-[13px] leading-relaxed text-kcb-pierre">{f.text}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
