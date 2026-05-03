import {
  ChartColumn,
  Image,
  Menu,
  Plus,
  TrendingUp,
  User,
  Truck,
  Shield,
  Users,
  MessageSquare,
  DollarSign,
  Bell,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import DashboardSidebar from "../../components/shared/DashboardSidebar";
import { EmailVerificationBanner } from "../../components/shared/EmailVerificationBanner";
import { ProfileCompletionBanner } from "../../components/shared/ProfileCompletionBanner";
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
import { ArtistCertificationTab } from "../../components/artist/ArtistCertificationTab";

export default function Artist() {
  const { user, artistProfile, loading } = useAuth();
  const [toggle, setToggle] = useState(false);
  const { myArtworks } = useArtworks();
  const [tab, setTab] = useState(0);

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
        { name: "Certifications KCB", icon: <Shield className="w-4 h-4" />, index: 9 },
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
      case 9:
        return <ArtistCertificationTab />;
      default:
        return null;
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
        {/* Sticky top bar — mobile only */}
        <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-kcb-ardoise border-b border-white/[0.06]">
          <div className="flex items-center gap-3">
            <button onClick={() => setToggle(true)} className="text-kcb-pierre hover:text-white p-1">
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-white text-sm font-medium truncate">{getCurrentPageInfo().page}</span>
          </div>
          <Link to="submit-artwork">
            <Plus className="w-5 h-5 text-kcb-or" />
          </Link>
        </header>

        {/* Sidebar */}
        <DashboardSidebar
          menuStructure={menuStructure}
          profile={artistProfile}
          tab={tab}
          setTab={setTab}
          toggle={toggle}
          setToggle={setToggle}
          cta={{
            to: "submit-artwork",
            label: "Ajouter une œuvre",
            icon: <Plus className="w-4 h-4" />,
            className: "bg-kcb-or text-kcb-noir hover:bg-kcb-bronze",
          }}
        />

        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto min-w-0">
          <EmailVerificationBanner />
          <ProfileCompletionBanner setTab={setTab} />
          {/* Breadcrumb — desktop only */}
          <div className="hidden lg:flex items-center gap-2 text-sm text-kcb-pierre mb-6">
            <span>{getCurrentPageInfo().category}</span>
            <ChevronRight className="w-4 h-4" />
            <span className="text-white font-medium">{getCurrentPageInfo().page}</span>
          </div>
          {renderTab()}
        </main>
      </div>
    </>
  );
}
