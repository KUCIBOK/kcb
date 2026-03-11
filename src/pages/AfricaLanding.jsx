import PortalLayout from "../components/landing/PortalLayout"
import PortalHero from "../components/landing/PortalHero"
import PillarSection from "../components/landing/PillarSection"
import GeoLine from "../components/landing/GeoLine"
import HeroKuzi from "../components/landing/africa/HeroKuzi"
import AfricaServicesSection from "../components/landing/africa/AfricaServicesSection"
import AfricaTimelineSection from "../components/landing/africa/AfricaTimelineSection"
import AfricaTestimonialsSection from "../components/landing/africa/AfricaTestimonialsSection"
import AfricaCtaSection from "../components/landing/africa/AfricaCtaSection"

const PILLARS = [
  { num: "01", title: "Certification gratuite", text: "Identifiant KCB unique, certificat d'authenticite, fiche de provenance. Sans frais." },
  { num: "02", title: "Logistique vers le monde", text: "De votre atelier aux galeries du monde entier. Emballage, douanes, assurance, tracking." },
  { num: "03", title: "Visibilite internationale", text: "Vos oeuvres certifiees sur le Portail Global. Collectionneurs et galeries d'Europe." },
]

/**
 * Africa portal landing page.
 * Standalone route at /africa — uses PortalLayout with gold accent theme.
 */
export default function AfricaLanding() {
  return (
    <PortalLayout portal="africa">
      <PortalHero
        label="Portail Afrique"
        title={<>Votre art merite<br />un standard <em className="italic text-[var(--accent)]">mondial</em></>}
        subtitle="Certifiez vos oeuvres, accedez a un reseau international de collectionneurs et beneficiez d'une logistique specialisee. Gratuitement."
        actions={[
          { text: "Creer mon compte artiste", to: "/sign-up", primary: true },
          { text: "Comment ca marche", onClick: () => document.getElementById("timeline")?.scrollIntoView({ behavior: "smooth" }) },
        ]}
      >
        <HeroKuzi />
      </PortalHero>

      <PillarSection pillars={PILLARS} portal="africa" />
      <GeoLine />
      <AfricaServicesSection />
      <GeoLine />
      <AfricaTimelineSection />
      <AfricaTestimonialsSection />
      <AfricaCtaSection />
    </PortalLayout>
  )
}
