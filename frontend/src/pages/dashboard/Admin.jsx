import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { useArtworks } from "../../store/ArtworkContext";
import {
  ChartColumn,
  CheckCheck,
  Clock,
  ContactRound,
  CreditCard,
  FileText,
  Gavel,
  LogOut,
  Menu,
  Palette,
  Scan,
  Shield,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  X,
  Mail,
  GalleryHorizontalEnd,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
  Search,
  MessageSquare
} from "lucide-react";
import { BlogTab } from "../../components/admin/BlogTab";
import { UsersTab } from "../../components/users/UsersTab";
import { Analytics } from "../../components/admin/Analytics";
import { PlansTab } from "../../components/plans/PlansTab";
import { CategoryTab } from "../../components/category/CategoryTab";
import { LogsTab } from "../../components/logsComponents/LogsTab";
import { SubscriptionTab } from "../../components/subscriptions/SusbscriptionsTab";
import { Link } from "react-router-dom";
import { Synthesis } from "../../components/admin/Synthesis";
import { DeliveryRequestList } from "../../components/delivery/DeliveryRequestList";
import { EnhancedDeliveryRequestList } from "../../components/delivery/EnhancedDeliveryRequestList";
import { useDelivery } from "../../store/DeliveryStore";
import { AuctionTab } from "../../components/professional/AuctionTab";
import { useNumerisation } from "../../store/NumerisationStore";
import { NumerisationList } from "../../components/numerisation/NumeristionList";
import ClientsTab from "../../components/admin/ClientsTab";
import { CampainTab } from "../../components/admin/CampainTab";
import GalleriesTab from "../../components/admin/GalleriesTab";
import SupportTicketTab from "../../components/admin/SupportTicketTab";
import LogidooDashboard from "../../components/admin/LogidooDashboard";
export default function Admin() {
  const { pending, approved, rejected } = useArtworks();
  const { deliveries } = useDelivery();
  const { numerisations } = useNumerisation();
  const [toggle, setToggle] = useState(false);
  const { user, logout } = useAuth();
  const [tab, setTab] = useState(0);
  const [expandedMenu, setExpandedMenu] = useState("Tableau de Bord");
  const [searchQuery, setSearchQuery] = useState("");

  // Menu structure with categories
  const menuStructure = [
    {
      category: "Tableau de Bord",
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { name: "Dashboard", icon: <TrendingUp className="w-4 h-4" />, index: 0 }
      ]
    },
    {
      category: "Gestion Œuvres",
      icon: <Palette className="w-4 h-4" />,
      items: [
        { name: "En attente", icon: <Clock className="w-4 h-4" />, index: 1 },
        { name: "Approuvées", icon: <CheckCheck className="w-4 h-4" />, index: 2 },
        { name: "Rejetées", icon: <X className="w-4 h-4" />, index: 3 },
        { name: "Numérisations", icon: <Scan className="w-4 h-4" />, index: 5 },
        { name: "Enchères", icon: <Gavel className="w-4 h-4" />, index: 6 }
      ]
    },
    {
      category: "Utilisateurs & Clients",
      icon: <Users className="w-4 h-4" />,
      items: [
        { name: "Utilisateurs", icon: <Users className="w-4 h-4" />, index: 4 },
        { name: "Portefeuille clients", icon: <ContactRound className="w-4 h-4" />, index: 7 },
        { name: "Galeries scrapées", icon: <GalleryHorizontalEnd className="w-4 h-4" />, index: 16 }
      ]
    },
    {
      category: "Marketing & Communication",
      icon: <Mail className="w-4 h-4" />,
      items: [
        { name: "Articles de blog", icon: <FileText className="w-4 h-4" />, index: 8 },
        { name: "Campagnes Email", icon: <Mail className="w-4 h-4" />, index: 15 },
        { name: "Support & Tickets", icon: <MessageSquare className="w-4 h-4" />, index: 10 }
      ]
    },
    {
      category: "Opérations",
      icon: <Settings className="w-4 h-4" />,
      items: [
        { name: "Logistiques", icon: <Truck className="w-4 h-4" />, index: 9 },
        { name: "Catégories", icon: <FileText className="w-4 h-4" />, index: 12 },
        { name: "Logs", icon: <ChartColumn className="w-4 h-4" />, index: 14 }
      ]
    },
    {
      category: "Abonnements & Plans",
      icon: <CreditCard className="w-4 h-4" />,
      items: [
        { name: "Plans", icon: <CreditCard className="w-4 h-4" />, index: 11 },
        { name: "Abonnements", icon: <Users className="w-4 h-4" />, index: 13 }
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
    return { category: "Dashboard", page: "Dashboard" };
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
        return <Analytics />;
      case 1:
        return (
          <ArtworksList
            user={user}
            title="En attente d'examen"
            artworks={pending}
          />
        );
      case 2:
        return (
          <ArtworksList
            user={user}
            title="Oeuvres approuvées"
            artworks={approved}
          />
        );
      case 3:
        return (
          <ArtworksList
            user={user}
            title="Oeuvres rejetées"
            artworks={rejected}
          />
        );
      case 4:
        return <UsersTab />;
      case 5:
        return (
          <div>
            <h3 className="text-2xl text-white mb-4">Demandes de livraison</h3>
            <NumerisationList numerisations={numerisations} />
          </div>
        );
      case 6:
        return <AuctionTab />;
      case 7:
        return <ClientsTab />;
      case 8:
        return <BlogTab />;
      case 9:
        return <LogidooDashboard />;
      case 10:
        return (
          <div>
            <h3 className="text-2xl text-white mb-4">Support Client & Tickets</h3>
            <SupportTicketTab />
          </div>
        );
      case 11:
        return <PlansTab />;
      case 12:
        return <CategoryTab />;
      case 13:
        return <SubscriptionTab />;
      case 14:
        return <LogsTab />;
      case 15:
        return <CampainTab />;
      case 16:
        return <GalleriesTab />;
      default:
        return (
          <div className="text-center text-muted-foreground">
            Cette fonctionnalité n'est pas encore disponible.
          </div>
        );
    }
  };
  return (
    <>
      <div className="min-h-full flex flex-col lg:flex-row bg-gray-900">
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
            {user?._id && (
              <div className="flex items-center mb-6">
                <img
                  src={
                    user?.image ||
                    "https://t3.ftcdn.net/jpg/05/16/27/58/360_F_516275801_f3Fsp17x6HQK0xQgDQEELoTuERO4SsWV.jpg"
                  }
                  alt={user?.name}
                  className="w-10 h-10 rounded-full object-cover mr-2 border border-gray-700"
                />
                <span className="text-white text-lg font-serif font-bold truncate">
                  {user?.name}
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

            <nav className="flex flex-col gap-2 mb-2">
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
            <div className="space-y-4">
              <Link
                to="/dashboard/artist"
                className="w-full flex gap-2 items-center text-xs text-white bg-indigo-kcb/90 hover:bg-indigo-kcb transition py-2 px-4 rounded-md mb-1"
              >
                <Palette className="w-4 h-4" /> Artiste
              </Link>
              <Link
                to="/dashboard/collector"
                className="w-full flex gap-2 items-center text-xs text-white bg-indigo-kcb/90 hover:bg-indigo-kcb transition py-2 px-4 rounded-md mb-1"
              >
                <ShoppingBag className="w-4 h-4" /> Collectionneur
              </Link>
              <Link
                to="/dashboard/professional"
                className="w-full flex gap-2 items-center text-xs text-white bg-indigo-kcb/90 hover:bg-indigo-kcb transition py-2 px-4 rounded-md mb-1"
              >
                <Shield className="w-4 h-4" /> Professionnel
              </Link>
            </div>
            <button
              onClick={logout}
              className="w-full my-6 px-3 py-2 flex gap-2 items-center text-white text-xs bg-red-950/80 hover:bg-red-900/90 rounded-md transition justify-center"
            >
              <LogOut className="w-4 h-4 text-white" />
              <span>Déconnexion</span>
            </button>
          </div>
        </aside>
        {/* Main content */}
        <main className="flex flex-col lg:absolute right-0 py-8 transition duration-300 lg:w-13/16 w-full lg:px-4 px-8 bg-gray-900 min-h-screen">
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
