import { useState } from 'react'
import { ArtworksList } from '../../components/artworks/ArtworksList'
import { useAuth } from '../../store/AuthContext'
import { useArtworks } from '../../store/ArtworkContext'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Clock,
  Building,
  CreditCard,
  Image,
  Lock,
  Menu,
  Palette,
  Plus,
  Shield,
  ShieldCheck,
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
} from 'lucide-react'
import DashboardSidebar from '../../components/shared/DashboardSidebar'
import { EmailVerificationBanner } from '../../components/shared/EmailVerificationBanner'
import { Profile } from '../../components/professional/Profile'
import { ArtistTab } from '../../components/professional/ArtistTab'
import { Synthesis } from '../../components/professional/Synthesis'

import { DeliveryTab } from '../../components/delivery/DeliveryTab'
import { InsuranceTab } from '../../components/insurance/InsuranceTab'
import CrmGalerie from '../../components/professional/CrmGalerie'
import MultiEntite from '../../components/professional/MultiEntite'
import Integrations from '../../components/professional/Integrations'
import AnalytiquePro from '../../components/professional/AnalytiquePro'
import Abonnement from '../../components/professional/Abonnement'
import EmailComposer from '../../components/professional/EmailComposer'
import ContactsLists from '../../components/professional/ContactsLists'

function SubscriptionGate() {
  return (
    <div className="flex flex-col items-center justify-center h-64 rounded-[4px] border border-kcb-or/20 bg-kcb-or/5 p-8 text-center gap-4">
      <Lock className="w-10 h-10 text-kcb-or/60" />
      <div>
        <p className="text-white font-semibold text-lg mb-1">Fonctionnalité Premium</p>
        <p className="text-kcb-pierre text-sm max-w-md">
          Cette fonctionnalité nécessite un abonnement actif. Choisissez un plan pour débloquer l'accès.
        </p>
      </div>
      <Link
        to="/global#pricing"
        className="flex items-center gap-2 bg-kcb-or text-kcb-noir px-5 py-2 rounded-[4px] text-sm font-semibold hover:bg-kcb-bronze transition"
      >
        Voir les plans
      </Link>
    </div>
  )
}

