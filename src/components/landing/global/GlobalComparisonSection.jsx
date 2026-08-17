/**
 * GlobalComparisonSection.jsx — Plan comparison
 *
 * Feature comparison: Curator vs Advisor vs Enterprise
 */

import { memo } from 'react'
import RevealOnScroll from '../RevealOnScroll'
import SectionLabel from '../SectionLabel'
import { useLang } from '../../../store/LangContext'

const FEATURES_EN = [
  { category: 'Inventory & Certification', curator: true, advisor: false, enterprise: true },
  { category: 'Portfolio Management', curator: false, advisor: true, enterprise: true },
  { category: 'Deal Flow Access', curator: false, advisor: true, enterprise: true },
  { category: 'Market Intelligence', curator: true, advisor: true, enterprise: true },
  { category: 'Logistics Integration', curator: true, advisor: false, enterprise: true },
  { category: 'Commission Tracking', curator: false, advisor: true, enterprise: true },
  { category: 'Multi-entity Governance', curator: false, advisor: false, enterprise: true },
  { category: 'API Access', curator: false, advisor: false, enterprise: true },
  { category: 'Dedicated Account Manager', curator: false, advisor: false, enterprise: true },
]

const FEATURES_FR = [
  { category: 'Inventaire & Certification', curator: true, advisor: false, enterprise: true },
  { category: 'Gestion Portefeuille', curator: false, advisor: true, enterprise: true },
  { category: 'Accès Flux d\'Affaires', curator: false, advisor: true, enterprise: true },
  { category: 'Intelligence Marché', curator: true, advisor: true, enterprise: true },
  { category: 'Intégration Logistique', curator: true, advisor: false, enterprise: true },
  { category: 'Suivi Commissions', curator: false, advisor: true, enterprise: true },
  { category: 'Gouvernance Multi-Entité', curator: false, advisor: false, enterprise: true },
  { category: 'Accès API', curator: false, advisor: false, enterprise: true },
  { category: 'Gestionnaire Compte Dédié', curator: false, advisor: false, enterprise: true },
]

export default memo(function GlobalComparisonSection() {
  const { lang } = useLang()
  const features = lang === 'en' ? FEATURES_EN : FEATURES_FR
  const label = lang === 'en' ? 'Plan Comparison' : 'Comparaison Plans'
  const title = lang === 'en' ? 'Choose the Right Plan' : 'Choisissez le Bon Plan'
  const curatorLabel = lang === 'en' ? 'Curator' : 'Curateur'
  const advisorLabel = lang === 'en' ? 'Advisor' : 'Conseiller'
  const enterpriseLabel = lang === 'en' ? 'Enterprise' : 'Entreprise'

  return (
    <section className="py-20 lg:py-40 px-[clamp(24px,5vw,80px)] bg-kcb-ivoire text-kcb-noir">
      <div className="max-w-[1280px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-20 lg:mb-28">
            <SectionLabel text={label} />
            <h2 className="font-playfair font-bold text-[clamp(32px,4vw,48px)] text-kcb-noir mt-6 mb-6">
              {title}
            </h2>
          </div>
        </RevealOnScroll>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-kcb-silver/20">
                <th className="font-playfair font-bold text-lg text-kcb-noir pb-6 pr-6">
                  Features
                </th>
                <th className="font-playfair font-bold text-lg text-kcb-noir pb-6 px-4 text-center">
                  {curatorLabel}
                </th>
                <th className="font-playfair font-bold text-lg text-kcb-noir pb-6 px-4 text-center">
                  {advisorLabel}
                </th>
                <th className="font-playfair font-bold text-lg text-kcb-noir pb-6 px-4 text-center">
                  {enterpriseLabel}
                </th>
              </tr>
            </thead>
            <tbody>
              {features.map((f, i) => (
                <tr
                  key={i}
                  className="border-b border-kcb-silver/[0.08] hover:bg-kcb-steel/20 transition-colors"
                >
                  <td className="font-dm-sans text-[15px] text-kcb-noir py-4 pr-6">{f.category}</td>
                  <td className="text-center py-4 px-4">
                    {f.curator ? (
                      <span className="text-emerald-600 text-lg">✓</span>
                    ) : (
                      <span className="text-kcb-pierre/30">—</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {f.advisor ? (
                      <span className="text-emerald-600 text-lg">✓</span>
                    ) : (
                      <span className="text-kcb-pierre/30">—</span>
                    )}
                  </td>
                  <td className="text-center py-4 px-4">
                    {f.enterprise ? (
                      <span className="text-emerald-600 text-lg">✓</span>
                    ) : (
                      <span className="text-kcb-pierre/30">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
})
