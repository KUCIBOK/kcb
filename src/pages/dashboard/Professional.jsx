import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  Truck,
  Star,
  DollarSign,
  BookOpen,
  Briefcase,
  CreditCard,
  Menu,
  ChevronRight,
} from 'lucide-react'
import DashboardSidebar from '../../components/shared/DashboardSidebar'
import { EmailVerificationBanner } from '../../components/shared/EmailVerificationBanner'
import { ProfileCompletionBanner } from '../../components/shared/ProfileCompletionBanner'
import { Profile } from '../../components/professional/Profile'
import Abonnement from '../../components/professional/Abonnement'
import { useAuth } from '../../store/AuthContext'

import { CuratorOverview } from '../../components/curator/CuratorOverview'
import { ArtistDiscovery } from '../../components/curator/ArtistDiscovery'
import { LogisticsHub } from '../../components/curator/LogisticsHub'
import { ConciergeService } from '../../components/curator/ConciergeService'
import { BudgetTracker } from '../../components/curator/BudgetTracker'
import { LearningHub } from '../../components/curator/LearningHub'

export default function Professional() {
  const [toggle, setToggle] = useState(false)
  const { user, curatorProfile, subscription, loading } = useAuth()
  const [tab, setTab] = useState(0)

  const menuStructure = [
    {
      category: 'Tableau de Bord',
      icon: <LayoutDashboard className="w-4 h-4" />,
      items: [
        { name: 'Vue générale', icon: <LayoutDashboard className="w-4 h-4" />, index: 0 },
      ],
    },
    {
      category: 'Découverte',
      icon: <Users className="w-4 h-4" />,
      items: [
        { name: 'Artistes vérifiés', icon: <Users className="w-4 h-4" />, index: 1 },
      ],
    },
    {
      category: 'Opérations',
      icon: <Truck className="w-4 h-4" />,
      items: [
        { name: 'Centre logistique', icon: <Truck className="w-4 h-4" />, index: 2 },
        { name: 'Services Concierge', icon: <Star className="w-4 h-4" />, index: 3 },
      ],
    },
    {
      category: 'Finance',
      icon: <DollarSign className="w-4 h-4" />,
      items: [
        { name: 'Suivi budget', icon: <DollarSign className="w-4 h-4" />, index: 4 },
      ],
    },
    {
      category: 'Formation',
      icon: <BookOpen className="w-4 h-4" />,
      items: [
        { name: 'Hub éducatif', icon: <BookOpen className="w-4 h-4" />, index: 5 },
      ],
    },
    {
      category: 'Compte',
      icon: <Briefcase className="w-4 h-4" />,
      items: [
        { name: 'Profil', icon: <Briefcase className="w-4 h-4" />, index: 6 },
        { name: 'Abonnement', icon: <CreditCard className="w-4 h-4" />, index: 7 },
      ],
    },
  ]

  const getCurrentPageInfo = () => {
    for (const menu of menuStructure) {
      const item = menu.items.find((i) => i.index === tab)
      if (item) return { category: menu.category, page: item.name }
    }
    return { category: 'Dashboard', page: 'Vue générale' }
  }

  const renderTab = () => {
    switch (tab) {
      case 0: return <CuratorOverview setTab={setTab} demoMode={user?.role === 'admin'} />
      case 1: return <ArtistDiscovery />
      case 2: return <LogisticsHub />
      case 3: return <ConciergeService />
      case 4: return <BudgetTracker />
      case 5: return <LearningHub />
      case 6: return <Profile />
      case 7: return <Abonnement />
      default: return <CuratorOverview setTab={setTab} />
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
    <div className="min-h-screen flex flex-col lg:flex-row bg-kcb-noir">
      {/* Mobile top bar */}
      <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-kcb-ardoise border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button onClick={() => setToggle(true)} className="text-kcb-pierre hover:text-white p-1">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-medium truncate">{getCurrentPageInfo().page}</span>
        </div>
        <span className="text-xs text-[#9B4D96] font-medium">Curateur International</span>
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
          to: '#',
          label: 'Réserver Concierge',
          icon: <Star className="w-4 h-4" />,
          className: 'bg-[#9B4D96] text-white hover:bg-[#8B3D86]',
        }}
        subscription={subscription}
        pricingPath="/global#pricing"
      />

      {/* Main content */}
      <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto min-w-0">
        <EmailVerificationBanner />
        <ProfileCompletionBanner setTab={setTab} />

        {/* Breadcrumb — desktop */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-kcb-pierre mb-6">
          <span>{getCurrentPageInfo().category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium">{getCurrentPageInfo().page}</span>
        </div>

        {renderTab()}
      </main>
    </div>
  )
}
