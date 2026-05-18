import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Globe,
  BarChart3,
  Calendar,
  Download,
  ChevronRight,
  Video,
  FileText,
  MapPin,
  Clock,
  Star,
} from 'lucide-react'

const TABS = [
  { id: 'countries', label: 'Scènes par pays', icon: Globe },
  { id: 'market', label: 'Rapports marché', icon: BarChart3 },
  { id: 'webinars', label: 'Webinaires', icon: Video },
  { id: 'history', label: 'Histoire de l\'art', icon: BookOpen },
]

const COUNTRIES = [
  {
    name: 'Sénégal',
    flag: '🇸🇳',
    capital: 'Dakar',
    artMarketSize: '~€45M',
    keyInstitutions: ['Biennale de Dakar (Dak\'Art)', 'IFAN Musée d\'art africain', 'Galerie Arte'],
    keyMediums: ['Photographie', 'Installation', 'Textile'],
    keyArtists: ['Aïcha Diallo', 'Omar Victor Diop', 'Soly Cissé'],
    trend: 'En forte croissance. Dakar est le hub régional. Dak\'Art (biennale paires) est le rendez-vous incontournable.',
    exportRegs: 'Permis requis. Délai 15–30 jours.',
    color: '#9B4D96',
  },
  {
    name: 'Ghana',
    flag: '🇬🇭',
    capital: 'Accra / Kumasi',
    artMarketSize: '~€60M',
    keyInstitutions: ['Ghana Museums & Monuments Board', 'Nubuke Foundation', 'Artist Alliance Gallery'],
    keyMediums: ['Peinture', 'Textiles (Kente)', 'Art numérique'],
    keyArtists: ['Kofi Mensah', 'Ibrahim Mahama', 'Lynette Yiadom-Boakye'],
    trend: 'Le marché ghanéen est le plus actif d\'Afrique de l\'Ouest. Accra est devenu un pôle créatif international.',
    exportRegs: 'Standard. Délai 10–20 jours.',
    color: '#C9A84C',
  },
  {
    name: 'Nigeria',
    flag: '🇳🇬',
    capital: 'Lagos',
    artMarketSize: '~€120M',
    keyInstitutions: ['National Gallery of Art', 'Nike Art Gallery', 'Art House Contemporary'],
    keyMediums: ['Peinture', 'Sculpture', 'Art urbain'],
    keyArtists: ['Njideka Akunyili Crosby', 'El Anatsui', 'Yinka Shonibare'],
    trend: 'Le plus grand marché d\'Afrique. Lagos est en pleine explosion créative avec une jeunesse artistique très active.',
    exportRegs: 'Permis NCMM requis. Délai 20–45 jours.',
    color: '#10B981',
  },
  {
    name: "Côte d'Ivoire",
    flag: '🇨🇮',
    capital: 'Abidjan',
    artMarketSize: '~€35M',
    keyInstitutions: ['Musée des Civilisations de CI', 'Galerie Houkami', 'Les Ateliers de la Pensée'],
    keyMediums: ['Textile & Fibre', 'Peinture', 'Sculpture'],
    keyArtists: ['Mariama Balde', 'Frédéric Bruly Bouabré'],
    trend: 'Abidjan se réaffirme comme place culturelle majeure avec une scène galerie en développement rapide.',
    exportRegs: 'Standard. Délai 10–20 jours.',
    color: '#F59E0B',
  },
]

