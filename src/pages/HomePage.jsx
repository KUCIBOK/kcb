import { Helmet } from 'react-helmet'
import { memo } from 'react'
import PortalLayout from '../components/landing/PortalLayout'
import PortalHero from '../components/landing/PortalHero'
import GlobalCuratorsSection from '../components/landing/global/GlobalCuratorsSection'
import GlobalAdvisorsSection from '../components/landing/global/GlobalAdvisorsSection'
import GlobalLogisticsSection from '../components/landing/global/GlobalLogisticsSection'
import LogisticsSimulatorSection from '../components/landing/global/LogisticsSimulatorSection'
import GlobalPricingSection from '../components/landing/global/GlobalPricingSection'
import GlobalCtaSection from '../components/landing/global/GlobalCtaSection'
import GeoLine from '../components/landing/GeoLine'
import { useLang } from '../store/LangContext'
import { globalT } from '../i18n/global'

/**
 * HomePage — Professional Infrastructure Landing
 *
 * Audience: Curators, Advisors, Institutions
 * Message: Trade, scale, and manage African art on one platform
 */

function HomeContent() {
  const { lang } = useLang()
  const t = globalT[lang]

  return (
    <>
      {/* ─── HERO ─────────────────────────────────────────────────────────── */}
      <PortalHero
        label={t.hero.label}
        title={
          <>
            {t.hero.title1}
            <br />
            {t.hero.title2} <em className="italic text-kcb-silver-light">{t.hero.titleAccent}</em>
          </>
        }
        subtitle={t.hero.subtitle}
        actions={[
          { text: t.hero.cta1, to: '/global', primary: true },
          { text: t.hero.cta2, to: '/global/sourcing' },
        ]}
      />
      <GeoLine />

      {/* ─── FOR CURATORS (Quick Overview) ──────────────────────────────── */}
      <GlobalCuratorsSection />
      <GeoLine />

      {/* ─── FOR ADVISORS (Quick Overview) ──────────────────────────────── */}
      <GlobalAdvisorsSection />
      <GeoLine />

      {/* ─── TRY THE PLATFORM (Interactive Demos) ─────────────────────── */}
      <GlobalLogisticsSection />
      <GeoLine />
      <LogisticsSimulatorSection />
      <GeoLine />

      {/* ─── PRICING ────────────────────────────────────────────────────── */}
      <GlobalPricingSection />
      <GeoLine />

      {/* ─── FINAL CTA ──────────────────────────────────────────────────── */}
      <GlobalCtaSection />
    </>
  )
}

export default memo(function HomePage() {
  return (
    <>
      <Helmet>
        <title>Kucibok — Professional Infrastructure for African Art</title>
        <meta
          name="description"
          content="Trade, scale, and manage African art globally. Complete infrastructure for curators, advisors, and institutions. Certification, logistics, transactions."
        />
        <meta
          property="og:title"
          content="Kucibok — Professional Infrastructure for African Art"
        />
        <meta
          property="og:description"
          content="The only SaaS platform connecting curators, advisors, and institutions to trade and scale African art globally."
        />
        <meta property="og:url" content="https://kucibok.com/" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kucibok.com/" />
      </Helmet>
      <PortalLayout portal="global">
        <HomeContent />
      </PortalLayout>
    </>
  )
})
