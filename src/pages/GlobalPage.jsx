import PortalLayout from "../components/landing/PortalLayout"
import PortalHero from "../components/landing/PortalHero"
import PillarSection from "../components/landing/PillarSection"
import GeoLine from "../components/landing/GeoLine"
import HeroShowcase from "../components/landing/global/HeroShowcase"
import GlobalCatalogueSection from "../components/landing/global/GlobalCatalogueSection"
import GlobalLogisticsSection from "../components/landing/global/GlobalLogisticsSection"
import GlobalSourcingSection from "../components/landing/global/GlobalSourcingSection"
import GlobalPricingSection from "../components/landing/global/GlobalPricingSection"
import GlobalCtaSection from "../components/landing/global/GlobalCtaSection"

const PILLARS = [
  { num: "01", title: "KCB Certification", text: "Unique identifier, provenance record, certificate of authenticity. Verified by our expert team." },
  { num: "02", title: "Door-to-Door Logistics", text: "Specialized art shipping from West Africa to Europe. Insurance, customs, real-time tracking." },
  { num: "03", title: "B2B Sourcing", text: "Access our network of verified African artists for exhibitions, fairs, and private collections." },
]

/**
 * Global portal landing page.
 * Standalone route at /global — uses PortalLayout with silver accent theme.
 */
export default function GlobalPage() {
  return (
    <PortalLayout portal="global">
      <PortalHero
        label="Global Portal"
        title={<>The Standard for<br />African Art <em className="italic text-kcb-silver-light">Circulation</em></>}
        subtitle="Access a curated catalogue of certified African contemporary art. Every piece verified. Every artist documented. Every shipment insured."
        actions={[
          { text: "Browse Catalogue", onClick: () => document.getElementById("catalogue")?.scrollIntoView({ behavior: "smooth" }), primary: true },
          { text: "Request Sourcing", to: "/global/enterprise" },
        ]}
      >
        <HeroShowcase />
      </PortalHero>

      <PillarSection pillars={PILLARS} portal="global" />
      <GeoLine />
      <GlobalCatalogueSection />
      <GeoLine />
      <GlobalLogisticsSection />
      <GlobalSourcingSection />
      <GlobalPricingSection />
      <GlobalCtaSection />
    </PortalLayout>
  )
}
