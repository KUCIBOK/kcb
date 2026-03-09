import { Link } from "react-router-dom"

const themeConfig = {
  africa: {
    accentText: "text-amber-400",
    accentHover: "hover:text-amber-400",
    portalHref: "/global",
    portalLabel: "Portail Global",
    divider: "border-amber-900/20",
  },
  global: {
    accentText: "text-indigo-400",
    accentHover: "hover:text-indigo-400",
    portalHref: "/africa",
    portalLabel: "Portail Africa",
    divider: "border-indigo-900/20",
  },
}

const footerLinks = [
  { label: "À propos", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Confidentialité", href: "/privacy-policy" },
  { label: "Conditions", href: "/terms-and-conditions" },
]

export function UniverseFooter({ theme = "africa" }) {
  const cfg = themeConfig[theme] ?? themeConfig.africa
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 border-t border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + portal switcher */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <div className="flex items-center gap-2">
              <img
                src="/images/kucibok-white-logo.svg"
                alt="Kucibok"
                className="h-7 w-auto"
                onError={(e) => { e.currentTarget.style.display = "none" }}
              />
              <span className="font-playfair text-white text-base font-semibold">Kucibok</span>
            </div>
            <Link
              to={cfg.portalHref}
              className={`text-xs text-gray-500 ${cfg.accentHover} transition-colors`}
            >
              → {cfg.portalLabel}
            </Link>
          </div>

          {/* Nav links */}
          <nav className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            {footerLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm text-gray-400 ${cfg.accentHover} transition-colors`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Divider */}
        <div className={`mt-8 pt-6 border-t ${cfg.divider} flex flex-col sm:flex-row items-center justify-between gap-2`}>
          <p className="text-xs text-gray-500">
            &copy; {currentYear} Kucibok. Tous droits réservés.
          </p>
          <p className="text-xs text-gray-600">
            Infrastructure digitale de l&apos;art africain
          </p>
        </div>
      </div>
    </footer>
  )
}

export default UniverseFooter