const REPORTS = [
  {
    title: 'African Art Market Report 2025',
    publisher: 'Kucibok Research & ArtTactic',
    pages: 84,
    date: 'Mars 2025',
    summary: "Analyse complète du marché de l'art africain en 2025. Volumes, prix, acteurs, tendances d'exportation.",
    topics: ['Valorisation', 'Exportation', 'Collectors profile', 'Auction results'],
    premium: true,
    size: '4.2 MB',
  },
  {
    title: "Guide du curateur international — Art d'Afrique de l'Ouest",
    publisher: 'Kucibok Bridge',
    pages: 42,
    date: 'Janvier 2025',
    summary: 'Guide pratique pour les curateurs découvrant le marché : artistes, galeries, institutions, logistique.',
    topics: ['Vérification artistes', 'Logistique', 'Droit & permis', 'Réseaux'],
    premium: false,
    size: '2.1 MB',
  },
  {
    title: 'Photography & New Media — West Africa 2024',
    publisher: 'Kucibok Research',
    pages: 38,
    date: 'Décembre 2024',
    summary: 'Focus sur la scène photo et médias numériques : Sénégal, Ghana, Nigeria. Artistes émergents et confirmés.',
    topics: ['Photographie documentaire', 'Vidéo art', 'NFT & digital'],
    premium: false,
    size: '1.8 MB',
  },
  {
    title: 'Provenance & Authenticité — Enjeux 2025',
    publisher: 'Kucibok Legal & Research',
    pages: 26,
    date: 'Février 2025',
    summary: 'État des enjeux de provenance, certification et traçabilité dans le marché de l\'art africain contemporain.',
    topics: ['Certification KCB', 'Provenance', 'Droit international', 'Bonnes pratiques'],
    premium: true,
    size: '1.2 MB',
  },
]

const WEBINARS = [
  {
    title: 'Découvrir et vérifier un artiste africain — les outils Kucibok',
    date: '28 mai 2025 — 15h00 CET',
    duration: '60 min',
    speakers: ['Moussa Diop (Kucibok)', 'Aïcha Diallo (artiste)'],
    topics: ['Due diligence', 'Badges de vérification', 'Portfolio review'],
    status: 'upcoming',
    registrations: 47,
  },
  {
    title: 'Logistique art Africa → Europe : éviter les pièges',
    date: '11 juin 2025 — 14h00 CET',
    duration: '90 min',
    speakers: ['Équipe Kucibok', 'Expert douanier', 'Logidoo Logistics'],
    topics: ['Transport', 'Permis export', 'Douanes UK/EU', 'Assurance'],
    status: 'upcoming',
    registrations: 31,
  },
  {
    title: 'Négocier avec un artiste africain — contexte culturel & bonnes pratiques',
    date: '25 juin 2025 — 16h00 CET',
    duration: '45 min',
    speakers: ['Fatou Ba (Conseillère culturelle)', 'Kucibok Advisory'],
    topics: ['Communication interculturelle', 'Contrats', 'Acomptes', 'Délais'],
    status: 'upcoming',
    registrations: 62,
  },
  {
    title: "Biennale de Dakar 2024 — Retour d'expérience",
    date: '15 avr. 2025 — 15h00 CET',
    duration: '75 min',
    speakers: ['Équipe Kucibok', '3 curateurs participants'],
    topics: ['Dak\'Art', 'Artistes découverts', 'Networking'],
    status: 'recorded',
    views: 143,
  },
]

const HISTORY = [
  {
    period: 'Préhistoire — 1900',
    title: 'Art traditionnel et art masque',
    description: 'Les civilisations africaines développent des traditions artistiques complexes : masques rituels Dogon, bronzes du Bénin, sculptures Yoruba. Ces œuvres circulent en Europe dès le XIXe siècle et influencent profondément le cubisme.',
    movements: ['Art Ife', 'Bronzes du Bénin', 'Masques Dogon', 'Sculptures Nok'],
    color: '#8B6914',
  },
  {
    period: '1900 — 1960',
    title: 'Art colonial et identité',
    description: "Sous la colonisation, des artistes africains s'approprient les codes européens tout en préservant leurs identités. L'École de Dakar naît dans les années 1960, portée par la négritude de Senghor.",
    movements: ['École de Dakar', 'Négritude', 'Oshogbo Art School'],
    color: '#9B4D96',
  },
  {
    period: '1960 — 1990',
    title: 'Indépendances et affirmation',
    description: "Les indépendances libèrent la création artistique africaine. L'art contemporain africain se construit entre tradition et modernité, affirmation politique et expérimentation formelle.",
    movements: ['Pan-africanisme', 'Art politique', 'Afrocentrisme'],
    color: '#C9A84C',
  },
  {
    period: '1990 — 2010',
    title: 'Globalisation et biennales',
    description: "La Biennale de Dakar (1992) et la Johannesburg Biennale (1995) internationalisent l'art contemporain africain. Des artistes comme El Anatsui entrent dans les grandes collections mondiales.",
    movements: ['Dak\'Art', 'Afropolitanisme', 'Diaspora'],
    color: '#10B981',
  },
  {
    period: '2010 — Aujourd\'hui',
    title: 'Afrofuturisme et marché global',
    description: "L'Afrofuturisme (Octavia Butler → art visuel) redéfinit la vision de l'Afrique. Le marché explose : les ventes d'art africain contemporain atteignent des records en salle des ventes. La certification et la traçabilité deviennent des enjeux centraux.",
    movements: ['Afrofuturisme', 'Art numérique', 'NFT', 'Certification KCB'],
    color: '#9B4D96',
  },
]

