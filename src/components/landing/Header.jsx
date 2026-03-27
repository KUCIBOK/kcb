import { memo, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { useAuth } from "../../store/AuthContext"
import { UserLinks } from "./UserLinks"
import { Menu, X } from "lucide-react"

const LINKS = [
  { name: "Catalogue", path: "/africa/catalogue" },
  { name: "Artistes", path: "/africa/artists" },
  { name: "Blog", path: "/africa/blog" },
  { name: "FAQ", path: "/africa/faq" },
  { name: "Contact", path: "/africa/contact" },
]

/**
 * Main site header — used by Layout for non-portal pages.
 * Aligned with the KCB noir/or design system.
 */
export const Header = memo(() => {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <header className="sticky top-0 left-0 right-0 z-[100] py-4 bg-kcb-noir-deep/[0.92] backdrop-blur-xl border-b border-white/[0.03] font-dm-sans">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)] flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 no-underline">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="h-8" />
          <span className="font-playfair font-bold text-lg text-white tracking-[0.06em] uppercase">
            Kuci<span className="text-kcb-or">bok</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-9">
          {LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-xs font-medium tracking-[0.06em] uppercase no-underline transition-colors ${
                isActive(link.path) ? "text-white" : "text-kcb-pierre hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Portal switches */}
          <Link
            to="/africa"
            className="text-xs tracking-[0.06em] uppercase text-kcb-pierre no-underline border border-white/[0.08] px-4 py-1.5 transition-colors hover:border-kcb-or hover:text-kcb-or"
          >
            Afrique
          </Link>
          <Link
            to="/global"
            className="text-xs tracking-[0.06em] uppercase text-kcb-pierre no-underline border border-white/[0.08] px-4 py-1.5 transition-colors hover:border-kcb-silver hover:text-kcb-silver"
          >
            Global
          </Link>

          {/* Auth */}
          {!user?.role ? (
            <div className="flex items-center gap-3">
              <Link
                to="/sign-in"
                className="text-xs font-medium tracking-[0.06em] uppercase text-kcb-pierre no-underline transition-colors hover:text-white"
              >
                Connexion
              </Link>
              <Link
                to="/sign-up"
                className="text-xs font-semibold tracking-[0.06em] uppercase bg-kcb-or text-kcb-noir no-underline px-5 py-2 transition-colors hover:bg-kcb-bronze"
              >
                Inscription
              </Link>
            </div>
          ) : (
            <UserLinks />
          )}
        </nav>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 lg:hidden">
          {user?.role && <UserLinks />}
          <button onClick={() => setOpen(!open)} className="text-white p-2">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-white/[0.03] mt-4 pt-4 pb-6 px-[clamp(24px,5vw,80px)] flex flex-col gap-4 bg-kcb-noir-deep/[0.98]">
          {LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`text-sm no-underline transition-colors ${
                isActive(link.path) ? "text-white" : "text-kcb-pierre hover:text-white"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.03]">
            <Link
              to="/africa"
              onClick={() => setOpen(false)}
              className="text-sm text-center text-kcb-or border border-kcb-or/20 py-2 no-underline hover:bg-kcb-or/5 transition-colors"
            >
              Portail Afrique
            </Link>
            <Link
              to="/global"
              onClick={() => setOpen(false)}
              className="text-sm text-center text-kcb-silver border border-kcb-silver/20 py-2 no-underline hover:bg-kcb-silver/5 transition-colors"
            >
              Global Portal
            </Link>
            {!user?.role && (
              <>
                <Link
                  to="/sign-in"
                  onClick={() => setOpen(false)}
                  className="text-sm text-center text-kcb-pierre border border-white/[0.08] py-2 no-underline"
                >
                  Connexion
                </Link>
                <Link
                  to="/sign-up"
                  onClick={() => setOpen(false)}
                  className="text-sm text-center font-semibold bg-kcb-or text-kcb-noir py-2 no-underline"
                >
                  Inscription
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
})
