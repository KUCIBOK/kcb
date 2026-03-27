import { Helmet } from "react-helmet"
import PortalLayout from "../components/landing/PortalLayout"
import PortalHero from "../components/landing/PortalHero"
import PillarSection from "../components/landing/PillarSection"
import GeoLine from "../components/landing/GeoLine"
import HeroShowcase from "../components/landing/global/HeroShowcase"
import GlobalCatalogueSection from "../components/landing/global/GlobalCatalogueSection"
import GlobalLogisticsSection from "../components/landing/global/GlobalLogisticsSection"
import LogisticsSimulatorSection from "../components/landing/global/LogisticsSimulatorSection"
import GlobalSourcingSection from "../components/landing/global/GlobalSourcingSection"
import GlobalPricingSection from "../components/landing/global/GlobalPricingSection"
import GlobalCtaSection from "../components/landing/global/GlobalCtaSection"
import { useLang } from "../store/LangContext"
import { globalT } from "../i18n/global"

function GlobalContent() {
  const { lang } = useLang()
  const t = globalT[lang]

  return (
    <>
      <PortalHero
        label={t.hero.label}
        title={
          <>
            {t.hero.title1}<br />
            {t.hero.title2} <em className="italic text-kcb-silver-light">{t.hero.titleAccent}</em>
          </>
        }
        subtitle={t.hero.subtitle}
        actions={[
          { text: t.hero.cta1, to: "/global/catalogue", primary: true },
          { text: t.hero.cta2, to: "/global/sourcing" },
        ]}
      >
        <HeroShowcase />
      </PortalHero>

      <PillarSection pillars={t.pillars} portal="global" />
      <GeoLine />
      <GlobalCatalogueSection />
      <GeoLine />
      <GlobalLogisticsSection />
      <GeoLine />
      <LogisticsSimulatorSection />
      <GlobalSourcingSection />
      <GlobalPricingSection />
      <GlobalCtaSection />
    </>
  )
}

/**
 * Global portal landing page.
 * Standalone route at /global — uses PortalLayout with silver accent theme.
 */
export default function GlobalPage() {
  return (
    <>
      <Helmet>
        <title>Kucibok Global — Premium African Art for International Collectors</title>
        <meta name="description" content="Kucibok Global — Access certified African art with international logistics, provenance tracking, and B2B sourcing for galleries and collectors worldwide." />
        <meta property="og:title" content="Kucibok Global — Premium African Art for International Collectors" />
        <meta property="og:description" content="Access certified African art with international logistics, provenance tracking, and B2B sourcing." />
        <meta property="og:url" content="https://kucibok.com/global" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kucibok.com/global" />
      </Helmet>
      <PortalLayout portal="global">
        <GlobalContent />
      </PortalLayout>
    </>
  )
}
