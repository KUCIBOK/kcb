import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

/** @type {Record<string, {links: {label: string, to?: string, id?: string}[], cta: {label: string, to: string}, switch: {label: string, to: string}}>} */
const NAV_CONFIG = {
  africa: {
    links: [
      { label: "Services", id: "services" },
      { label: "Comment ca marche", id: "timeline" },
      { label: "Temoignages", id: "testimonials" },
    ],
    cta: { label: "Inscription", to: "/sign-up" },
    switch: { label: "Global Portal", to: "/global" },
  },
  global: {
    links: [
      { label: "Catalogue", id: "catalogue" },
      { label: "Logistics", id: "logistics" },
      { label: "Sourcing", id: "sourcing" },
      { label: "Pricing", id: "pricing" },
    ],
    cta: { label: "Sign Up", to: "/sign-up" },
    switch: { label: "Portail Afrique", to: "/africa" },
  },
}

/**
 * Sticky navigation bar that adapts to the active portal.
 * @param {object} props
 * @param {"africa"|"global"} props.portal - Active portal
 */
export default function PortalNav({ portal }) {
  const [open, setOpen] = useState(false)
  const cfg = NAV_CONFIG[portal]

  const scrollTo = (id) => {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] py-4 bg-kcb-noir-deep/[0.92] backdrop-blur-xl border-b border-white/[0.03]">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="h-8" />
          <span className="font-playfair font-bold text-lg text-white tracking-[0.06em] uppercase">
            Kuci<span className="text-[var(--accent)]">bok</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-9 list-none">
          {cfg.links.map((link, i) => {
            if (link.to) {
              return (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-xs font-medium tracking-[0.06em] uppercase text-kcb-pierre no-underline transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              )
            }
            return (
              <li key={i}>
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-xs font-medium tracking-[0.06em] uppercase text-kcb-pierre transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              </li>
            )
          })}
          <li>
            <Link
              to={cfg.switch.to}
              className="text-xs tracking-[0.06em] uppercase text-kcb-pierre no-underline border border-white/[0.08] px-4 py-1.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {cfg.switch.label}
            </Link>
          </li>
          <li>
            <Link
              to={cfg.cta.to}
              className="text-xs font-semibold tracking-[0.06em] uppercase bg-[var(--accent)] text-kcb-noir no-underline px-5 py-2 transition-colors hover:bg-[var(--accent-dark)]"
            >
              {cfg.cta.label}
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-white p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.03] mt-4 pt-4 pb-6 px-[clamp(24px,5vw,80px)] flex flex-col gap-4">
          {cfg.links.map((link, i) => {
            if (link.to) {
              return (
                <Link
                  key={i}
                  to={link.to}
                  onClick={() => setOpen(false)}
                  className="text-sm text-kcb-pierre no-underline hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              )
            }
            return (
              <button
                key={i}
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm text-kcb-pierre hover:text-white transition-colors"
              >
                {link.label}
              </button>
            )
          })}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.03]">
            <Link
              to={cfg.switch.to}
              onClick={() => setOpen(false)}
              className="text-sm text-center text-kcb-pierre border border-white/[0.08] py-2 no-underline"
            >
              {cfg.switch.label}
            </Link>
            <Link
              to={cfg.cta.to}
              onClick={() => setOpen(false)}
              className="text-sm text-center font-semibold bg-[var(--accent)] text-kcb-noir py-2 no-underline"
            >
              {cfg.cta.label}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
