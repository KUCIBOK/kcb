import { ArrowRight } from 'lucide-react'
import RevealOnScroll from '../RevealOnScroll'
import SectionLabel from '../SectionLabel'
import CorridorMapSvg from '../svg/CorridorMapSvg'
import { useLang } from '../../../store/LangContext'
import { globalT } from '../../../i18n/global'

/**
 * Logistics corridor section with world map for Global portal.
 * Map shows animated routes from West Africa to all major continents.
 */
export default function GlobalLogisticsSection() {
  const { lang } = useLang()
  const t = globalT[lang].logistics

  return (
    <section id="logistics" className="py-16 md:py-36">
      {/* Header — constrained */}
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="flex justify-between items-end mb-16 flex-wrap gap-6">
          <RevealOnScroll>
            <SectionLabel text={t.label} />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-3">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.8] text-kcb-pierre max-w-[520px]">{t.desc}</p>
          </RevealOnScroll>
          <RevealOnScroll>
            <button
              onClick={() =>
                document.getElementById('simulator')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px"
            >
              {t.cta} <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </RevealOnScroll>
        </div>
      </div>

      {/* World map — true full width */}
      <RevealOnScroll>
        <div className="w-full mb-16">
          <CorridorMapSvg />
        </div>
      </RevealOnScroll>

      {/* Steps — constrained */}
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0.5">
          {t.steps.map((step, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="bg-kcb-noir py-6 md:py-8 px-4 md:px-7 relative overflow-hidden group transition-colors hover:bg-kcb-silver/[0.02]">
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <div className="font-jetbrains text-[10px] text-[var(--accent)] tracking-[0.15em] mb-3">
                  {step.num}
                </div>
                <div className="font-semibold text-sm text-white mb-1.5">{step.title}</div>
                <div className="text-xs text-kcb-pierre leading-relaxed">{step.desc}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
