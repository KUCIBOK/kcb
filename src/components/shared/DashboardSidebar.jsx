import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, ChevronDown, ChevronRight, Crown, LogOut, Search, X } from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { useLang } from '../../store/LangContext'
import { uiT } from '../../i18n/ui'
import LangToggle from '../ui/LangToggle'

/**
 * DashboardSidebar — composant partagé entre Artist, Collector et Professional.
 *
 * Props :
 *   menuStructure  — tableau de catégories { category, icon, items: [{name, icon, index}] }
 *   profile        — objet profil de l'utilisateur (artistProfile / buyerProfile / curatorProfile)
 *   tab            — index de l'onglet actif
 *   setTab         — setter de l'onglet actif
 *   toggle         — état d'ouverture mobile
 *   setToggle      — setter du toggle mobile
 *   cta            — { to, label, icon, className } — bouton CTA principal (ex: "Ajouter une œuvre")
 *   subscription   — abonnement actif (falsy = afficher le lien upgrade)
 *   pricingPath    — chemin vers la page de tarification (ex: "/curator/pricing")
 */
export default function DashboardSidebar({
  menuStructure,
  profile,
  tab,
  setTab,
  toggle,
  setToggle,
  cta,
  subscription,
  pricingPath,
}) {
  const { user, logout } = useAuth()
  const { lang } = useLang()
  const t = uiT[lang].sidebar
  const [expandedMenu, setExpandedMenu] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')

  const toggleMenu = (index) => {
    setExpandedMenu(expandedMenu === index ? null : index)
  }

  const filteredMenuStructure = searchQuery
    ? menuStructure
        .map((menu) => ({
          ...menu,
          items: menu.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((menu) => menu.items.length > 0)
    : menuStructure

  return (
    <>
      {/* Backdrop mobile */}
      {toggle && (
        <div
          className="fixed inset-0 bg-black/60 z-20 lg:hidden"
          onClick={() => setToggle(false)}
        />
      )}
      <aside
        className={`
        fixed top-0 left-0 h-screen w-72 max-w-[85vw] z-30
        flex-shrink-0 overflow-y-auto
        bg-kcb-ardoise border-r border-white/[0.06]
        transition-transform duration-300 ease-in-out
        ${toggle ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:w-60 lg:h-screen lg:block
      `}
      >
        <div className="flex flex-col h-full px-4 py-6">
          {/* Header : logo + fermeture mobile */}
          <div className="flex items-center justify-between mb-4">
            <Link to="/">
              <img src="/images/kucibok-white-logo.svg" alt="logo Kucibok" className="w-8" />
            </Link>
            <button
              onClick={() => setToggle(false)}
              className="lg:hidden block text-kcb-pierre hover:text-white"
            >
              <X />
            </button>
          </div>

          {/* Lien retour (admin uniquement) */}
          {user?.role === 'admin' && (
            <div className="flex items-center mb-4">
              <Link
                to={-1}
                className="text-kcb-pierre hover:text-white flex items-center gap-2 border border-white/[0.06] hover:bg-white/[0.06] px-2 py-1 rounded-[4px]"
              >
                <ArrowLeft className="w-4 h-4" /> {t.back}
              </Link>
            </div>
          )}

          {/* Avatar + nom du profil */}
          {profile?._id && (
            <div className="flex items-center mb-6">
              <img
                src={
                  profile.image ||
                  'https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg'
                }
                alt={profile.name}
                className="w-10 h-10 rounded-full object-cover mr-2 border border-white/[0.08]"
              />
              <span className="text-white text-lg font-playfair font-bold truncate">
                {profile.name}
              </span>
            </div>
          )}

          {/* Recherche rapide */}
          <div className="mb-4 relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-kcb-pierre" />
            <input
              type="text"
              placeholder={t.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-kcb-noir border border-white/[0.08] rounded-[4px] text-white text-sm placeholder-kcb-pierre focus:outline-none focus:border-kcb-or transition"
            />
          </div>

          {/* Navigation par catégories */}
          <nav className="flex flex-col gap-2 mb-6">
            {filteredMenuStructure.map((menu, menuIndex) => (
              <div key={menuIndex} className="mb-2">
                <button
                  onClick={() => toggleMenu(menuIndex)}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-[4px] hover:bg-white/[0.06] transition text-kcb-sable hover:text-white group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-kcb-pierre group-hover:text-kcb-or transition">
                      {menu.icon}
                    </span>
                    <span className="text-sm font-medium">{menu.category}</span>
                  </div>
                  {searchQuery || expandedMenu === menuIndex ? (
                    <ChevronDown className="w-4 h-4 text-kcb-pierre" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-kcb-pierre" />
                  )}
                </button>

                {(searchQuery || expandedMenu === menuIndex) && (
                  <div className="mt-1 ml-4 space-y-1">
                    {menu.items.map((item, itemIndex) =>
                      item.to ? (
                        <Link
                          key={itemIndex}
                          to={item.to}
                          onClick={() => setToggle(false)}
                          className="w-full flex items-center gap-3 px-3 py-2 rounded-[4px] transition text-kcb-pierre hover:bg-white/[0.06] hover:text-white"
                        >
                          <span className="text-kcb-pierre">{item.icon}</span>
                          <span className="text-sm">{item.name}</span>
                        </Link>
                      ) : (
                        <button
                          key={itemIndex}
                          onClick={() => {
                            setTab(item.index)
                            setToggle(false)
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-[4px] transition focus-visible:ring-2 focus-visible:ring-kcb-or focus-visible:ring-offset-1 focus-visible:ring-offset-kcb-noir outline-none ${
                            tab === item.index
                              ? 'bg-kcb-or/15 text-kcb-or border-l-2 border-kcb-or'
                              : 'text-kcb-pierre hover:bg-white/[0.06] hover:text-white'
                          }`}
                        >
                          <span className={tab === item.index ? 'text-kcb-or' : 'text-kcb-pierre'}>
                            {item.icon}
                          </span>
                          <span className="text-sm">{item.name}</span>
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* CTA(s) principal(aux) — accepte un objet ou un tableau d'objets */}
          {cta &&
            (Array.isArray(cta) ? cta : [cta]).map((c, i) => (
              <Link
                key={i}
                to={c.to}
                className={`w-full flex items-center gap-2 text-xs font-medium text-white py-2 px-4 rounded-[4px] mb-2 transition ${c.className}`}
              >
                {c.icon}
                {c.label}
              </Link>
            ))}

          {/* Lien upgrade abonnement */}
          {!subscription && pricingPath && (
            <Link
              to={pricingPath}
              className="w-full text-kcb-or text-xs font-medium bg-kcb-or/10 border border-kcb-or/30 hover:bg-kcb-or/20 transition py-2 px-4 flex gap-2 items-center rounded-[4px] mb-2"
            >
              <Crown className="w-4 h-4" /> {t.upgrade}
            </Link>
          )}

          {/* Déconnexion + sélecteur de langue */}
          <div className="mt-auto flex flex-col gap-2">
            <button
              onClick={logout}
              className="w-full px-3 py-2 flex gap-2 items-center text-white text-xs bg-[#8B1A1A]/80 hover:bg-[#8B1A1A] rounded-md transition justify-center"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>{t.logout}</span>
            </button>
            <div className="flex justify-center pt-1 pb-1">
              <LangToggle />
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
