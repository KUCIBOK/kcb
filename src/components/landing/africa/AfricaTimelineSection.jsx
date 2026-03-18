import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { africaT } from "../../../i18n/africa"

/**
 * 4-step onboarding timeline for Africa portal.
 */
export default function AfricaTimelineSection() {
  const { lang } = useLang()
  const t = africaT[lang].timeline

  return (
    <section id="timeline" className="py-16 md:py-36">
      <div className="max-w-[1280px] mx-auto px-[clamp(16px,5vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 lg:gap-32 items-center">
          <RevealOnScroll>
            <SectionLabel text={t.label} />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-6">
              {t.title}
            </h2>
            <p className="text-[15px] leading-[1.8] text-kcb-pierre mb-10">
              {t.desc}
            </p>
            <Link to="/sign-up?role=artist" className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline">
              {t.cta} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col">
              {t.steps.map((step, i) => (
                <div
                  key={i}
                  className="py-4 md:py-6 px-4 md:px-7 flex items-start gap-4 md:gap-6 border-l border-kcb-or/[0.08] transition-all hover:border-l-[var(--accent)] hover:bg-kcb-or/[0.02]"
                >
                  <div className="font-jetbrains text-[10px] text-[var(--accent)] tracking-[0.15em] w-14 shrink-0 pt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{step.title}</div>
                    <div className="text-[13px] text-kcb-pierre mt-1">{step.desc}</div>
                    <div className="font-jetbrains text-[10px] text-kcb-sable mt-1.5 tracking-[0.06em]">{step.duration}</div>
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
