/**
 * GlobalTestimonialsSection.jsx — Professional testimonials
 *
 * Quotes from curators, advisors, and collectors using Kucibok
 */

import { memo } from 'react'
import RevealOnScroll from '../RevealOnScroll'
import SectionLabel from '../SectionLabel'
import { useLang } from '../../../store/LangContext'

const TESTIMONIALS_EN = [
  {
    role: 'Curator',
    name: 'Sarah Okafor',
    company: 'Lagos Contemporary Gallery',
    quote:
      'Kucibok transformed how we manage our collection. Inventory tracking, certifications, and logistics all in one place. Our operations are 10x more efficient.',
    image: '🎨',
  },
  {
    role: 'Art Advisor',
    name: 'Marc Dubois',
    company: 'Dubois & Associates',
    quote:
      "The deal flow access is incredible. We've sourced €2.4M in artwork in 6 months through Kucibok's network. Commission tracking is seamless.",
    image: '📊',
  },
  {
    role: 'Collector',
    name: 'Amara Mensah',
    company: 'Private Collection',
    quote:
      'As a collector, I love the transparency. Every artwork comes with full provenance, certification, and authentication. No guessing. Pure trust.',
    image: '✨',
  },
]

const TESTIMONIALS_FR = [
  {
    role: 'Curator',
    name: 'Sarah Okafor',
    company: 'Lagos Contemporary Gallery',
    quote:
      'Kucibok a transformé notre gestion de collection. Suivi d\'inventaire, certifications, logistique — tout en un seul endroit. Nos opérations sont 10x plus efficaces.',
    image: '🎨',
  },
  {
    role: 'Conseiller en Art',
    name: 'Marc Dubois',
    company: 'Dubois & Associates',
    quote:
      'L\'accès au flux d\'affaires est incroyable. Nous avons sourcé €2.4M d\'œuvres en 6 mois via le réseau Kucibok. Le suivi des commissions est transparent.',
    image: '📊',
  },
  {
    role: 'Collectionneur',
    name: 'Amara Mensah',
    company: 'Collection Privée',
    quote:
      'En tant que collectionneur, j\'adore la transparence. Chaque œuvre vient avec provenance complète, certification et authentification. Zéro doute. Confiance totale.',
    image: '✨',
  },
]

export default memo(function GlobalTestimonialsSection() {
  const { lang } = useLang()
  const testimonials = lang === 'en' ? TESTIMONIALS_EN : TESTIMONIALS_FR
  const label = lang === 'en' ? 'Trusted by Professionals' : 'De Confiance des Professionnels'
  const title = lang === 'en' ? 'What Professionals Say' : 'Ce que Disent les Professionnels'

  return (
    <section className="py-20 lg:py-40 px-[clamp(24px,5vw,80px)] bg-kcb-noir-deep">
      <div className="max-w-[1280px] mx-auto">
        <RevealOnScroll>
          <div className="text-center mb-20 lg:mb-28">
            <SectionLabel text={label} />
            <h2 className="font-playfair font-bold text-[clamp(32px,4vw,48px)] text-white mt-6 mb-6">
              {title}
            </h2>
          </div>
        </RevealOnScroll>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((t, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className="bg-kcb-steel/40 border border-kcb-silver/10 rounded-[4px] p-8 flex flex-col h-full hover:border-kcb-or/20 transition-colors">
                {/* Avatar emoji + role */}
                <div className="text-5xl mb-4">{t.image}</div>

                {/* Role + company */}
                <div className="mb-6">
                  <div className="font-jetbrains text-[10px] tracking-[0.12em] uppercase text-[var(--accent)] mb-1">
                    {t.role}
                  </div>
                  <div className="font-playfair font-semibold text-white text-lg">{t.name}</div>
                  <div className="font-dm-sans text-sm text-kcb-sable">{t.company}</div>
                </div>

                {/* Quote */}
                <p className="text-[15px] leading-[1.8] text-kcb-pierre flex-1 border-l-2 border-[var(--accent)]/30 pl-4">
                  "{t.quote}"
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
})
