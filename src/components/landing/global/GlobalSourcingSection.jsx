import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { globalT } from "../../../i18n/global"

/**
 * B2B sourcing features section for Global portal.
 */
export default function GlobalSourcingSection() {
  const { lang } = useLang()
  const t = globalT[lang].sourcing

  return (
    <section className="py-16 md:py-36 bg-kcb-steel">
      <div className="max-w-[1280px] mx-auto px-[clamp(16px,5vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-24 items-center">
          <RevealOnScroll>
            <SectionLabel text={t.label} />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-6">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.8] text-kcb-pierre mb-10">
              {t.desc}
            </p>
            <Link to="/global/sourcing" className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline">
              {t.cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col gap-7">
              {t.features.map((f, i) => (
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
