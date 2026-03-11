import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"

/**
 * Final CTA section for Africa portal.
 */
export default function AfricaCtaSection() {
  return (
    <section className="py-40 text-center relative">
      {/* Decorative border */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-kcb-or/[0.03] pointer-events-none" />

      <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <RevealOnScroll>
          <h2 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] mb-5">
            Pret a certifier votre art ?
          </h2>
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <p className="text-[15px] text-kcb-pierre mb-12 max-w-[460px] mx-auto">
            Inscription gratuite. Premiere certification en moins de 48h. Rejoignez les 340 artistes du reseau.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link to="/sign-up" className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline">
              Creer mon compte artiste <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link to="/about" className="inline-flex items-center gap-2 bg-transparent text-[var(--accent)] font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 border border-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-kcb-noir no-underline">
              En savoir plus
            </Link>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
