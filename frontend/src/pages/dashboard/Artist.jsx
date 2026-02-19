import {
  ChartColumn,
  Image,
  LogOut,
  Menu,
  Plus,
  TrendingUp,
  User,
  X,
  ArrowLeft,
  Truck,
  Shield,
  Users,
  MessageSquare,
  DollarSign,
  Bell,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  Search
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { useAuth } from "../../store/AuthContext";
import { useArtworks } from "../../store/ArtworkContext";
import { Profile } from "../../components/artist/Profile";
import { Analytics } from "../../components/artist/Analytics";
import { Synthesis } from "../../components/artist/Synthesis";
import { DeliveryTab } from "../../components/delivery/DeliveryTab";
import { ClientsTab } from "../../components/artist/ClientsTab";
import { InsuranceTab } from "../../components/insurance/InsuranceTab";
import SupportTicketUser from "../../components/support/SupportTicketUser";
import ArtistSales from "../../components/artist/ArtistSales";
import ArtistNotifications from "../../components/artist/ArtistNotifications";

export default function Artist() {
  const { user, artistProfile, logout } = useAuth();
  const [toggle, setToggle] = useState(false);
  const { myArtworks } = useArtworks();
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
        { name: "Analytique", icon: <ChartColumn className="w-4 h-4" />, index: 4 }
      ]
    },
    {
      category: "Mes Œuvres & Ventes",
      icon: <Package className="w-4 h-4" />,
      items: [
        { name: "Mes Œuvres", icon: <Image className="w-4 h-4" />, index: 1 },
        { name: "Mes Ventes", icon: <DollarSign className="w-4 h-4" />, index: 5 }
      ]
    },
    {
      category: "Clients & Communication",
      icon: <Users className="w-4 h-4" />,
      items: [
        { name: "Mes clients", icon: <Users className="w-4 h-4" />, index: 3 },
        { name: "Notifications", icon: <Bell className="w-4 h-4" />, index: 6 },
        { name: "Support", icon: <MessageSquare className="w-4 h-4" />, index: 7 }
      ]
    },
    {
      category: "Opérations",
      icon: <Settings className="w-4 h-4" />,
      items: [
        { name: "Logistique", icon: <Truck className="w-4 h-4" />, index: 2 }
      ]
    },
    {
      category: "Compte",
      icon: <User className="w-4 h-4" />,
      items: [
        { name: "Profil", icon: <User className="w-4 h-4" />, index: 8 }
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
        return (
          <ArtworksList
            user={user}
            title="Statut de soumission des œuvres d'art"
            artworks={myArtworks}
          />
        );
      case 2:
        return <DeliveryTab />;
      case 3:
        return <ClientsTab />;
      case 4:
        return (
          <Analytics
            user={user}
            title="Analytique des œuvres d'art"
            artistProfile={artistProfile}
            artworks={myArtworks}
          />
        );
      case 5:
        return <ArtistSales />;
      case 6:
        return <ArtistNotifications />;
      case 7:
        return <SupportTicketUser />;
      case 8:
        return <Profile />;
      default:
        return null;
    }
  };
  return (
    <>
      <div className="min-h-[200vh] flex flex-col lg:flex-row bg-background">
        {/* Sidebar */}
        <aside
          className={`transition-all duration-200 lg:w-60 w-full bg-card border-r border-gray-800/60 flex-shrink-0 z-30 fixed h-screen lg:block overflow-auto ${
            toggle ? "top-0 left-0" : "hidden"
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
            {artistProfile?._id && (
              <div className="flex items-center mb-6">
                <img
                  src={
                    artistProfile?.image ||
                    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                  }
                  alt={artistProfile?.name}
                  className="w-10 h-10 rounded-full object-cover mr-2 border border-gray-700"
                />
                <span className="text-white text-lg font-serif font-bold truncate">
                  {artistProfile?.name}
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
              to="submit-artwork"
              className="w-full text-white text-xs font-medium bg-indigo-kcb/90 hover:bg-indigo-kcb transition py-2 px-4 flex gap-2 items-center rounded-md mb-2"
            >
              <Plus className="w-4 h-4" /> Ajouter une œuvre
            </Link>
            <button
              onClick={logout}
              className="w-full mt-6 px-3 py-2 flex gap-2 items-center text-white text-xs bg-red-950/80 hover:bg-red-900/90 rounded-md transition justify-center"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex flex-col lg:absolute right-0 lg:px-4 py-8 transition duration-300 lg:w-12/15 w-full px-8 overflow-auto">
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
