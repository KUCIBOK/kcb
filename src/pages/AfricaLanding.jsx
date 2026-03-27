import { Helmet } from "react-helmet"
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
    <>
      <Helmet>
        <title>Kucibok Africa — Plateforme de l'art africain certifié</title>
        <meta name="description" content="Découvrez, certifiez et vendez des œuvres d'art africain sur la plateforme Kucibok Africa. Certification Standard KCB, logistique transfrontalière, numérisation haute résolution." />
        <meta property="og:title" content="Kucibok Africa — Plateforme de l'art africain certifié" />
        <meta property="og:description" content="Découvrez, certifiez et vendez des œuvres d'art africain sur la plateforme Kucibok Africa." />
        <meta property="og:url" content="https://kucibok.com/africa" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <link rel="canonical" href="https://kucibok.com/africa" />
      </Helmet>
      <PortalLayout portal="africa">
        <AfricaContent />
      </PortalLayout>
    </>
  )
}
