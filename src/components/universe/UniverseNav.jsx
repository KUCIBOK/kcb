import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X, ArrowRight } from "lucide-react"

const themeConfig = {
  africa: {
    wrapper: "bg-gray-900/85 border-amber-900/30",
    hoverLink: "hover:text-amber-400",
    activeLink: "text-amber-400",
    portalLabel: "text-amber-400",
    portalLabelText: "Africa",
    portalSwitcherLabel: "→ Portail Global",
    portalSwitcherHref: "/global",
    gradientBtn: "bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-gray-900",
    mobileMenuBg: "bg-gray-900 border-amber-900/30",
  },
  global: {
    wrapper: "bg-[#23243a]/90 border-indigo-900/30",
    hoverLink: "hover:text-indigo-400",
    activeLink: "text-indigo-400",
    portalLabel: "text-indigo-400",
    portalLabelText: "Global",
    portalSwitcherLabel: "→ Portail Africa",
    portalSwitcherHref: "/africa",
    gradientBtn: "bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 text-white",
    mobileMenuBg: "bg-[#23243a] border-indigo-900/30",
  },
}

export function UniverseNav({ theme = "africa", navLinks = [], scrollLinks = [], portalSwitcher = false }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const cfg = themeConfig[theme] ?? themeConfig.africa

  const handleScrollTo = (id) => {
    setMobileOpen(false)
    const el = document.getElementById(id)
    if (el) el.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b backdrop-blur-md ${cfg.wrapper}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src="/images/kucibok-white-logo.svg"
              alt="Kucibok"
              className="h-8 w-auto"
              onError={(e) => { e.currentTarget.style.display = "none" }}
            />
            <span className="font-playfair text-white text-lg font-semibold leading-none">
              Kucibok
            </span>
            <span className={`text-xs font-medium uppercase tracking-widest ${cfg.portalLabel}`}>
              {cfg.portalLabelText}
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-sm text-gray-300 transition-colors ${cfg.hoverLink}`}
              >
                {link.label}
              </Link>
            ))}
            {scrollLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleScrollTo(link.id)}
                className={`text-sm text-gray-300 transition-colors ${cfg.hoverLink} bg-transparent border-0 cursor-pointer`}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* Desktop right actions */}
          <div className="hidden md:flex items-center gap-3">
            {portalSwitcher && (
              <Link
                to={cfg.portalSwitcherHref}
                className={`text-xs text-gray-400 ${cfg.hoverLink} transition-colors flex items-center gap-1`}
              >
                {cfg.portalSwitcherLabel}
                <ArrowRight className="w-3 h-3" />
              </Link>
            )}
            <Link
              to="/signin"
              className="text-sm text-gray-300 hover:text-white border border-gray-700 hover:border-gray-500 px-4 py-1.5 rounded-lg transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/signup"
              className={`text-sm font-medium px-4 py-1.5 rounded-lg transition-all ${cfg.gradientBtn}`}
            >
              Inscription
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden text-gray-300 hover:text-white p-1"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t ${cfg.mobileMenuBg} px-4 pb-4 pt-2 space-y-2`}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setMobileOpen(false)}
              className={`block py-2 text-sm text-gray-300 ${cfg.hoverLink} transition-colors`}
            >
              {link.label}
            </Link>
          ))}
          {scrollLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => handleScrollTo(link.id)}
              className={`block w-full text-left py-2 text-sm text-gray-300 ${cfg.hoverLink} transition-colors bg-transparent border-0 cursor-pointer`}
            >
              {link.label}
            </button>
          ))}
          <div className="pt-2 flex flex-col gap-2 border-t border-gray-800">
            <Link
              to="/signin"
              onClick={() => setMobileOpen(false)}
              className="text-sm text-center text-gray-300 hover:text-white border border-gray-700 px-4 py-2 rounded-lg transition-colors"
            >
              Connexion
            </Link>
            <Link
              to="/signup"
              onClick={() => setMobileOpen(false)}
              className={`text-sm font-medium text-center px-4 py-2 rounded-lg transition-all ${cfg.gradientBtn}`}
            >
              Inscription
            </Link>
          </div>
          {portalSwitcher && (
            <Link
              to={cfg.portalSwitcherHref}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-1 text-xs text-gray-400 ${cfg.hoverLink} transition-colors pt-1`}
            >
              {cfg.portalSwitcherLabel}
              <ArrowRight className="w-3 h-3" />
            </Link>
          )}
        </div>
      )}
    </header>
  )
}

export default UniverseNav