export default function Professional() {
  const { myArtworks } = useArtworks()
  const [toggle, setToggle] = useState(false)
  const { user, curatorProfile, subscription, loading } = useAuth()
  const [tab, setTab] = useState(0)
  const isSubscriptionActive = subscription?.status === 'active'

  // Menu structure with categories
  const menuStructure = [
    {
      category: 'Tableau de Bord',
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { name: 'Vue générale', icon: <TrendingUp className="w-4 h-4" />, index: 0 },
        { name: 'Analytique Pro', icon: <BarChart3 className="w-4 h-4" />, index: 11 },
      ],
    },
    {
      category: 'Catalogue',
      icon: <Package className="w-4 h-4" />,
      items: [
        { name: 'Nos œuvres', icon: <Image className="w-4 h-4" />, index: 1 },
        { name: 'Nos artistes', icon: <Palette className="w-4 h-4" />, index: 2 },
        { name: 'Catalogue B2B', icon: <ShieldCheck className="w-4 h-4" />, to: '/catalogue' },
      ],
    },
    {
      category: 'Marketing & CRM',
      icon: <Mail className="w-4 h-4" />,
      items: [
        { name: 'CRM Galerie', icon: <Users className="w-4 h-4" />, index: 6 },
        { name: 'Email Marketing', icon: <Mail className="w-4 h-4" />, index: 9 },
        { name: 'Contacts & Listes', icon: <Users className="w-4 h-4" />, index: 10 },
      ],
    },
    {
      category: 'Opérations',
      icon: <Settings className="w-4 h-4" />,
      items: [
        { name: 'Logistique', icon: <Truck className="w-4 h-4" />, index: 4 },
        { name: 'Assurance', icon: <Shield className="w-4 h-4" />, index: 5 },
        { name: 'Intégrations', icon: <Zap className="w-4 h-4" />, index: 8 },
        { name: 'Multi-entité', icon: <Building className="w-4 h-4" />, index: 7 },
      ],
    },
    {
      category: 'Compte',
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { name: 'Profil', icon: <Briefcase className="w-4 h-4" />, index: 12 },
        { name: 'Abonnement', icon: <CreditCard className="w-4 h-4" />, index: 13 },
      ],
    },
  ]

  // Get current page info for breadcrumb
  const getCurrentPageInfo = () => {
    for (const menu of menuStructure) {
      const item = menu.items.find((i) => i.index === tab)
      if (item) {
        return { category: menu.category, page: item.name }
      }
    }
    return { category: 'Dashboard', page: 'Vue générale' }
  }

  const renderTab = () => {
    switch (tab) {
      case 0:
        return <Synthesis />
      case 1:
        return <ArtworksList user={user} artworks={myArtworks} />
      case 2:
        return <ArtistTab />
      case 4:
        return <DeliveryTab />
      case 5:
        return <InsuranceTab />
      case 6: // CRM Galerie
        return isSubscriptionActive ? <CrmGalerie /> : <SubscriptionGate />
      case 7: // Multi-entité
        return isSubscriptionActive ? <MultiEntite /> : <SubscriptionGate />
      case 8: // Intégrations
        return isSubscriptionActive ? <Integrations /> : <SubscriptionGate />
      case 9: // Email Marketing
        return isSubscriptionActive ? <EmailComposer /> : <SubscriptionGate />
      case 10: // Contacts & Listes
        return isSubscriptionActive ? <ContactsLists /> : <SubscriptionGate />
      case 11: // Analytique Pro
        return isSubscriptionActive ? <AnalytiquePro /> : <SubscriptionGate />
      case 12:
        return <Profile />
      case 13:
        return <Abonnement />
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 rounded-xl border border-dashed border-white/[0.06] bg-kcb-ardoise/40 p-8 text-center gap-4">
            <Clock className="w-10 h-10 text-kcb-pierre" />
            <div>
              <p className="text-white font-semibold text-lg mb-1">Fonctionnalité à venir</p>
              <p className="text-kcb-pierre text-sm max-w-md">
                Cette section est en cours de développement.
              </p>
            </div>
            <span className="text-xs font-medium px-3 py-1 rounded-full border border-white/[0.06] text-kcb-pierre">
              Prochainement
            </span>
          </div>
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
            <button
              onClick={() => setToggle(true)}
              className="text-kcb-pierre hover:text-white p-1"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-white text-sm font-medium truncate">
              {getCurrentPageInfo().page}
            </span>
          </div>
          <Link to="add-artwork">
            <Plus className="w-5 h-5 text-kcb-or" />
          </Link>
        </header>

        {/* Sidebar */}
        <DashboardSidebar
          menuStructure={menuStructure}
          profile={curatorProfile}
          tab={tab}
          setTab={setTab}
          toggle={toggle}
          setToggle={setToggle}
          cta={{
            to: 'add-artwork',
            label: 'Ajouter une œuvre',
            icon: <Plus className="w-4 h-4" />,
            className: 'bg-kcb-or text-kcb-noir hover:bg-kcb-bronze',
          }}
          subscription={subscription}
          pricingPath="/curator/pricing"
        />
        {/* Main content */}
        <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto min-w-0">
          <EmailVerificationBanner />
          {!isSubscriptionActive && (
            <div className="flex items-center gap-3 bg-kcb-or/5 border border-kcb-or/20 rounded-[4px] px-4 py-3 mb-6 text-sm">
              <Lock className="w-4 h-4 text-kcb-or flex-shrink-0" />
              <p className="text-kcb-sable flex-1">
                Certaines fonctionnalités nécessitent un abonnement actif.{' '}
                <Link to="/global#pricing" className="text-kcb-or underline hover:text-kcb-bronze">
                  Voir les plans
                </Link>
              </p>
            </div>
          )}
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
