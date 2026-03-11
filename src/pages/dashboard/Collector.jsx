import { useState } from "react";
import { useAuth } from "../../store/AuthContext";
import { ArtworksList } from "../../components/artworks/ArtworksList";
import { useArtworks } from "../../store/ArtworkContext";
import { Activity, BarChart4, ChartLine, CreditCard, Menu, Shield, ShoppingBag, TrendingUp, User, Users, Truck, Scan, Frame, Palette, ChevronRight, LayoutDashboard, Package, Settings } from "lucide-react";
import DashboardSidebar from "../../components/shared/DashboardSidebar";
import { Profile } from "../../components/collector/Profile";
import { Link } from "react-router-dom";
import { Synthesis } from "../../components/collector/Synthesis";
import { DeliveryTab } from "../../components/delivery/DeliveryTab";
import { NumerisationTab } from "../../components/numerisation/NumerisationTab";
import { ArtistTab } from "../../components/professional/ArtistTab";
import { InsuranceTab } from "../../components/insurance/InsuranceTab";
import CollectorAbonnement from "../../components/collector/CollectorAbonnement";

export default function Collector() {
    const {buyed, myArtworks} = useArtworks()
    const [toggle, setToggle] = useState(false)
    const {user, collectorProfile, subscription} = useAuth()
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
                { name: "Mes artistes", icon: <Palette className="w-4 h-4" />, index: 5 }
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


            case 12 :
              return <Profile/>
            case 13 :
              return <CollectorAbonnement/>
            default:
                return (
                    <>
                    <div className="flex flex-col items-center justify-center h-64">
                        <span className="text-lg font-semibold text-gray-500">Bientôt disponible</span>
                    </div>
                    </>
                )               
        }
    }
    return (
        <>
        <div className="min-h-screen flex flex-col lg:flex-row bg-kcb-noir">
          {/* Sidebar */}
          <DashboardSidebar
            menuStructure={menuStructure}
            profile={collectorProfile}
            tab={tab}
            setTab={setTab}
            toggle={toggle}
            setToggle={setToggle}
            cta={{
              to: "/explore",
              label: "Marketplace",
              icon: <ShoppingBag className="w-4 h-4" />,
              className: "bg-kcb-or text-kcb-noir hover:bg-kcb-bronze justify-center",
            }}
            subscription={subscription}
            pricingPath="/collector/pricing"
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
              <button onClick={() => setToggle(!toggle)} className="text-gray-400 hover:text-white">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle menu</span>
              </button>
            </div>
            {renderTab()}
          </main>
        </div>
        </>
    )
}