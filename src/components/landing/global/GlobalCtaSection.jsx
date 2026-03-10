import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"

/**
 * Final CTA section for Global portal.
 */
export default function GlobalCtaSection() {
  return (
    <section className="py-40 text-center relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-kcb-silver/[0.03] pointer-events-none" />

      <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <RevealOnScroll>
          <h2 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] mb-5">
            Access the Collection
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-[15px] text-kcb-pierre mb-12 max-w-[460px] mx-auto">
            Join collectors, curators, and institutions sourcing certified African art through the Kucibok standard.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/sign-up" className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline">
              Create Account <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center gap-2 bg-transparent text-[var(--accent)] font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 border border-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-kcb-noir-deep no-underline">
              Contact Sales
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
