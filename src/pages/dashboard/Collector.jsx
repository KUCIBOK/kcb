import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { useArtworks } from "../../store/ArtworkContext";
import { Activity, BarChart4, ChartLine, Clock, CreditCard, Menu, Shield, ShieldCheck, ShoppingBag, TrendingUp, User, Users, Truck, Scan, Frame, Palette, ChevronRight, LayoutDashboard, Package, Settings } from "lucide-react";
import DashboardSidebar from "../../components/shared/DashboardSidebar";
import { Profile } from "../../components/collector/Profile";
import { Link } from "react-router-dom";
import { Synthesis } from "../../components/collector/Synthesis";
import { DeliveryTab } from "../../components/delivery/DeliveryTab";
import { NumerisationTab } from "../../components/numerisation/NumerisationTab";
import { ArtistTab } from "../../components/professional/ArtistTab";
import { InsuranceTab } from "../../components/insurance/InsuranceTab";
import CollectorAbonnement from "../../components/collector/CollectorAbonnement";
import { CollectorCertificatesTab } from "../../components/collector/CollectorCertificatesTab";

export default function Collector() {
    const {buyed, myArtworks} = useArtworks()
    const [toggle, setToggle] = useState(false)
    const {user, buyerProfile, subscription, loading} = useAuth()
    const [tab, setTab] = useState(0)

    // Menu structure with categories
    const menuStructure = [
        {
            category: "Tableau de Bord",
            icon: <LayoutDashboard className="w-4 h-4" />,
            items: [
                { name: "Vue générale", icon: <ChartLine className="w-4 h-4" />, index: 0 },
                { name: "Activité", icon: <Activity className="w-4 h-4" />, index: 11 }
            ]
        },
        {
            category: "Ma Collection",
            icon: <Package className="w-4 h-4" />,
            items: [
                { name: "Mes achats", icon: <ShoppingBag className="w-4 h-4" />, index: 1 },
                { name: "Ma collection", icon: <Frame className="w-4 h-4" />, index: 4 },
                { name: "Mes artistes", icon: <Palette className="w-4 h-4" />, index: 5 },
                { name: "Mes certificats KCB", icon: <ShieldCheck className="w-4 h-4" />, index: 14 }
            ]
        },
        {
            category: "Services",
            icon: <Settings className="w-4 h-4" />,
            items: [
                { name: "Logistique", icon: <Truck className="w-4 h-4" />, index: 2 },
                { name: "Numérisation", icon: <Scan className="w-4 h-4" />, index: 3 },
                { name: "Assurance", icon: <Shield className="w-4 h-4" />, index: 6 }
            ]
        },
        {
            category: "Analyse & Valorisation",
            icon: <TrendingUp className="w-4 h-4" />,
            items: [
                { name: "Estimation/Valorisation", icon: <TrendingUp className="w-4 h-4" />, index: 7 },
                { name: "Comparaison & Analyse", icon: <BarChart4 className="w-4 h-4" />, index: 10 }
            ]
        },
        {
            category: "Outils Avancés",
            icon: <Users className="w-4 h-4" />,
            items: [
                { name: "Services connectés", icon: <Shield className="w-4 h-4" />, index: 8 },
                { name: "Mode Transmission", icon: <Users className="w-4 h-4" />, index: 9 }
            ]
        },
        {
            category: "Compte",
            icon: <User className="w-4 h-4" />,
            items: [
                { name: "Profil", icon: <User className="w-4 h-4" />, index: 12 },
                { name: "Abonnement", icon: <CreditCard className="w-4 h-4" />, index: 13 }
            ]
        }
    ]

    // Get current page info for breadcrumb
    const getCurrentPageInfo = () => {
        for (const menu of menuStructure) {
            const item = menu.items.find(i => i.index === tab)
            if (item) {
                return { category: menu.category, page: item.name }
            }
        }
        return { category: "Dashboard", page: "Vue générale" }
    }

    const renderTab = () => {
        switch(tab){
            case 0:
                return <Synthesis/>
            case 1 :
                return <ArtworksList user={user} title="Votre Collection d'Art" artworks={buyed} />
            case 2 :
                return <DeliveryTab/>
            case 3 :
                return (<NumerisationTab/>)
            case 4 :
                return (<ArtworksList user={user} title="Ma Collection d'Art" artworks={myArtworks} />)
            case 5 :
              return <ArtistTab />
            case 6:
               return <InsuranceTab />
            case 7:
                return (
                    <ComingSoon
                        title="Estimation & Valorisation"
                        description="Obtenez une estimation de la valeur de marché de vos œuvres basée sur les transactions récentes et les indices de prix de l'art africain."
                        phase="Phase 2"
                    />
                )
            case 8:
                return (
                    <ComingSoon
                        title="Services connectés"
                        description="Connectez Kucibok à vos outils existants : CRM, comptabilité, assurance. Centralisez la gestion de votre collection."
                        phase="Phase 2"
                    />
                )
            case 9:
                return (
                    <ComingSoon
                        title="Mode Transmission"
                        description="Planifiez la transmission de votre collection : désignez des bénéficiaires, organisez la documentation successorale de vos œuvres certifiées."
                        phase="Phase 3"
                    />
                )
            case 10:
                return (
                    <ComingSoon
                        title="Comparaison & Analyse"
                        description="Analysez l'évolution de votre portefeuille, comparez vos acquisitions aux indices de marché et identifiez les opportunités de valorisation."
                        phase="Phase 2"
                    />
                )
            case 11:
                return (
                    <ComingSoon
                        title="Activité"
                        description="Retrouvez l'historique complet de vos actions sur la plateforme : achats, demandes de livraison, certifications consultées."
                        phase="Phase 2"
                    />
                )
            case 12 :
              return <Profile/>
            case 13 :
              return <CollectorAbonnement/>
            case 14:
              return <CollectorCertificatesTab />
            default:
                return (
                    <ComingSoon
                        title="Fonctionnalité à venir"
                        description="Cette section est en cours de développement."
                        phase="Prochainement"
                    />
                )
        }
    }
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-kcb-noir">
                <div className="w-8 h-8 border-2 border-kcb-or border-t-transparent rounded-full animate-spin" />
            </div>
        )
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
              label: "Marketplace",
              icon: <ShoppingBag className="w-4 h-4" />,
              className: "bg-kcb-or text-kcb-noir hover:bg-kcb-bronze justify-center",
            }}
            subscription={subscription}
            pricingPath="/collector/pricing"
          />
          {/* Main content */}
          <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto min-w-0">
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
    )
}

function ComingSoon({ title, description, phase }) {
    return (
        <div className="flex flex-col items-center justify-center h-64 rounded-[4px] border border-dashed border-white/[0.06] bg-kcb-ardoise/40 p-8 text-center gap-4">
            <Clock className="w-10 h-10 text-kcb-pierre" />
            <div>
                <p className="text-white font-semibold text-lg mb-1">{title}</p>
                <p className="text-kcb-pierre text-sm max-w-md">{description}</p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full border border-white/[0.06] text-kcb-pierre">
                {phase}
            </span>
        </div>
    )
}