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
          { text: t.hero.cta1, onClick: () => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" }), primary: true },
          { text: t.hero.cta2, to: "/global/enterprise" },
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
    <PortalLayout portal="global">
      <GlobalContent />
    </PortalLayout>
  )
}
