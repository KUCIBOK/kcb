import { Link } from "react-router-dom"
import { useLang } from "../../store/LangContext"
import { africaT } from "../../i18n/africa"
import { globalT } from "../../i18n/global"

/**
 * Portal-specific footer with 4-column layout.
 * @param {object} props
 * @param {"africa"|"global"} props.portal - Active portal
 */
export default function PortalFooter({ portal }) {
  const { lang } = useLang()
  const cfg = portal === "africa" ? africaT[lang].footer : globalT[lang].footer

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
              {cfg.privacy}
            </Link>
            <Link to="/terms-and-conditions" className="text-[11px] text-kcb-pierre no-underline hover:text-kcb-sable transition-colors">
              {cfg.terms}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
