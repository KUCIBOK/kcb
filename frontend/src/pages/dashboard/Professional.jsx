import { useState } from "react";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { useAuth } from "../../store/AuthContext";
import { useArtworks } from "../../store/ArtworkContext";
import { Link } from "react-router-dom";
import {
  Award,
  Briefcase,
  Building,
  CreditCard,
  Gavel,
  Image,
  Menu,
  Palette,
  Plus,
  Shield,
  TrendingUp,
  Truck,
  Users,
  Zap,
  BarChart3,
  Mail,
  ChevronRight,
  LayoutDashboard,
  Package,
  Settings,
} from "lucide-react";
import DashboardSidebar from "../../components/shared/DashboardSidebar";
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
  const { user, professionalProfile, subscription } = useAuth();
  const [tab, setTab] = useState(0);

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
        <DashboardSidebar
          menuStructure={menuStructure}
          profile={professionalProfile}
          tab={tab}
          setTab={setTab}
          toggle={toggle}
          setToggle={setToggle}
          cta={{
            to: "add-artwork",
            label: "Ajouter une œuvre",
            icon: <Plus className="w-4 h-4" />,
            className: "bg-blue-900/90 hover:bg-blue-800/90",
          }}
          subscription={subscription}
          pricingPath="/professional/pricing"
        />
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
