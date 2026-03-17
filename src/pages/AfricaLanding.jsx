import PortalLayout from "../components/landing/PortalLayout"
import PortalHero from "../components/landing/PortalHero"
import PillarSection from "../components/landing/PillarSection"
import GeoLine from "../components/landing/GeoLine"
import HeroKuzi from "../components/landing/africa/HeroKuzi"
import AfricaStatsStrip from "../components/landing/africa/AfricaStatsStrip"
import AfricaFeatureSection from "../components/landing/africa/AfricaFeatureSection"
import AfricaCertSection from "../components/landing/africa/AfricaCertSection"
import AfricaTimelineSection from "../components/landing/africa/AfricaTimelineSection"
import AfricaTestimonialsSection from "../components/landing/africa/AfricaTestimonialsSection"
import AfricaCtaSection from "../components/landing/africa/AfricaCtaSection"
import { useLang } from "../store/LangContext"
import { africaT } from "../i18n/africa"

function AfricaContent() {
  const { lang } = useLang()
  const t = africaT[lang]

  return (
    <>
      <PortalHero
        label={t.hero.label}
        title={
          <>
            {t.hero.title1}<br />
            {t.hero.title2} <em className="italic text-[var(--accent)]">{t.hero.titleAccent}</em>
          </>
        }
        subtitle={t.hero.subtitle}
        actions={[
          { text: t.hero.cta1, to: "/sign-up?role=artist", primary: true },
          { text: t.hero.cta2, onClick: () => document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }) },
        ]}
      >
        <HeroKuzi />
      </PortalHero>

      <AfricaStatsStrip />
      <PillarSection pillars={t.pillars} portal="africa" />
      <GeoLine />
      <div id="dashboard">
        <AfricaFeatureSection />
      </div>
      <GeoLine />
      <AfricaCertSection />
      <GeoLine />
      <AfricaTimelineSection />
      <AfricaTestimonialsSection />
      <AfricaCtaSection />
    </>
  )
}

/**
 * Africa portal landing page.
 * Standalone route at /africa — uses PortalLayout with gold accent theme.
 */
export default function AfricaLanding() {
  return (
    <PortalLayout portal="africa">
      <AfricaContent />
    </PortalLayout>
  )
}
