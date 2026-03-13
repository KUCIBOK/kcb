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
  Menu,
  Palette,
  Scan,
  Shield,
  ShoppingBag,
  TrendingUp,
  Truck,
  Users,
  Mail,
  GalleryHorizontalEnd,
  ChevronRight,
  LayoutDashboard,
  Settings,
  MessageSquare,
  X
} from "lucide-react";
import DashboardSidebar from "../../components/shared/DashboardSidebar";
import { BlogTab } from "../../components/admin/BlogTab";
import { UsersTab } from "../../components/users/UsersTab";
import { Analytics } from "../../components/admin/Analytics";
import { PlansTab } from "../../components/plans/PlansTab";
import { CategoryTab } from "../../components/category/CategoryTab";
import { LogsTab } from "../../components/logsComponents/LogsTab";
import { SubscriptionTab } from "../../components/subscriptions/SusbscriptionsTab";
import { Link } from "react-router-dom";
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
  const { numerisations } = useNumerisation();
  const [toggle, setToggle] = useState(false);
  const { user, loading } = useAuth();
  const [tab, setTab] = useState(0);

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
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kcb-noir">
        <div className="w-8 h-8 border-2 border-kcb-or border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex flex-col lg:flex-row bg-kcb-noir">
        {/* Sidebar */}
        <DashboardSidebar
          menuStructure={menuStructure}
          profile={user}
          tab={tab}
          setTab={setTab}
          toggle={toggle}
          setToggle={setToggle}
          cta={{
            to: "/dashboard/artist",
            label: "Artiste",
            icon: <Palette className="w-4 h-4" />,
            className: "bg-kcb-ardoise border border-white/[0.06] hover:bg-kcb-pierre",
          }}
        />
        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-8 overflow-y-auto">
          {/* Breadcrumb */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-sm text-kcb-pierre">
              <span>{getCurrentPageInfo().category}</span>
              <ChevronRight className="w-4 h-4" />
              <span className="text-white font-medium">{getCurrentPageInfo().page}</span>
            </div>
          </div>

          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={() => setToggle(!toggle)}
              className="text-kcb-pierre hover:text-white"
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
