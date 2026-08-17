/**
 * GlobalAdvisorsSection.jsx — Professional features for art advisors
 *
 * Positions Kucibok as infrastructure for advisors to:
 * - Manage client portfolios
 * - Access curated deal flow
 * - Leverage market intelligence
 * - Execute transactions securely
 * - Track commissions
 */

import { memo } from 'react'
import { Briefcase, TrendingUp, BarChart3, Lock, Percent } from 'lucide-react'
import { useLang } from '../../../store/LangContext'

const features = [
  {
    icon: Briefcase,
    titleKey: 'portfolio',
    descriptionKey: 'portfolioDesc',
  },
  {
    icon: TrendingUp,
    titleKey: 'dealflow',
    descriptionKey: 'dealflowDesc',
  },
  {
    icon: BarChart3,
    titleKey: 'intelligence',
    descriptionKey: 'intelligenceDesc',
  },
  {
    icon: Lock,
    titleKey: 'transactions',
    descriptionKey: 'transactionsDesc',
  },
  {
    icon: Percent,
    titleKey: 'commissions',
    descriptionKey: 'commissionsDesc',
  },
]

export default memo(function GlobalAdvisorsSection() {
  const { lang } = useLang()

  // TODO: Add translations to src/i18n/global.js
  const translations = {
    en: {
      heading: 'Invest. Advise. Build Portfolio.',
      subheading: 'Professional tools for advisors scaling their art advisory business globally',
      cta: 'Explore deal flow',
      features: {
        portfolio: {
          title: 'Client Portfolio Management',
          description: 'Track and manage client art collections with detailed records',
        },
        dealflow: {
          title: 'Curated Deal Flow & Sourcing',
          description: 'Access vetted artworks and connect with verified sellers',
        },
        intelligence: {
          title: 'Market Intelligence Dashboard',
          description: 'Monitor market trends, prices, and emerging artists',
        },
        transactions: {
          title: 'Secure Transaction Management',
          description: 'Handle offers, negotiations, and contracts seamlessly',
        },
        commissions: {
          title: 'Commission Tracking',
          description: 'Automated tracking and reporting of commissions and fees',
        },
      },
    },
    fr: {
      heading: 'Investissez. Conseillez. Construisez le portefeuille.',
      subheading: 'Outils professionnels pour les conseillers en art développant leur activité mondialement',
      cta: 'Explorez le flux d\'affaires',
      features: {
        portfolio: {
          title: 'Gestion du portefeuille client',
          description: 'Suivi et gestion des collections d\'art client avec dossiers détaillés',
        },
        dealflow: {
          title: 'Flux d\'affaires et sourçage curatés',
          description: 'Accès à des œuvres vérifiées et connexion avec les vendeurs',
        },
        intelligence: {
          title: 'Tableau de bord d\'intelligence de marché',
          description: 'Suivi des tendances du marché, des prix et des artistes émergents',
        },
        transactions: {
          title: 'Gestion des transactions sécurisée',
          description: 'Gestion des offres, négociations et contrats de manière fluide',
        },
        commissions: {
          title: 'Suivi des commissions',
          description: 'Suivi automatisé et rapports des commissions et frais',
        },
      },
    },
  }

  const t = translations[lang] || translations.en

  return (
    <section className="py-20 lg:py-32 px-[clamp(24px,5vw,80px)] bg-kcb-noir-deep">
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
