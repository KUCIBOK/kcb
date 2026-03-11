import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Crown,
  LogOut,
  Search,
  X,
} from "lucide-react";
import { useAuth } from "../../store/AuthContext";

/**
 * DashboardSidebar — composant partagé entre Artist, Collector et Professional.
 *
 * Props :
 *   menuStructure  — tableau de catégories { category, icon, items: [{name, icon, index}] }
 *   profile        — objet profil de l'utilisateur (artistProfile / collectorProfile / professionalProfile)
 *   tab            — index de l'onglet actif
 *   setTab         — setter de l'onglet actif
 *   toggle         — état d'ouverture mobile
 *   setToggle      — setter du toggle mobile
 *   cta            — { to, label, icon, className } — bouton CTA principal (ex: "Ajouter une œuvre")
 *   subscription   — abonnement actif (falsy = afficher le lien upgrade)
 *   pricingPath    — chemin vers la page de tarification (ex: "/collector/pricing")
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
  const { user, logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState("Tableau de Bord");
  const [searchQuery, setSearchQuery] = useState("");

  const toggleMenu = (category) => {
    setExpandedMenu(expandedMenu === category ? null : category);
  };

  const filteredMenuStructure = searchQuery
    ? menuStructure
        .map((menu) => ({
          ...menu,
          items: menu.items.filter((item) =>
            item.name.toLowerCase().includes(searchQuery.toLowerCase())
          ),
        }))
        .filter((menu) => menu.items.length > 0)
    : menuStructure;

  return (
    <aside
      className={`transition-all duration-200 lg:w-60 w-full bg-card border-r border-gray-800/60 flex-shrink-0 z-30 overflow-y-auto ${
        toggle
          ? "fixed top-0 left-0 h-screen"
          : "hidden lg:block lg:h-screen"
      }`}
    >
      <div className="flex flex-col h-full px-4 py-6">
        {/* Header : logo + fermeture mobile */}
        <div className="flex items-center justify-between mb-4">
          <Link to="/">
            <img
              src="/images/kucibok-white-logo.svg"
              alt="logo Kucibok"
              className="w-8"
            />
          </Link>
          <button
            onClick={() => setToggle(false)}
            className="lg:hidden block text-gray-400 hover:text-white"
          >
            <X />
          </button>
        </div>

        {/* Lien retour (admin uniquement) */}
        {user?.role === "admin" && (
          <div className="flex items-center mb-4">
            <Link
              to={-1}
              className="text-gray-400 hover:text-white flex items-center gap-2 border hover:bg-gray-800/60 px-2 py-1 rounded-md"
            >
              <ArrowLeft className="w-4 h-4" /> Retour
            </Link>
          </div>
        )}

        {/* Avatar + nom du profil */}
        {profile?._id && (
          <div className="flex items-center mb-6">
            <img
              src={
                profile.image ||
                "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
              }
              alt={profile.name}
              className="w-10 h-10 rounded-full object-cover mr-2 border border-gray-700"
            />
            <span className="text-white text-lg font-serif font-bold truncate">
              {profile.name}
            </span>
          </div>
        )}

        {/* Recherche rapide */}
        <div className="mb-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-kcb-or transition"
          />
        </div>

        {/* Navigation par catégories */}
        <nav className="flex flex-col gap-2 mb-6">
          {filteredMenuStructure.map((menu, menuIndex) => (
            <div key={menuIndex} className="mb-2">
              <button
                onClick={() => toggleMenu(menu.category)}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-gray-400 group-hover:text-kcb-or transition">
                    {menu.icon}
                  </span>
                  <span className="text-sm font-medium">{menu.category}</span>
                </div>
                {searchQuery || expandedMenu === menu.category ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {(searchQuery || expandedMenu === menu.category) && (
                <div className="mt-1 ml-4 space-y-1">
                  {menu.items.map((item, itemIndex) =>
                    item.to ? (
                      <Link
                        key={itemIndex}
                        to={item.to}
                        onClick={() => setToggle(false)}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg transition text-gray-400 hover:bg-gray-800 hover:text-white"
                      >
                        <span className="text-gray-500">{item.icon}</span>
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    ) : (
                      <button
                        key={itemIndex}
                        onClick={() => {
                          setTab(item.index);
                          setToggle(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                          tab === item.index
                            ? "bg-kcb-or/15 text-kcb-or border-l-2 border-kcb-or"
                            : "text-gray-400 hover:bg-gray-800 hover:text-white"
                        }`}
                      >
                        <span
                          className={
                            tab === item.index ? "text-kcb-or" : "text-gray-500"
                          }
                        >
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

        {/* CTA principal (ex: "Ajouter une œuvre" ou "Marketplace") */}
        {cta && (
          <Link
            to={cta.to}
            className={`w-full flex items-center gap-2 text-xs font-medium text-white py-2 px-4 rounded-md mb-2 transition ${cta.className}`}
          >
            {cta.icon}
            {cta.label}
          </Link>
        )}

        {/* Lien upgrade abonnement */}
        {!subscription && pricingPath && (
          <Link
            to={pricingPath}
            className="w-full text-kcb-or text-xs font-medium bg-kcb-or/10 border border-kcb-or/30 hover:bg-kcb-or/20 transition py-2 px-4 flex gap-2 items-center rounded-md mb-2"
          >
            <Crown className="w-4 h-4" /> Mettre à jour l'abonnement
          </Link>
        )}

        {/* Déconnexion */}
        <button
          onClick={logout}
          className="w-full mt-auto px-3 py-2 flex gap-2 items-center text-white text-xs bg-red-950/80 hover:bg-red-900/90 rounded-md transition justify-center"
        >
          <LogOut className="w-4 h-4 text-white" />
          <span>Déconnexion</span>
        </button>
      </div>
    </aside>
  );
}
