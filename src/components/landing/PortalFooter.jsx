import { Link } from "react-router-dom"

const FOOTER_CONFIG = {
  africa: {
    description: "Infrastructure de standardisation et de circulation securisee de l'art africain. Certification gratuite pour les artistes d'Afrique.",
    columns: [
      {
        title: "Plateforme",
        links: [
          { label: "Services", hash: "services" },
          { label: "Comment ca marche", hash: "timeline" },
          { label: "Temoignages", hash: "testimonials" },
          { label: "Artistes", to: "/artists" },
        ],
      },
      {
        title: "Ressources",
        links: [
          { label: "Blog", to: "/blog" },
          { label: "FAQ", to: "/faq" },
          { label: "Contact", to: "/contact" },
          { label: "Explorer", to: "/explore" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Confidentialite", to: "/privacy-policy" },
          { label: "CGV", to: "/sales-conditions" },
          { label: "CGU", to: "/terms-and-conditions" },
          { label: "Charte ethique", to: "/ethic-chart" },
        ],
      },
    ],
    copyright: "Kucibok — Art africain certifie",
  },
  global: {
    description: "The standard for African art certification and cross-border circulation. Curated catalogue, certified provenance, door-to-door logistics.",
    columns: [
      {
        title: "Platform",
        links: [
          { label: "Catalogue", hash: "catalogue" },
          { label: "Logistics", hash: "logistics" },
          { label: "Sourcing", hash: "sourcing" },
          { label: "Pricing", hash: "pricing" },
        ],
      },
      {
        title: "Resources",
        links: [
          { label: "Explore", to: "/explore" },
          { label: "Blog", to: "/blog" },
          { label: "FAQ", to: "/faq" },
          { label: "Contact", to: "/contact" },
        ],
      },
      {
        title: "Legal",
        links: [
          { label: "Privacy Policy", to: "/privacy-policy" },
          { label: "Terms", to: "/terms-and-conditions" },
          { label: "Sales Conditions", to: "/sales-conditions" },
          { label: "Ethics Charter", to: "/ethic-chart" },
        ],
      },
    ],
    copyright: "Kucibok — Certified African Art",
  },
}

/**
 * Portal-specific footer with 4-column layout.
 * @param {object} props
 * @param {"africa"|"global"} props.portal - Active portal
 */
export default function PortalFooter({ portal }) {
  const cfg = FOOTER_CONFIG[portal]

  return (
    <footer className="pt-20 pb-10 border-t border-white/[0.03]">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-3 no-underline mb-4">
              <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="h-7" />
              <span className="font-playfair font-bold text-base text-white tracking-[0.06em] uppercase">
                Kuci<span className="text-[var(--accent)]">bok</span>
              </span>
            </Link>
            <p className="text-[13px] text-kcb-pierre leading-[1.7] max-w-[300px]">
              {cfg.description}
            </p>
          </div>

          {/* Link columns */}
          {cfg.columns.map((col, i) => (
            <div key={i}>
              <h4 className="font-semibold text-[11px] tracking-[0.12em] uppercase text-kcb-pierre mb-5 font-dm-sans">
                {col.title}
              </h4>
              <ul className="list-none space-y-2.5">
                {col.links.map((link, j) => (
                  <li key={j}>
                    {link.hash ? (
                      <button
                        onClick={() => document.getElementById(link.hash)?.scrollIntoView({ behavior: "smooth" })}
                        className="text-[13px] text-kcb-pierre transition-colors hover:text-white"
                      >
                        {link.label}
                      </button>
                    ) : (
                      <Link
                        to={link.to}
                        className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/[0.03] gap-4">
          <p className="text-[11px] text-kcb-pierre">
            &copy; {new Date().getFullYear()} {cfg.copyright}
          </p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="text-[11px] text-kcb-pierre no-underline hover:text-kcb-sable transition-colors">
              {portal === "africa" ? "Confidentialite" : "Privacy"}
            </Link>
            <Link to="/terms-and-conditions" className="text-[11px] text-kcb-pierre no-underline hover:text-kcb-sable transition-colors">
              {portal === "africa" ? "CGU" : "Terms"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
