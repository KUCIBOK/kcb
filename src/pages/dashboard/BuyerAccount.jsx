import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { useArtworks } from "../../store/ArtworkContext";
import { Menu, ShoppingBag, ChevronRight, Package, ShieldCheck, Truck, User } from "lucide-react";
import DashboardSidebar from "../../components/shared/DashboardSidebar";
import { EmailVerificationBanner } from "../../components/shared/EmailVerificationBanner";
import { Profile } from "../../components/collector/Profile";
import { Link } from "react-router-dom";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { DeliveryTab } from "../../components/delivery/DeliveryTab";
import { CollectorCertificatesTab } from "../../components/collector/CollectorCertificatesTab";

/**
 * BuyerAccount — Lightweight dashboard for buyer role.
 * 4 tabs: Orders, Certificates, Deliveries, Profile.
 */
export default function BuyerAccount() {
  const { buyed } = useArtworks();
  const [toggle, setToggle] = useState(false);
  const { user, buyerProfile, loading } = useAuth();
  const [tab, setTab] = useState(0);

  const menuStructure = [
    {
      category: "Mon Compte",
      icon: <Package className="w-4 h-4" />,
      items: [
        { name: "Mes achats", icon: <ShoppingBag className="w-4 h-4" />, index: 0 },
        { name: "Mes certificats KCB", icon: <ShieldCheck className="w-4 h-4" />, index: 1 },
        { name: "Logistique", icon: <Truck className="w-4 h-4" />, index: 2 },
        { name: "Profil", icon: <User className="w-4 h-4" />, index: 3 },
      ],
    },
  ];

  const getCurrentPageInfo = () => {
    for (const menu of menuStructure) {
      const item = menu.items.find((i) => i.index === tab);
      if (item) return { category: menu.category, page: item.name };
    }
    return { category: "Mon Compte", page: "Mes achats" };
  };

  const renderTab = () => {
    switch (tab) {
      case 0:
        return <ArtworksList user={user} title="Mes achats" artworks={buyed} />;
      case 1:
        return <CollectorCertificatesTab />;
      case 2:
        return <DeliveryTab />;
      case 3:
        return <Profile />;
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-kcb-noir">
      {/* Sticky top bar — mobile only */}
      <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-kcb-ardoise border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button onClick={() => setToggle(true)} className="text-kcb-pierre hover:text-white p-1">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-medium truncate">{getCurrentPageInfo().page}</span>
        </div>
        <Link to="/africa/catalogue">
          <ShoppingBag className="w-5 h-5 text-kcb-or" />
        </Link>
      </header>

      {/* Sidebar */}
      <DashboardSidebar
        menuStructure={menuStructure}
        profile={buyerProfile}
        tab={tab}
        setTab={setTab}
        toggle={toggle}
        setToggle={setToggle}
        cta={{
          to: "/africa/catalogue",
          label: "Catalogue",
          icon: <ShoppingBag className="w-4 h-4" />,
          className: "bg-kcb-or text-kcb-noir hover:bg-kcb-bronze justify-center",
        }}
      />

      {/* Main content */}
      <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto min-w-0">
        <EmailVerificationBanner />
        {/* Breadcrumb — desktop only */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-kcb-pierre mb-6">
          <span>{getCurrentPageInfo().category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium">{getCurrentPageInfo().page}</span>
        </div>
        {renderTab()}
      </main>
    </div>
  );
}
