/**
 * GlobalCuratorsSection.jsx — Professional features for art curators
 *
 * Positions Kucibok as infrastructure for curators to:
 * - Manage inventory
 * - Certify provenance
 * - Handle logistics
 * - Track valuations
 * - Govern multi-entity operations
 */

import { memo } from 'react'
import { FileText, Package, Truck, TrendingUp, Users } from 'lucide-react'
import { useLang } from '../../../store/LangContext'

const features = [
  {
    icon: Package,
    titleKey: 'inventory',
    descriptionKey: 'inventoryDesc',
  },
  {
    icon: FileText,
    titleKey: 'certification',
    descriptionKey: 'certificationDesc',
  },
  {
    icon: Truck,
    titleKey: 'logistics',
    descriptionKey: 'logisticsDesc',
  },
  {
    icon: TrendingUp,
    titleKey: 'valuation',
    descriptionKey: 'valuationDesc',
  },
  {
    icon: Users,
    titleKey: 'governance',
    descriptionKey: 'governanceDesc',
  },
]

export default memo(function GlobalCuratorsSection() {
  const { lang } = useLang()

  // TODO: Add translations to src/i18n/global.js
  const translations = {
    en: {
      heading: 'Curate. Certify. Scale.',
      subheading: 'Professional tools for curators managing African art operations globally',
      cta: 'See how certification works',
      features: {
        inventory: {
          title: 'Inventory Management Dashboard',
          description: 'Organize, track, and value your collection in real-time',
        },
        certification: {
          title: 'Digital Certification & Provenance',
          description: 'Issue KCB certificates and maintain complete provenance records',
        },
        logistics: {
          title: 'Logistics & Insurance Integration',
          description: 'Coordinate international shipping with built-in insurance',
        },
        valuation: {
          title: 'Real-time Valuation & Analytics',
          description: 'Track market trends and artwork valuations',
        },
        governance: {
          title: 'Multi-entity Governance',
          description: 'Manage permissions across team members and partner galleries',
        },
      },
    },
    fr: {
      heading: 'Organisez. Certifiez. Développez.',
      subheading: 'Outils professionnels pour les commissaires gérant des opérations d\'art africain mondialement',
      cta: 'Voir comment fonctionne la certification',
      features: {
        inventory: {
          title: 'Tableau de bord de gestion d\'inventaire',
          description: 'Organisez, suivez et évaluez votre collection en temps réel',
        },
        certification: {
          title: 'Certification numérique et traçabilité',
          description: 'Délivrez des certificats KCB et maintenez des dossiers complets de provenance',
        },
        logistics: {
          title: 'Intégration logistique et d\'assurance',
          description: 'Coordonnez les expéditions internationales avec assurance intégrée',
        },
        valuation: {
          title: 'Évaluation en temps réel et analyse',
          description: 'Suivi des tendances du marché et évaluations des œuvres d\'art',
        },
        governance: {
          title: 'Gouvernance multi-entités',
          description: 'Gérez les permissions entre les membres de l\'équipe et les galeries partenaires',
        },
      },
    },
  }

  const t = translations[lang] || translations.en

  return (
    <section className="py-20 lg:py-32 px-[clamp(24px,5vw,80px)] bg-kcb-noir-deep/30">
      <div className="max-w-[1280px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 lg:mb-24">
          <h2 className="font-playfair font-bold text-4xl lg:text-5xl text-white mb-4">
            {t.heading}
          </h2>
          <p className="text-kcb-sable text-lg max-w-2xl mx-auto">
            {t.subheading}
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-4 mb-12">
          {features.map((feature) => {
            const Icon = feature.icon
            const featureTrans = t.features[feature.titleKey]

            return (
              <div
                key={feature.titleKey}
                className="group bg-kcb-steel/40 hover:bg-kcb-steel/60 border border-kcb-silver/10 hover:border-kcb-or/30 rounded-[4px] p-6 transition-all duration-300"
              >
                {/* Icon */}
                <div className="mb-4">
                  <Icon className="w-8 h-8 text-kcb-or group-hover:text-kcb-silver-light transition-colors" />
                </div>

                {/* Title */}
                <h3 className="font-dm-sans font-semibold text-white text-sm lg:text-base mb-3">
                  {featureTrans.title}
                </h3>

                {/* Description */}
                <p className="text-kcb-sable text-xs lg:text-sm leading-relaxed">
                  {featureTrans.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* Interactive CTA */}
        <div className="text-center">
          <button className="inline-flex items-center gap-2 font-dm-sans font-semibold text-kcb-or hover:text-kcb-silver-light transition-colors group">
            <span>{t.cta}</span>
            <svg
              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  )
})
