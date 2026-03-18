import { useState } from "react"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { useLang } from "../../store/LangContext"
import { africaT } from "../../i18n/africa"
import { globalT } from "../../i18n/global"
import LangToggle from "../ui/LangToggle"

/**
 * Sticky navigation bar that adapts to the active portal and current language.
 * @param {object} props
 * @param {"africa"|"global"} props.portal - Active portal
 */
export default function PortalNav({ portal }) {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()

  const t = portal === "africa" ? africaT[lang].nav : globalT[lang].nav

  const links =
    portal === "africa"
      ? [
          { label: t.services,     id: "services" },
          { label: t.howItWorks,   id: "timeline" },
          { label: t.testimonials, id: "testimonials" },
        ]
      : [
          { label: t.catalogue, to: "/explore" },
          { label: t.logistics, id: "logistics" },
          { label: t.sourcing,  to: "/global/sourcing" },
          { label: t.pricing,   id: "pricing" },
        ]

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
          {links.map((link, i) => (
            <li key={i}>
              {link.to ? (
                <Link
                  to={link.to}
                  className="text-xs font-medium tracking-[0.06em] uppercase text-kcb-pierre transition-colors hover:text-white no-underline"
                >
                  {link.label}
                </Link>
              ) : (
                <button
                  onClick={() => scrollTo(link.id)}
                  className="text-xs font-medium tracking-[0.06em] uppercase text-kcb-pierre transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              )}
            </li>
          ))}

          {/* Lang toggle */}
          <li>
            <LangToggle />
          </li>

          {/* Switch portal */}
          <li>
            <Link
              to={portal === "africa" ? "/global" : "/africa"}
              className="text-xs tracking-[0.06em] uppercase text-kcb-pierre no-underline border border-white/[0.08] px-4 py-1.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {t.switchPortal}
            </Link>
          </li>

          {/* CTA */}
          <li>
            <Link
              to="/sign-up"
              className="text-xs font-semibold tracking-[0.06em] uppercase bg-[var(--accent)] text-kcb-noir no-underline px-5 py-2 transition-colors hover:bg-[var(--accent-dark)]"
            >
              {t.cta}
            </Link>
          </li>
        </ul>

        {/* Mobile: lang toggle + burger */}
        <div className="lg:hidden flex items-center gap-4">
          <LangToggle />
          <button onClick={() => setOpen(!open)} className="text-white p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.03] mt-4 pt-4 pb-6 px-[clamp(24px,5vw,80px)] flex flex-col gap-4">
          {links.map((link, i) => (
            link.to ? (
              <Link
                key={i}
                to={link.to}
                onClick={() => setOpen(false)}
                className="text-left text-sm text-kcb-pierre hover:text-white transition-colors no-underline"
              >
                {link.label}
              </Link>
            ) : (
              <button
                key={i}
                onClick={() => scrollTo(link.id)}
                className="text-left text-sm text-kcb-pierre hover:text-white transition-colors"
              >
                {link.label}
              </button>
            )
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.03]">
            <Link
              to={portal === "africa" ? "/global" : "/africa"}
              onClick={() => setOpen(false)}
              className="text-sm text-center text-kcb-pierre border border-white/[0.08] py-2 no-underline"
            >
              {t.switchPortal}
            </Link>
            <Link
              to="/sign-up"
              onClick={() => setOpen(false)}
              className="text-sm text-center font-semibold bg-[var(--accent)] text-kcb-noir py-2 no-underline"
            >
              {t.cta}
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
