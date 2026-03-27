import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useLang } from '../../store/LangContext'
import { useAuth } from '../../store/AuthContext'
import { africaT } from '../../i18n/africa'
import { globalT } from '../../i18n/global'
import LangToggle from '../ui/LangToggle'

/**
 * Sticky navigation bar that adapts to the active portal and current language.
 * All links are route-based (no anchor scrolling).
 * Active link is highlighted based on current pathname (startsWith for sub-routes).
 *
 * @param {object} props
 * @param {"africa"|"global"} props.portal - Active portal
 */
export default function PortalNav({ portal }) {
  const [open, setOpen] = useState(false)
  const { lang } = useLang()
  const { user } = useAuth() ?? {}
  const { pathname } = useLocation()

  const t = portal === 'africa' ? africaT[lang].nav : globalT[lang].nav

  const links =
    portal === 'africa'
      ? [
          { label: t.home, to: '/africa', exact: true },
          { label: t.catalogue, to: '/africa/catalogue' },
          { label: t.artists, to: '/africa/artists' },
          { label: t.blog, to: '/africa/blog' },
        ]
      : [
          { label: t.home, to: '/global', exact: true },
          { label: t.catalogue, to: '/global/catalogue' },
          { label: t.sourcing, to: '/global/sourcing' },
        ]

  /**
   * Check if a link matches the current page.
   * Uses exact match for home links, startsWith for the rest.
   */
  const isActive = (to, exact) =>
    exact ? pathname === to : pathname === to || pathname.startsWith(to + '/')

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
              <Link
                to={link.to}
                className={`text-xs font-medium tracking-[0.06em] uppercase transition-colors no-underline ${
                  isActive(link.to, link.exact)
                    ? 'text-[var(--accent)]'
                    : 'text-kcb-pierre hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}

          {/* Lang toggle */}
          <li>
            <LangToggle />
          </li>

          {/* Switch portal */}
          <li>
            <Link
              to={portal === 'africa' ? '/global' : '/africa'}
              className="text-xs tracking-[0.06em] uppercase text-kcb-pierre no-underline border border-white/[0.08] px-4 py-1.5 transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              {t.switchPortal}
            </Link>
          </li>

          {/* CTA — Dashboard if authenticated, Sign Up otherwise */}
          <li>
            {user ? (
              <Link
                to={user.role === 'buyer' ? '/account' : `/dashboard/${user.role}`}
                className="text-xs font-semibold tracking-[0.06em] uppercase bg-[var(--accent)] text-kcb-noir no-underline px-5 py-2 transition-colors hover:bg-[var(--accent-dark)]"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/sign-up"
                className="text-xs font-semibold tracking-[0.06em] uppercase bg-[var(--accent)] text-kcb-noir no-underline px-5 py-2 transition-colors hover:bg-[var(--accent-dark)]"
              >
                {t.cta}
              </Link>
            )}
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
            <Link
              key={i}
              to={link.to}
              onClick={() => setOpen(false)}
              className={`text-left text-sm transition-colors no-underline ${
                isActive(link.to, link.exact)
                  ? 'text-[var(--accent)] font-semibold'
                  : 'text-kcb-pierre hover:text-white'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.03]">
            <Link
              to={portal === 'africa' ? '/global' : '/africa'}
              onClick={() => setOpen(false)}
              className="text-sm text-center text-kcb-pierre border border-white/[0.08] py-2 no-underline"
            >
              {t.switchPortal}
            </Link>
            {user ? (
              <Link
                to={user.role === 'buyer' ? '/account' : `/dashboard/${user.role}`}
                onClick={() => setOpen(false)}
                className="text-sm text-center font-semibold bg-[var(--accent)] text-kcb-noir py-2 no-underline"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                to="/sign-up"
                onClick={() => setOpen(false)}
                className="text-sm text-center font-semibold bg-[var(--accent)] text-kcb-noir py-2 no-underline"
              >
                {t.cta}
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}
