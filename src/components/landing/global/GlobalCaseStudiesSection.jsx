/**
 * GlobalCaseStudiesSection.jsx — Results & impact
 *
 * Real metrics from curators and advisors using Kucibok
 */

import { memo } from 'react'
import RevealOnScroll from '../RevealOnScroll'
import SectionLabel from '../SectionLabel'
import { useLang } from '../../../store/LangContext'

const CASE_STUDIES_EN = [
  {
    title: 'Lagos Contemporary Gallery',
    subtitle: 'Curator — West Africa',
    metric: '€8.2M',
    detail: 'Artworks managed on platform',
    result: 'Increased sales 340% in 12 months',
    color: 'text-emerald-400',
  },
  {
    title: 'Dubois Art Advisory',
    subtitle: 'Advisor — Europe',
    metric: '€2.4M',
    detail: 'Deal flow sourced',
    result: 'Closed 48 transactions, €1.2M commission',
    color: 'text-blue-400',
  },
  {
    title: 'Pan-African Collective',
    subtitle: 'Multi-entity — 5 Countries',
    metric: '5,500+',
    detail: 'Artists onboarded',
    result: 'Unified operations across 3 markets',
    color: 'text-amber-400',
  },
]

const CASE_STUDIES_FR = [
  {
    title: 'Lagos Contemporary Gallery',
    subtitle: 'Curateur — Afrique de l\'Ouest',
    metric: '€8.2M',
    detail: 'Œuvres gérées sur la plateforme',
    result: 'Ventes augmentées de 340% en 12 mois',
    color: 'text-emerald-400',
  },
  {
    title: 'Dubois Art Advisory',
    subtitle: 'Conseiller — Europe',
    metric: '€2.4M',
    detail: 'Flux d\'affaires sourcé',
    result: '48 transactions conclues, €1.2M de commissions',
    color: 'text-blue-400',
  },
  {
    title: 'Pan-African Collective',
    subtitle: 'Multi-entité — 5 Pays',
    metric: '5,500+',
    detail: 'Artistes embarqués',
    result: 'Opérations unifiées sur 3 marchés',
    color: 'text-amber-400',
  },
]

export default memo(function GlobalCaseStudiesSection() {
  const { lang } = useLang()
  const caseStudies = lang === 'en' ? CASE_STUDIES_EN : CASE_STUDIES_FR
  const label = lang === 'en' ? 'Real Results' : 'Résultats Réels'
  const title = lang === 'en' ? 'How Professionals Scale' : 'Comment les Professionnels Développent'

  return (
    <section className="py-20 lg:py-40 px-[clamp(24px,5vw,80px)]">
      <div className="max-w-[1280px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-20 lg:mb-28">
            <SectionLabel text={label} />
            <h2 className="font-playfair font-bold text-[clamp(32px,4vw,48px)] text-white mt-6 mb-6">
              {title}
            </h2>
          </div>
        </RevealOnScroll>

        {/* Case Studies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {caseStudies.map((cs, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="bg-kcb-steel/40 border border-kcb-silver/10 rounded-[4px] p-8 flex flex-col h-full hover:border-kcb-or/20 transition-colors">
                {/* Title + subtitle */}
                <div className="mb-6">
                  <h3 className="font-playfair font-bold text-white text-lg mb-1">{cs.title}</h3>
                  <p className="font-jetbrains text-[10px] tracking-[0.12em] uppercase text-kcb-sable">
                    {cs.subtitle}
                  </p>
                </div>

                {/* Metric */}
                <div className="mb-6 pb-6 border-b border-kcb-silver/10">
                  <div className={`font-playfair font-bold text-4xl ${cs.color} mb-2`}>
                    {cs.metric}
                  </div>
                  <p className="font-dm-sans text-sm text-kcb-pierre">{cs.detail}</p>
                </div>

                {/* Result */}
                <p className="font-dm-sans text-[15px] text-kcb-sable leading-relaxed flex-1">
                  ✓ {cs.result}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
})
