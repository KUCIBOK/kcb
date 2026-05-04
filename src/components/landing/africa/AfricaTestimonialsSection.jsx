import RevealOnScroll from '../RevealOnScroll'
import SectionLabel from '../SectionLabel'
import { useLang } from '../../../store/LangContext'
import { africaT } from '../../../i18n/africa'

/**
 * Testimonials section with ivory background for Africa portal.
 */
export default function AfricaTestimonialsSection() {
  const { lang } = useLang()
  const t = africaT[lang].testimonials

  return (
    <section id="testimonials" className="py-16 md:py-36 bg-kcb-ivoire text-kcb-noir">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <RevealOnScroll>
          <div className="mb-20">
            <div className="font-jetbrains text-[10px] tracking-[0.25em] uppercase text-kcb-bronze inline-flex items-center gap-4">
              <span className="block w-12 h-px bg-kcb-bronze" />
              {t.sectionLabel}
            </div>
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-kcb-noir mt-6">
              {t.heading}
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0.5">
          {/* Featured — first item, spans full height on left */}
          <RevealOnScroll delay={0}>
            <div className="bg-white p-6 md:p-10 lg:p-14 flex flex-col justify-center h-full">
              <span className="block font-playfair text-5xl md:text-6xl text-kcb-or leading-[0.6] mb-4 md:mb-5 not-italic">
                &ldquo;
              </span>
              <blockquote className="font-playfair italic text-lg md:text-2xl leading-snug text-kcb-noir mb-6 md:mb-8">
                {t.items[0].quote}
              </blockquote>
              <div className="font-semibold text-[13px]">{t.items[0].author}</div>
              <div className="text-xs text-kcb-pierre mt-0.5">{t.items[0].role}</div>
            </div>
          </RevealOnScroll>

          {/* Right column — 3 stacked cards */}
          <div className="flex flex-col gap-0.5">
            {t.items.slice(1).map((item, i) => (
              <RevealOnScroll key={item.author} delay={(i + 1) * 0.1}>
                <div className="bg-white p-5 md:p-8 flex flex-col justify-center h-full">
                  <span className="block font-playfair text-4xl text-kcb-or leading-[0.6] mb-3 not-italic">
                    &ldquo;
                  </span>
                  <blockquote className="font-playfair italic text-[15px] leading-snug text-kcb-noir mb-5">
                    {item.quote}
                  </blockquote>
                  <div className="font-semibold text-[12px]">{item.author}</div>
                  <div className="text-[11px] text-kcb-pierre mt-0.5">{item.role}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
