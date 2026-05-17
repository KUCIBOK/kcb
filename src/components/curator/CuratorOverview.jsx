import { motion } from 'framer-motion'
import {
  Users,
  CheckCircle,
  Clock,
  Truck,
  DollarSign,
  Calendar,
  ArrowRight,
  Star,
  MapPin,
  FileText,
  AlertCircle,
  TrendingUp,
  Package,
} from 'lucide-react'
import { useAuth } from '../../store/AuthContext'
import { KPICard, SkeletonKPI } from '../ui'

const stagger = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.07 } },
}
const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

// Mock data — Sophie Laurent's exhibition project
const MOCK = {
  user: { name: 'Sophie Laurent', role: 'Senior Curator', institution: 'Tate Modern, London' },
  exhibition: {
    title: 'New Voices: Contemporary African Art',
    venue: 'Tate Modern, London',
    openingDate: '15 Sept 2025',
    closingDate: '10 Jan 2026',
    budget: 250000,
    currency: 'GBP',
    budgetUsed: 47800,
    daysLeft: 127,
    shortlisted: 18,
    confirmed: 6,
    artworksSelected: 11,
  },
  pipeline: [
    { label: 'À découvrir', count: 12, color: 'text-[#9B4D96]', bg: 'bg-[#9B4D96]/10', border: 'border-[#9B4D96]/30' },
    { label: 'Shortlistés', count: 18, color: 'text-kcb-or', bg: 'bg-kcb-or/10', border: 'border-kcb-or/30' },
    { label: 'Confirmés', count: 6, color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30' },
    { label: 'En transit', count: 3, color: 'text-kcb-bronze', bg: 'bg-kcb-bronze/10', border: 'border-kcb-bronze/30' },
  ],
  concierge: [
    {
      type: 'Visite studio virtuelle',
      artist: 'Aïcha Diallo — Dakar',
      date: '20 mai 2025',
      status: 'confirmed',
      price: '€350',
    },
    {
      type: 'Due diligence',
      artist: 'Kofi Mensah — Accra',
      date: '2 jours restants',
      status: 'in_progress',
      price: '€500',
    },
    {
      type: 'Coordination logistique',
      artist: '12 œuvres — Dakar → London',
      date: 'Devis reçu',
      status: 'pending',
      price: '€6 800',
    },
  ],
  alerts: [
    { icon: AlertCircle, text: 'Permis d\'export Sénégal à renouveler avant le 1er juin', level: 'warning' },
    { icon: FileText, text: '3 certificats d\'authenticité en attente de téléchargement', level: 'info' },
    { icon: CheckCircle, text: 'Visite studio Aïcha Diallo confirmée pour le 20 mai', level: 'success' },
  ],
  topArtists: [
    { name: 'Aïcha Diallo', country: 'Sénégal 🇸🇳', medium: 'Photographie', verified: true, score: 98 },
    { name: 'Kofi Mensah', country: 'Ghana 🇬🇭', medium: 'Peinture', verified: true, score: 94 },
    { name: 'Amara Touré', country: 'Mali 🇲🇱', medium: 'Sculpture', verified: true, score: 91 },
    { name: 'Fatou Ndiaye', country: 'Sénégal 🇸🇳', medium: 'Installation', verified: false, score: 87 },
    { name: 'Yaw Darko', country: 'Ghana 🇬🇭', medium: 'Vidéo', verified: true, score: 85 },
  ],
}

const statusConfig = {
  confirmed: { label: 'Confirmé', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
  in_progress: { label: 'En cours', color: 'text-kcb-or', bg: 'bg-kcb-or/10' },
  pending: { label: 'En attente', color: 'text-kcb-pierre', bg: 'bg-kcb-pierre/10' },
}

export function CuratorOverview({ setTab }) {
  const { curatorProfile, loading } = useAuth()
  const name = curatorProfile?.name?.split(' ')[0] || MOCK.user.name.split(' ')[0]
  const ex = MOCK.exhibition
  const budgetPct = Math.round((ex.budgetUsed / ex.budget) * 100)

  const now = new Date()
  const hour = now.getHours()
  const greeting = hour < 12 ? 'Bonjour' : hour < 18 ? 'Bon après-midi' : 'Bonsoir'

  if (loading) {
    return (
      <div className="space-y-6 pb-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <SkeletonKPI key={i} />)}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Welcome banner */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="relative overflow-hidden rounded-[4px] border border-white/[0.06] px-6 py-5"
        style={{ background: 'linear-gradient(135deg, #1a1f3a 0%, #12121a 60%, #1a1209 100%)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-5 blur-3xl" style={{ background: '#9B4D96' }} />
        <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-medium text-[#9B4D96] uppercase tracking-widest mb-1">Kucibok Bridge — Curateur International</p>
            <h1 className="font-playfair text-2xl text-white">
              {greeting}, {name}.
            </h1>
            <p className="text-kcb-pierre text-sm mt-1">
              {MOCK.user.role} · {MOCK.user.institution}
            </p>
          </div>
          <div className="flex flex-col items-start sm:items-end gap-1">
            <span className="text-xs text-kcb-pierre">Exposition en préparation</span>
            <span className="font-playfair text-white font-semibold text-sm">{ex.title}</span>
            <span className="text-xs text-kcb-or">{ex.openingDate} → {ex.closingDate}</span>
          </div>
        </div>
      </motion.div>

      {/* Alerts */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="space-y-2"
      >
        {MOCK.alerts.map((alert, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-[4px] text-sm border ${
              alert.level === 'warning'
                ? 'bg-amber-500/5 border-amber-500/20 text-amber-300'
                : alert.level === 'success'
                  ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-300'
                  : 'bg-[#9B4D96]/5 border-[#9B4D96]/20 text-[#c084d8]'
            }`}
          >
            <alert.icon className="w-4 h-4 flex-shrink-0" />
            <span>{alert.text}</span>
          </div>
        ))}
      </motion.div>

      {/* KPI row */}
      <motion.div variants={stagger} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div variants={fadeUp}>
          <KPICard icon={Users} label="Artistes shortlistés" value={ex.shortlisted} subtitle={`${ex.confirmed} confirmés`} iconColor="text-[#9B4D96]" iconBgColor="bg-[#9B4D96]/10" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <KPICard icon={Package} label="Œuvres sélectionnées" value={ex.artworksSelected} subtitle="sur 20 cibles" iconColor="text-kcb-or" iconBgColor="bg-kcb-or/10" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <KPICard icon={DollarSign} label="Budget utilisé" value={`£${(ex.budgetUsed / 1000).toFixed(0)}k`} subtitle={`${budgetPct}% du total`} iconColor="text-emerald-400" iconBgColor="bg-emerald-400/10" />
        </motion.div>
        <motion.div variants={fadeUp}>
          <KPICard icon={Calendar} label="Jours restants" value={ex.daysLeft} subtitle={`Ouverture : ${ex.openingDate}`} iconColor="text-kcb-bronze" iconBgColor="bg-kcb-bronze/10" />
        </motion.div>
      </motion.div>

      {/* Budget progress + Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Budget tracker */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.22 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-kcb-or" />
              Budget exposition
            </h3>
            <button
              onClick={() => setTab(4)}
              className="text-xs text-kcb-or hover:text-kcb-bronze flex items-center gap-1 transition"
            >
              Détails <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="flex justify-between items-baseline mb-2">
            <span className="text-2xl font-bold text-white font-jetbrains">
              £{ex.budgetUsed.toLocaleString()}
            </span>
            <span className="text-sm text-kcb-pierre">/ £{ex.budget.toLocaleString()}</span>
          </div>
          <div className="h-2 bg-white/[0.06] rounded-full mb-3">
            <div
              className="h-2 rounded-full transition-all duration-700"
              style={{ width: `${budgetPct}%`, background: 'linear-gradient(90deg, #9B4D96, #C9A84C)' }}
            />
          </div>
          <div className="grid grid-cols-3 gap-3 mt-4">
            {[
              { label: 'Honoraires artistes', amount: '£18 200', pct: 38 },
              { label: 'Logistique', amount: '£14 600', pct: 31 },
              { label: 'Concierge', amount: '£15 000', pct: 31 },
            ].map((item, i) => (
              <div key={i} className="bg-kcb-noir/40 rounded-[4px] p-3">
                <p className="text-xs text-kcb-pierre mb-1 leading-tight">{item.label}</p>
                <p className="text-sm font-semibold text-white">{item.amount}</p>
                <p className="text-xs text-kcb-pierre">{item.pct}%</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Artwork pipeline */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.26 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Package className="w-4 h-4 text-[#9B4D96]" />
              Pipeline artistes
            </h3>
            <button
              onClick={() => setTab(1)}
              className="text-xs text-kcb-or hover:text-kcb-bronze flex items-center gap-1 transition"
            >
              Découvrir <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            {MOCK.pipeline.map((s, i) => (
              <div key={i} className={`border rounded-[4px] p-3 ${s.border} ${s.bg}`}>
                <div className={`flex items-center justify-between mb-1 ${s.color}`}>
                  <span className="text-xs">{s.label}</span>
                </div>
                <p className={`text-2xl font-bold ${s.color}`}>{s.count}</p>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden flex">
            <div className="h-full bg-[#9B4D96]/60" style={{ width: '20%' }} />
            <div className="h-full bg-kcb-or/60" style={{ width: '30%' }} />
            <div className="h-full bg-emerald-400/60" style={{ width: '10%' }} />
            <div className="h-full bg-kcb-bronze/60" style={{ width: '5%' }} />
          </div>
          <p className="text-xs text-kcb-pierre mt-1.5">Progression vers l'objectif de 20 artistes</p>
        </motion.div>
      </div>

      {/* Concierge services en cours */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Star className="w-4 h-4 text-kcb-or" />
            Services Concierge actifs
          </h3>
          <button
            onClick={() => setTab(3)}
            className="text-xs text-kcb-or hover:text-kcb-bronze flex items-center gap-1 transition"
          >
            Voir tout <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-3">
          {MOCK.concierge.map((s, i) => {
            const sc = statusConfig[s.status]
            return (
              <div
                key={i}
                className="flex items-center justify-between bg-kcb-noir/40 rounded-[4px] px-4 py-3 hover:bg-kcb-noir/60 transition"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-[#9B4D96]/15 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-3.5 h-3.5 text-[#9B4D96]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-white font-medium truncate">{s.type}</p>
                    <p className="text-xs text-kcb-pierre truncate">{s.artist} · {s.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 flex-shrink-0 ml-3">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                  <span className="text-sm font-semibold text-kcb-or font-jetbrains">{s.price}</span>
                </div>
              </div>
            )
          })}
        </div>
      </motion.div>

      {/* Top artistes shortlistés */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.36 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            Artistes shortlistés
          </h3>
          <button
            onClick={() => setTab(1)}
            className="text-xs text-kcb-or hover:text-kcb-bronze flex items-center gap-1 transition"
          >
            Découverte <ArrowRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          {MOCK.topArtists.map((artist, i) => (
            <div
              key={i}
              className="flex items-center justify-between bg-kcb-noir/30 rounded-[4px] px-4 py-3 hover:bg-kcb-noir/50 transition cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <span className="w-5 text-xs text-kcb-pierre text-right">{i + 1}</span>
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#9B4D96]/40 to-kcb-or/20 flex items-center justify-center text-xs font-bold text-white">
                  {artist.name.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-white font-medium">{artist.name}</p>
                    {artist.verified && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>
                  <p className="text-xs text-kcb-pierre">{artist.country} · {artist.medium}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-xs text-kcb-pierre">Score KCB</p>
                  <p className="text-sm font-bold text-kcb-or">{artist.score}/100</p>
                </div>
                <div className="w-16 h-1.5 bg-white/[0.06] rounded-full">
                  <div className="h-1.5 rounded-full bg-kcb-or" style={{ width: `${artist.score}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-3"
      >
        {[
          { label: 'Découvrir artistes', icon: Users, tab: 1, accent: '#9B4D96' },
          { label: 'Réserver concierge', icon: Star, tab: 3, accent: '#C9A84C' },
          { label: 'Devis logistique', icon: Truck, tab: 2, accent: '#8B6914' },
          { label: 'Suivi budget', icon: DollarSign, tab: 4, accent: '#10B981' },
        ].map((a, i) => (
          <button
            key={i}
            onClick={() => setTab(a.tab)}
            className="flex flex-col items-center gap-2 p-4 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] hover:border-white/10 hover:bg-kcb-ardoise/80 transition text-center"
          >
            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${a.accent}20` }}>
              <a.icon className="w-4 h-4" style={{ color: a.accent }} />
            </div>
            <span className="text-xs text-kcb-pierre leading-tight">{a.label}</span>
          </button>
        ))}
      </motion.div>
    </div>
  )
}