function CountriesTab() {
  const [selected, setSelected] = useState(0)
  const country = COUNTRIES[selected]
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <div className="space-y-2">
        {COUNTRIES.map((c, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`w-full flex items-center gap-3 p-3 rounded-[4px] text-left transition border ${selected === i ? 'border-[#9B4D96]/40 bg-[#9B4D96]/10' : 'border-white/[0.06] bg-kcb-ardoise hover:bg-white/[0.04]'}`}
          >
            <span className="text-xl">{c.flag}</span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">{c.name}</p>
              <p className="text-xs text-kcb-pierre">{c.artMarketSize} marché estimé</p>
            </div>
            <ChevronRight className={`w-4 h-4 flex-shrink-0 ml-auto transition ${selected === i ? 'text-[#9B4D96]' : 'text-kcb-pierre'}`} />
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selected}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="lg:col-span-2 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5 space-y-4"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{country.flag}</span>
            <div>
              <h3 className="font-playfair text-lg text-white">{country.name}</h3>
              <p className="text-xs text-kcb-pierre">{country.capital} · {country.artMarketSize} marché</p>
            </div>
          </div>

          <p className="text-sm text-kcb-sable leading-relaxed">{country.trend}</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Institutions clés</p>
              <ul className="space-y-1">
                {country.keyInstitutions.map((inst, i) => (
                  <li key={i} className="text-xs text-kcb-sable flex items-center gap-1.5">
                    <MapPin className="w-3 h-3 text-kcb-or flex-shrink-0" /> {inst}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Médiums dominants</p>
              <div className="flex flex-wrap gap-1.5">
                {country.keyMediums.map((m, i) => (
                  <span key={i} className="text-xs bg-white/[0.06] text-kcb-sable px-2 py-0.5 rounded-full">{m}</span>
                ))}
              </div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2 mt-3">Artistes notables</p>
              <div className="flex flex-wrap gap-1.5">
                {country.keyArtists.map((a, i) => (
                  <span key={i} className="text-xs bg-[#9B4D96]/10 text-[#c084d8] px-2 py-0.5 rounded-full border border-[#9B4D96]/20">{a}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-kcb-noir/40 rounded-[4px] flex items-start gap-2">
            <FileText className="w-3.5 h-3.5 text-kcb-or mt-0.5 flex-shrink-0" />
            <p className="text-xs text-kcb-pierre"><span className="text-white font-medium">Réglementation export : </span>{country.exportRegs}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

function MarketTab() {
  return (
    <div className="space-y-3">
      {REPORTS.map((r, i) => (
        <div key={i} className={`bg-kcb-ardoise border rounded-[4px] p-4 ${r.premium ? 'border-kcb-or/20' : 'border-white/[0.06]'}`}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-sm font-semibold text-white">{r.title}</h3>
                {r.premium && <span className="text-[10px] bg-kcb-or/15 text-kcb-or px-1.5 py-0.5 rounded-full">Premium</span>}
              </div>
              <p className="text-xs text-kcb-pierre mb-2">{r.publisher} · {r.date} · {r.pages} pages · {r.size}</p>
              <p className="text-xs text-kcb-sable mb-2">{r.summary}</p>
              <div className="flex flex-wrap gap-1.5">
                {r.topics.map((t, j) => (
                  <span key={j} className="text-[10px] bg-white/[0.06] text-kcb-pierre px-2 py-0.5 rounded-full">{t}</span>
                ))}
              </div>
            </div>
            <button className={`flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-medium flex-shrink-0 transition ${r.premium ? 'bg-kcb-or text-kcb-noir hover:bg-kcb-bronze' : 'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06]'}`}>
              <Download className="w-3.5 h-3.5" />
              {r.premium ? 'Accès Premium' : 'Télécharger'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function WebinarsTab() {
  return (
    <div className="space-y-4">
      {WEBINARS.map((w, i) => (
        <div key={i} className={`bg-kcb-ardoise border rounded-[4px] p-4 ${w.status === 'upcoming' ? 'border-[#9B4D96]/20' : 'border-white/[0.06]'}`}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${w.status === 'upcoming' ? 'bg-[#9B4D96]/15 text-[#c084d8]' : 'bg-white/[0.06] text-kcb-pierre'}`}>
                  {w.status === 'upcoming' ? '📅 À venir' : '🎬 Enregistré'}
                </span>
              </div>
              <h3 className="text-sm font-semibold text-white">{w.title}</h3>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-kcb-pierre mb-3">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {w.date}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {w.duration}</span>
            <span className="flex items-center gap-1 col-span-2">
              <Star className="w-3 h-3" /> {w.speakers.join(' · ')}
            </span>
          </div>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {w.topics.map((t, j) => (
              <span key={j} className="text-[10px] bg-white/[0.06] text-kcb-pierre px-2 py-0.5 rounded-full">{t}</span>
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-kcb-pierre">
              {w.status === 'upcoming' ? `${w.registrations} inscrits` : `${w.views} vues`}
            </span>
            <button className={`flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-xs font-medium transition ${w.status === 'upcoming' ? 'bg-[#9B4D96]/20 text-[#c084d8] border border-[#9B4D96]/30 hover:bg-[#9B4D96]/30' : 'bg-white/[0.06] text-white border border-white/[0.06] hover:bg-white/[0.1]'}`}>
              <Video className="w-3 h-3" />
              {w.status === 'upcoming' ? "S'inscrire" : 'Voir le replay'}
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

function HistoryTab() {
  const [expanded, setExpanded] = useState(4)
  return (
    <div className="space-y-3">
      <div className="relative pl-6">
        <div className="absolute left-2 top-0 bottom-0 w-px bg-white/[0.06]" />
        {HISTORY.map((h, i) => (
          <div key={i} className="relative mb-4">
            <div
              className="absolute -left-5 top-5 w-3 h-3 rounded-full border-2 border-kcb-noir"
              style={{ background: h.color }}
            />
            <button
              onClick={() => setExpanded(expanded === i ? -1 : i)}
              className={`w-full text-left bg-kcb-ardoise border rounded-[4px] p-4 transition ${expanded === i ? 'border-white/10' : 'border-white/[0.06] hover:border-white/10'}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs font-medium" style={{ color: h.color }}>{h.period}</span>
                  <h3 className="text-sm font-semibold text-white mt-0.5">{h.title}</h3>
                </div>
                <ChevronRight className={`w-4 h-4 text-kcb-pierre flex-shrink-0 transition-transform ${expanded === i ? 'rotate-90' : ''}`} />
              </div>
              <AnimatePresence>
                {expanded === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <p className="text-xs text-kcb-sable leading-relaxed mt-3 mb-3">{h.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {h.movements.map((m, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full border" style={{ background: `${h.color}15`, color: h.color, borderColor: `${h.color}30` }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export function LearningHub() {
  const [activeTab, setActiveTab] = useState('countries')

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="font-playfair text-xl text-white">Hub Éducatif</h2>
        <p className="text-sm text-kcb-pierre mt-0.5">Ressources pour comprendre et naviguer le marché de l'art africain</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pays couverts', value: '12', icon: Globe, color: 'text-[#9B4D96]', bg: 'bg-[#9B4D96]/10' },
          { label: 'Rapports disponibles', value: '4', icon: FileText, color: 'text-kcb-or', bg: 'bg-kcb-or/10' },
          { label: 'Webinaires à venir', value: '3', icon: Video, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
          { label: 'Siècles d\'histoire', value: '5', icon: BookOpen, color: 'text-kcb-bronze', bg: 'bg-kcb-bronze/10' },
        ].map((s, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-kcb-pierre leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${
              activeTab === t.id
                ? 'bg-[#9B4D96]/20 text-[#c084d8] border border-[#9B4D96]/30'
                : 'text-kcb-pierre hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'countries' && <CountriesTab />}
          {activeTab === 'market' && <MarketTab />}
          {activeTab === 'webinars' && <WebinarsTab />}
          {activeTab === 'history' && <HistoryTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
