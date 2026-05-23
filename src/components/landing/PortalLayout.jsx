import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import PortalNav from './PortalNav'
import PortalFooter from './PortalFooter'
import { useLang } from '../../store/LangContext'

/** CSS variable maps per portal. */
const PORTAL_VARS = {
  africa: { '--accent': '#C9A84C', '--accent-dark': '#8B6914' },
  global: { '--accent': '#A8B0BC', '--accent-dark': '#6B7280' },
}

/**
 * Wrapper layout for portal landing pages.
 * Sets CSS accent vars, renders Nav + children + Footer + grain overlay.
 * Handles hash-based scrolling when navigating from sub-pages (e.g. /global/catalogue → /global#pricing).
 *
 * @param {object} props
 * @param {"africa"|"global"} props.portal - Active portal
 * @param {React.ReactNode} props.children - Page sections
 */
export default function PortalLayout({ portal, children }) {
  const { hash } = useLocation()
  const { lang, setLang } = useLang()

  useEffect(() => {
    sessionStorage.setItem('kcb_portal', portal)
    // Set lang default per portal only if user has no stored preference
    if (!localStorage.getItem('kcb_lang')) {
      setLang(portal === 'africa' ? 'fr' : 'en')
    }
  }, [portal, setLang])

  useEffect(() => {
    if (hash) {
      const id = hash.replace('#', '')
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      }, 300)
    } else {
      window.scrollTo(0, 0)
    }
  }, [hash])

  return (
    <div
      className="min-h-screen bg-kcb-noir-deep text-white font-dm-sans grain-overlay"
      style={PORTAL_VARS[portal]}
    >
      <PortalNav portal={portal} />
      <main>{children}</main>
      <PortalFooter portal={portal} />
    </div>
  )
}
