import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import RevealOnScroll from '../RevealOnScroll'
import SectionLabel from '../SectionLabel'
import { useLang } from '../../../store/LangContext'
import { globalT } from '../../../i18n/global'
import { getAllPlans } from '../../../api/usePlans'

export default function GlobalPricingSection() {
  const { lang } = useLang()
  const t = globalT[lang].pricing

  const [planIds, setPlanIds] = useState({})
  useEffect(() => {
    getAllPlans().then((plans) => {
      if (!Array.isArray(plans)) return
      const map = {}
      const buyerPlans = plans.filter((p) => p.role === 'buyer' || !p.role)
      buyerPlans.forEach((p) => {
        const n = (p.name ?? '').toLowerCase()
        if (n.includes('starter') || n.includes('explorer') || p.price === 27) {
          if (!map[27] || p.currency === 'EUR') map[27] = p.id
        } else if (n.includes('premium') || p.price === 67) {
          if (!map[67] || p.currency === 'EUR') map[67] = p.id
        } else if (n.includes('institutional') || n.includes('enterprise') || p.price === 147) {
          if (!map[147] || p.currency === 'EUR') map[147] = p.id
        }
      })
      setPlanIds(map)
    })
  }, [])

  const ctaTo = (plan) => {
    const price = parseInt(plan.price, 10)
    if (!isNaN(price) && planIds[price]) return `/subscription-checkout/${planIds[price]}`
    return plan.cta.to
  }

  return (
    <section id="pricing" className="py-16 md:py-36 bg-kcb-ivoire text-kcb-noir">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <RevealOnScroll>
          <div className="text-center mb-20">
            <div className="font-jetbrains text-[10px] tracking-[0.25em] uppercase text-kcb-silver-dark inline-flex items-center gap-4">
              <span className="block w-12 h-px bg-kcb-silver-dark" />
              {t.label}
            </div>
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-kcb-noir mt-6">
              {t.title}
            </h2>
            <p className="text-[15px] text-kcb-pierre mt-3 max-w-[440px] mx-auto">{t.subtitle}</p>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px max-w-[1100px] mx-auto">
          {t.plans.map((plan, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div
                className={`p-6 md:p-8 lg:p-11 flex flex-col h-full relative ${plan.featured ? 'bg-kcb-steel text-white' : 'bg-white'}`}
              >
                {plan.featured && (
                  <div className="absolute top-0 left-0 right-0 h-0.5 bg-kcb-silver" />
                )}
                <div className="font-playfair font-semibold text-xl mb-1.5">{plan.name}</div>
                <div
                  className={`text-xs mb-7 ${plan.featured ? 'text-kcb-sable' : 'text-kcb-pierre'}`}
                >
                  {plan.desc}
                </div>
                <div className="font-playfair font-bold text-4xl mb-1">
                  {plan.price}
                  {plan.priceSuffix && (
                    <span className="text-sm font-normal font-dm-sans">{plan.priceSuffix}</span>
                  )}
                </div>
                <div
                  className={`text-xs mb-7 ${plan.featured ? 'text-kcb-sable' : 'text-kcb-pierre'}`}
                >
                  {plan.period}
                </div>
                <ul className="list-none flex-1 mb-7 space-y-0">
                  {plan.features.map((f, j) => (
                    <li
                      key={j}
                      className={`py-2 text-[13px] flex items-center gap-2.5 border-b ${plan.featured ? 'text-kcb-sable border-white/[0.04]' : 'text-kcb-pierre border-black/[0.04]'}`}
                    >
                      <span className="w-[5px] h-[5px] bg-[var(--accent)] shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  to={ctaTo(plan)}
                  className={`w-full text-center inline-flex items-center justify-center gap-2 font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all no-underline ${
                    plan.featured
                      ? 'bg-kcb-silver text-kcb-noir-deep hover:bg-kcb-silver-light'
                      : 'bg-transparent border border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-kcb-noir'
                  }`}
                >
                  {plan.cta.label} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
