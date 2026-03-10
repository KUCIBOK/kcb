import { memo } from "react"
import { Link } from "react-router-dom"

/**
 * Main site footer — used by Layout for non-portal pages.
 * Aligned with the KCB noir/or design system.
 */
export const Footer = memo(() => (
  <footer className="pt-20 pb-10 bg-kcb-noir-deep border-t border-white/[0.03] font-dm-sans">
    <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-16 mb-16">
        {/* Brand */}
        <div>
          <Link to="/" className="flex items-center gap-3 no-underline mb-4">
            <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="h-7" />
            <span className="font-playfair font-bold text-base text-white tracking-[0.06em] uppercase">
              Kuci<span className="text-kcb-or">bok</span>
            </span>
          </Link>
          <p className="text-[13px] text-kcb-pierre leading-[1.7] max-w-[300px]">
            Infrastructure de standardisation et de circulation securisee de l'art africain contemporain.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h4 className="font-semibold text-[11px] tracking-[0.12em] uppercase text-kcb-pierre mb-5">
            Navigation
          </h4>
          <ul className="list-none space-y-2.5">
            <li><Link to="/explore" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">Explorer</Link></li>
            <li><Link to="/artists" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">Artistes</Link></li>
            <li><Link to="/about" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">A propos</Link></li>
            <li><Link to="/blog" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">Blog</Link></li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-[11px] tracking-[0.12em] uppercase text-kcb-pierre mb-5">
            Ressources
          </h4>
          <ul className="list-none space-y-2.5">
            <li><Link to="/faq" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">FAQ</Link></li>
            <li><Link to="/contact" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">Contact</Link></li>
            <li><Link to="/africa" className="text-[13px] text-kcb-or no-underline transition-colors hover:text-white">Portail Afrique</Link></li>
            <li><Link to="/global" className="text-[13px] text-kcb-silver no-underline transition-colors hover:text-white">Global Portal</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-semibold text-[11px] tracking-[0.12em] uppercase text-kcb-pierre mb-5">
            Legal
          </h4>
          <ul className="list-none space-y-2.5">
            <li><Link to="/privacy-policy" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">Confidentialite</Link></li>
            <li><Link to="/terms-and-conditions" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">CGU</Link></li>
            <li><Link to="/sales-conditions" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">CGV</Link></li>
            <li><Link to="/ethic-chart" className="text-[13px] text-kcb-pierre no-underline transition-colors hover:text-white">Charte ethique</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom */}
      <div className="flex flex-col sm:flex-row justify-between items-center pt-8 border-t border-white/[0.03] gap-4">
        <p className="text-[11px] text-kcb-pierre">
          &copy; {new Date().getFullYear()} Kucibok — Art africain certifie
        </p>
        <div className="flex gap-6">
          <Link to="/privacy-policy" className="text-[11px] text-kcb-pierre no-underline hover:text-kcb-sable transition-colors">
            Confidentialite
          </Link>
          <Link to="/terms-and-conditions" className="text-[11px] text-kcb-pierre no-underline hover:text-kcb-sable transition-colors">
            CGU
          </Link>
        </div>
      </div>
    </div>
  </footer>
))
