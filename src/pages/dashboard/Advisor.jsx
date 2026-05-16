import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Activity,
  Briefcase,
  TrendingUp,
  Users,
  FileText,
  CreditCard,
  Menu,
  ChevronRight,
  LayoutDashboard,
  Settings,
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import DashboardSidebar from '../../components/shared/DashboardSidebar'
import { EmailVerificationBanner } from '../../components/shared/EmailVerificationBanner'
import { AdvisorOverview } from '../../components/advisor/AdvisorOverview'
import { AdvisorClients } from '../../components/advisor/AdvisorClients'
import { AdvisorDealPipeline } from '../../components/advisor/AdvisorDealPipeline'
import { AdvisorMarket } from '../../components/advisor/AdvisorMarket'
import { AdvisorReports } from '../../components/advisor/AdvisorReports'
import Abonnement from '../../components/professional/Abonnement'
import { Profile } from '../../components/professional/Profile'

const menuStructure = [
  {
    category: 'Tableau de Bord',
    icon: <LayoutDashboard className="w-4 h-4" />,
    items: [
      { name: 'Vue 360°', icon: <Activity className="w-4 h-4" />, index: 0 },
      { name: 'Intelligence marché', icon: <TrendingUp className="w-4 h-4" />, index: 3 },
    ],
  },
  {
    category: 'Portefeuilles',
    icon: <Briefcase className="w-4 h-4" />,
    items: [
      { name: 'Mes clients', icon: <Users className="w-4 h-4" />, index: 1 },
      { name: 'Deal pipeline', icon: <Briefcase className="w-4 h-4" />, index: 2 },
    ],
  },
  {
    category: 'Outils',
    icon: <FileText className="w-4 h-4" />,
    items: [{ name: 'Rapports', icon: <FileText className="w-4 h-4" />, index: 4 }],
  },
  {
    category: 'Compte',
    icon: <Settings className="w-4 h-4" />,
    items: [
      { name: 'Profil', icon: <Briefcase className="w-4 h-4" />, index: 5 },
      { name: 'Abonnement', icon: <CreditCard className="w-4 h-4" />, index: 6 },
    ],
  },
]

const getCurrentPageInfo = (tab) => {
  for (const menu of menuStructure) {
    const item = menu.items.find((i) => i.index === tab)
    if (item) return { category: menu.category, page: item.name }
  }
  return { category: 'Dashboard', page: 'Vue 360°' }
}

export default function Advisor() {
  const { user, advisorProfile, subscription, loading } = useAuth()
  const [tab, setTab] = useState(0)
  const [toggle, setToggle] = useState(false)

  const renderTab = () => {
    switch (tab) {
      case 0:
        return <AdvisorOverview setTab={setTab} />
      case 1:
        return <AdvisorClients />
      case 2:
        return <AdvisorDealPipeline />
      case 3:
        return <AdvisorMarket />
      case 4:
        return <AdvisorReports />
      case 5:
        return <Profile />
      case 6:
        return <Abonnement />
      default:
        return <AdvisorOverview setTab={setTab} />
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-kcb-noir">
        <div className="w-8 h-8 border-2 border-kcb-or border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const pageInfo = getCurrentPageInfo(tab)

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-kcb-noir">
      {/* Mobile header */}
      <header className="lg:hidden sticky top-0 z-10 flex items-center justify-between px-4 h-14 bg-kcb-ardoise border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <button onClick={() => setToggle(true)} className="text-kcb-pierre hover:text-white p-1">
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-white text-sm font-medium truncate">{pageInfo.page}</span>
        </div>
        <span className="text-[10px] bg-kcb-or/10 text-kcb-or border border-kcb-or/20 px-2 py-0.5 rounded-[4px] font-semibold tracking-wide">
          ADVISOR
        </span>
      </header>

      {/* Sidebar */}
      <DashboardSidebar
        menuStructure={menuStructure}
        profile={advisorProfile}
        tab={tab}
        setTab={setTab}
        toggle={toggle}
        setToggle={setToggle}
        subscription={subscription}
        pricingPath="/global#pricing"
      />

      {/* Main content */}
      <main className="flex-1 px-4 md:px-8 py-6 overflow-y-auto min-w-0">
        <EmailVerificationBanner />

        {/* Breadcrumb — desktop */}
        <div className="hidden lg:flex items-center gap-2 text-sm text-kcb-pierre mb-6">
          <span>{pageInfo.category}</span>
          <ChevronRight className="w-4 h-4" />
          <span className="text-white font-medium">{pageInfo.page}</span>
          <span className="ml-auto text-[10px] bg-kcb-or/10 text-kcb-or border border-kcb-or/20 px-2 py-0.5 rounded-[4px] font-semibold tracking-wide">
            ADVISOR
          </span>
        </div>

        {renderTab()}
      </main>
    </div>
  )
}
