import { useState } from "react";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { useAuth } from "../../store/AuthContext";
import { useArtworks } from "../../store/ArtworkContext";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  Briefcase,
  Building,
  CreditCard,
  Crown,
  Gavel,
  Image,
  LogOut,
  Menu,
  Palette,
  Plus,
  Shield,
  TrendingUp,
  Truck,
  Users,
  X,
  Zap,
  BarChart3,
  Mail,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  Search
} from "lucide-react";
import { Profile } from "../../components/professional/Profile";
import { ArtistTab } from "../../components/professional/ArtistTab";
import { Synthesis } from "../../components/professional/Synthesis";
import { AuctionTab } from "../../components/professional/AuctionTab";

import { DeliveryTab } from "../../components/delivery/DeliveryTab";
import { InsuranceTab } from "../../components/insurance/InsuranceTab";
import CrmGalerie from "../../components/professional/CrmGalerie";
import MultiEntite from "../../components/professional/MultiEntite";
import Integrations from "../../components/professional/Integrations";
import AnalytiquePro from "../../components/professional/AnalytiquePro";
import Abonnement from "../../components/professional/Abonnement";
import EmailComposer from "../../components/professional/EmailComposer";
import ContactsLists from "../../components/professional/ContactsLists";

export default function Professional() {
  const { myArtworks } = useArtworks();
  const [toggle, setToggle] = useState(false);
  const { user, professionalProfile, logout, subscription } = useAuth();
  const [tab, setTab] = useState(0);
  const [expandedMenu, setExpandedMenu] = useState("Tableau de Bord");
  const [searchQuery, setSearchQuery] = useState("");

  // Menu structure with categories
  const menuStructure = [
    {
      category: "Tableau de Bord",
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { name: "Vue générale", icon: <TrendingUp className="w-4 h-4" />, index: 0 },
        { name: "Analytique Pro", icon: <BarChart3 className="w-4 h-4" />, index: 11 }
      ]
    },
    {
      category: "Catalogue",
      icon: <Package className="w-4 h-4" />,
      items: [
        { name: "Nos œuvres", icon: <Image className="w-4 h-4" />, index: 1 },
        { name: "Nos artistes", icon: <Palette className="w-4 h-4" />, index: 2 },
        { name: "Nos enchères", icon: <Gavel className="w-4 h-4" />, index: 3 }
      ]
    },
    {
      category: "Marketing & CRM",
      icon: <Mail className="w-4 h-4" />,
      items: [
        { name: "CRM Galerie", icon: <Users className="w-4 h-4" />, index: 6 },
        { name: "Email Marketing", icon: <Mail className="w-4 h-4" />, index: 9 },
        { name: "Contacts & Listes", icon: <Users className="w-4 h-4" />, index: 10 }
      ]
    },
    {
      category: "Opérations",
      icon: <Settings className="w-4 h-4" />,
      items: [
        { name: "Logistique", icon: <Truck className="w-4 h-4" />, index: 4 },
        { name: "Assurance", icon: <Shield className="w-4 h-4" />, index: 5 },
        { name: "Intégrations", icon: <Zap className="w-4 h-4" />, index: 8 },
        { name: "Multi-entité", icon: <Building className="w-4 h-4" />, index: 7 }
      ]
    },
    {
      category: "Compte",
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { name: "Profil", icon: <Briefcase className="w-4 h-4" />, index: 12 },
        { name: "Abonnement", icon: <CreditCard className="w-4 h-4" />, index: 13 }
      ]
    }
  ];

  const toggleMenu = (category) => {
    setExpandedMenu(expandedMenu === category ? null : category);
  };

  // Get current page info for breadcrumb
  const getCurrentPageInfo = () => {
    for (const menu of menuStructure) {
      const item = menu.items.find(i => i.index === tab);
      if (item) {
        return { category: menu.category, page: item.name };
      }
    }
    return { category: "Dashboard", page: "Vue générale" };
  };

  // Filter menu items based on search
  const filteredMenuStructure = searchQuery
    ? menuStructure.map(menu => ({
        ...menu,
        items: menu.items.filter(item =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      })).filter(menu => menu.items.length > 0)
    : menuStructure;
  const renderTab = () => {
    switch (tab) {
      case 0:
        return <Synthesis />;
      case 1:
        return <ArtworksList user={user} artworks={myArtworks} />;
      case 2:
        return <ArtistTab />;
      case 3:
        return <AuctionTab />;
      case 4:
        return <DeliveryTab />;
      case 5:
        return <InsuranceTab />;
      case 6: // CRM Galerie
        return <CrmGalerie />;
      case 7: // Multi-entité
        return <MultiEntite />;
      case 8: // Intégrations
        return <Integrations />;
      case 9: // Email Marketing
        return <EmailComposer />;
      case 10: // Contacts & Listes
        return <ContactsLists />;
      case 11: // Analytique Pro
        return <AnalytiquePro />;
      case 12:
        return <Profile />;
      case 13:
        return <Abonnement />;
      default:
        return (
          <>
            <div className="flex flex-col items-center justify-center h-64">
              <span className="text-lg font-semibold text-gray-500">
                Bientôt disponible
              </span>
            </div>
          </>
        );
    }
  };
  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row bg-background">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-200 lg:w-60 w-full bg-card border-r border-gray-800/60 flex-shrink-0 z-30 lg:block overflow-y-auto ${
            toggle ? "fixed top-0 left-0 h-screen" : "hidden lg:block lg:h-screen"
          }`}
        >
          <div className="flex flex-col h-full px-4 py-6">
            <div className="flex items-center justify-between mb-4">
              <Link to="/">
                <img
                  src="/images/kucibok-white-logo.svg"
                  alt="logo"
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
            {user?.role === "admin" && (
              <div className="flex items-center mb-4">
                <Link
                  to={-1}
                  className="text-gray-400 hover:text-white flex items-center gap-2 border hover:bg-gray-800/60 px-2 py-1 rounded-md"
                >
                  <ArrowLeft className="w-4 h-4 text-gray-400 hover:text-white" />{" "}
                  Retour
                </Link>
              </div>
            )}
            {professionalProfile?._id && (
              <div className="flex items-center mb-6">
                <img
                  src={
                    professionalProfile?.image ||
                    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                  }
                  alt={professionalProfile?.name}
                  className="w-10 h-10 rounded-full object-cover mr-2 border border-gray-700"
                />
                <span className="text-white text-lg font-serif font-bold truncate">
                  {professionalProfile?.name}
                </span>
              </div>
            )}
            
            {/* Quick Search */}
            <div className="mb-4 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white text-sm placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition"
              />
            </div>
            
            <nav className="flex flex-col gap-2 mb-6">
              {filteredMenuStructure.map((menu, menuIndex) => (
                <div key={menuIndex} className="mb-2">
                  {/* Category Header */}
                  <button
                    onClick={() => toggleMenu(menu.category)}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-800 transition text-gray-300 hover:text-white group"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-400 group-hover:text-indigo-400 transition">
                        {menu.icon}
                      </span>
                      <span className="text-sm font-medium">{menu.category}</span>
                    </div>
                    {(searchQuery || expandedMenu === menu.category) ? (
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </button>

                  {/* Sub-items */}
                  {(searchQuery || expandedMenu === menu.category) && (
                    <div className="mt-1 ml-4 space-y-1">
                      {menu.items.map((item, itemIndex) => (
                        <button
                          key={itemIndex}
                          onClick={() => {
                            setTab(item.index);
                            setToggle(false);
                          }}
                          className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                            tab === item.index
                              ? "bg-indigo-600 text-white"
                              : "text-gray-400 hover:bg-gray-800 hover:text-white"
                          }`}
                        >
                          <span className={tab === item.index ? "text-white" : "text-gray-500"}>
                            {item.icon}
                          </span>
                          <span className="text-sm">{item.name}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </nav>
            <Link
              to="add-artwork"
              className="w-full text-white text-xs font-medium bg-blue-900/90 hover:bg-gray-700 transition py-2 px-4 flex gap-2 items-center rounded-md mb-2"
            >
              <Plus className="w-4 h-4" /> Ajouter une œuvre
            </Link>
            {!subscription && (
              <Link
                to="/professional/pricing"
                className="w-full text-white text-xs font-medium bg-yellow-900/90 hover:bg-gray-700 transition py-2 px-4 flex gap-2 items-center rounded-md mb-2"
              >
                <Crown className="w-4 h-4" /> Mettre à jour l'abonnement
              </Link>
            )}
            <button
              onClick={logout}
              className="w-full mt-auto px-3 py-2 flex gap-2 items-center text-white text-xs bg-red-950/80 hover:bg-red-900/90 rounded-md transition"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span>{getCurrentPageInfo().category}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{getCurrentPageInfo().page}</span>
            </div>
          </div>

          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setToggle(!toggle)}
              className="text-gray-400 hover:text-white"
            >
              <Menu className="w-6 h-6" />
              <span className="sr-only">Toggle menu</span>
            </button>
          </div>
          {renderTab()}
        </main>
      </div>
    </>
  );
}
