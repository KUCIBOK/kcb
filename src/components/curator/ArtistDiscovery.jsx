import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Search,
  Filter,
  CheckCircle,
  Star,
  MapPin,
  Globe,
  Phone,
  Mail,
  Award,
  Image,
  Calendar,
  X,
  Download,
  ExternalLink,
  ChevronDown,
} from 'lucide-react'

const ARTISTS = [
  {
    id: 1,
    name: 'Aïcha Diallo',
    country: 'Sénégal',
    flag: '🇸🇳',
    city: 'Dakar',
    medium: 'Photographie',
    style: 'Documentaire contemporain',
    artworks: 45,
    exhibitions: 23,
    languages: ['Français', 'Wolof', 'Anglais'],
    contact: ['WhatsApp', 'Email'],
    badges: { id: true, portfolio: true, cv: true, address: true, references: true },
    score: 98,
    priceRange: '€2 000 – €15 000',
    bio: "Aïcha Diallo est l'une des photographes les plus influentes d'Afrique de l'Ouest. Son travail documente les mutations urbaines et identitaires du Sénégal contemporain.",
    recentShow: 'Biennale de Dakar 2024',
    curatorReviews: 3,
    image: null,
    shortlisted: true,
  },
  {
    id: 2,
    name: 'Kofi Mensah',
    country: 'Ghana',
    flag: '🇬🇭',
    city: 'Accra',
    medium: 'Peinture',
    style: 'Afrofuturisme',
    artworks: 62,
    exhibitions: 31,
    languages: ['Anglais', 'Twi'],
    contact: ['Email', 'Zoom'],
    badges: { id: true, portfolio: true, cv: true, address: true, references: true },
    score: 94,
    priceRange: '€3 500 – €22 000',
    bio: "Kofi Mensah puise dans la mythologie akan et les esthétiques numériques pour créer des œuvres qui interrogent le futur de l'identité africaine dans un monde globalisé.",
    recentShow: 'Venice Biennale 2024',
    curatorReviews: 7,
    image: null,
    shortlisted: true,
  },
  {
    id: 3,
    name: 'Amara Touré',
    country: 'Mali',
    flag: '🇲🇱',
    city: 'Bamako',
    medium: 'Sculpture',
    style: 'Art contemporain',
    artworks: 28,
    exhibitions: 15,
    languages: ['Français', 'Bambara'],
    contact: ['Email'],
    badges: { id: true, portfolio: true, cv: true, address: false, references: true },
    score: 91,
    priceRange: '€4 000 – €35 000',
    bio: "Amara Touré travaille le bronze et le bois de récupération pour créer des œuvres monumentales qui dialoguent avec la tradition des forgerons du Mali.",
    recentShow: 'Dak\'Art 2023',
    curatorReviews: 2,
    image: null,
    shortlisted: true,
  },
  {
    id: 4,
    name: 'Fatou Ndiaye',
    country: 'Sénégal',
    flag: '🇸🇳',
    city: 'Saint-Louis',
    medium: 'Installation',
    style: 'Art conceptuel',
    artworks: 19,
    exhibitions: 8,
    languages: ['Français', 'Wolof'],
    contact: ['Email', 'WhatsApp'],
    badges: { id: true, portfolio: true, cv: false, address: true, references: false },
    score: 87,
    priceRange: '€1 500 – €8 000',
    bio: "Fatou Ndiaye crée des installations immersives qui explorent la mémoire collective et les archives féminines de l'Afrique de l'Ouest.",
    recentShow: 'Festival Afrique en Créations 2024',
    curatorReviews: 1,
    image: null,
    shortlisted: false,
  },
  {
    id: 5,
    name: 'Yaw Darko',
    country: 'Ghana',
    flag: '🇬🇭',
    city: 'Kumasi',
    medium: 'Vidéo & Numérique',
    style: 'Art numérique',
    artworks: 34,
    exhibitions: 19,
    languages: ['Anglais', 'Twi', 'Français'],
    contact: ['Email', 'Zoom', 'Signal'],
    badges: { id: true, portfolio: true, cv: true, address: true, references: true },
    score: 85,
    priceRange: '€800 – €12 000',
    bio: "Yaw Darko explore les intersections entre technologie, spiritualité et identité ghanéenne à travers des installations vidéo et des œuvres d'art numérique.",
    recentShow: 'Tate Exchange 2023',
    curatorReviews: 4,
    image: null,
    shortlisted: true,
  },
  {
    id: 6,
    name: 'Mariama Balde',
    country: "Côte d'Ivoire",
    flag: '🇨🇮',
    city: 'Abidjan',
    medium: 'Textile & Fibre',
    style: 'Art textile',
    artworks: 41,
    exhibitions: 22,
    languages: ['Français', 'Dioula', 'Anglais'],
    contact: ['WhatsApp', 'Email'],
    badges: { id: true, portfolio: true, cv: true, address: true, references: true },
    score: 92,
    priceRange: '€2 500 – €18 000',
    bio: "Mariama Balde tisse des récits de résistance et de résilience à travers des textiles monumentaux qui mêlent techniques traditionnelles ivoiriennes et matériaux contemporains.",
    recentShow: "Musée d'Art Moderne de Paris 2024",
    curatorReviews: 5,
    image: null,
    shortlisted: false,
  },
]

const COUNTRIES = ['Tous', 'Sénégal', 'Ghana', 'Mali', "Côte d'Ivoire", 'Nigeria', 'Kenya']
const MEDIUMS = ['Tous', 'Peinture', 'Photographie', 'Sculpture', 'Installation', 'Vidéo & Numérique', 'Textile & Fibre']

const badgeKeys = [
  { key: 'id', label: 'ID' },
  { key: 'portfolio', label: 'Portfolio' },
  { key: 'cv', label: 'CV' },
  { key: 'address', label: 'Adresse' },
  { key: 'references', label: 'Références' },
]

function VerificationBadges({ badges }) {
  const count = Object.values(badges).filter(Boolean).length
  const total = Object.values(badges).length
  return (
    <div className="flex flex-wrap gap-1.5">
      {badgeKeys.map((b) => (
        <span
          key={b.key}
          className={`inline-flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
            badges[b.key]
              ? 'bg-emerald-400/15 text-emerald-400 border border-emerald-400/20'
              : 'bg-white/[0.04] text-kcb-pierre border border-white/[0.06]'
          }`}
        >
          {badges[b.key] ? '✓' : '×'} {b.label}
        </span>
      ))}
      <span className="text-xs text-kcb-pierre ml-1 self-center">{count}/{total}</span>
    </div>
  )
}

function ArtistCard({ artist, onSelect, shortlistedIds, onShortlist }) {
  const isShortlisted = shortlistedIds.has(artist.id)
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden hover:border-[#9B4D96]/30 transition-all group"
    >
      {/* Avatar area */}
      <div
        className="h-28 relative flex items-center justify-center"
        style={{ background: 'linear-gradient(135deg, #1a1f3a, #12121a)' }}
      >
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B4D96]/50 to-kcb-or/20 flex items-center justify-center text-2xl font-bold text-white font-playfair">
          {artist.name.charAt(0)}
        </div>
        <div className="absolute top-3 right-3 flex gap-1.5">
          <button
            onClick={(e) => { e.stopPropagation(); onShortlist(artist.id) }}
            className={`w-7 h-7 rounded-full flex items-center justify-center transition ${
              isShortlisted ? 'bg-kcb-or text-kcb-noir' : 'bg-kcb-noir/60 text-kcb-pierre hover:text-kcb-or'
            }`}
            title={isShortlisted ? 'Retirer du shortlist' : 'Ajouter au shortlist'}
          >
            <Star className="w-3.5 h-3.5" />
          </button>
        </div>
        <div className="absolute bottom-2 left-3 flex items-center gap-1">
          <span className="text-sm">{artist.flag}</span>
          <span className="text-xs text-kcb-pierre">{artist.city}</span>
        </div>
        <div className="absolute bottom-2 right-3">
          <span className="text-xs font-bold text-kcb-or">{artist.score}/100</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="text-sm font-semibold text-white">{artist.name}</h3>
            <p className="text-xs text-kcb-pierre">{artist.medium} · {artist.style}</p>
          </div>
        </div>

        <VerificationBadges badges={artist.badges} />

        <div className="grid grid-cols-2 gap-2 mt-3 text-xs text-kcb-pierre">
          <span className="flex items-center gap-1"><Image className="w-3 h-3" /> {artist.artworks} œuvres</span>
          <span className="flex items-center gap-1"><Award className="w-3 h-3" /> {artist.exhibitions} expos</span>
          <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> {artist.languages.slice(0, 2).join(', ')}</span>
          <span className="flex items-center gap-1 text-kcb-or font-medium">{artist.priceRange}</span>
        </div>

        {artist.curatorReviews > 0 && (
          <p className="text-xs text-kcb-pierre mt-2">
            ★ {artist.curatorReviews} avis curateur{artist.curatorReviews > 1 ? 's' : ''}
          </p>
        )}

        <div className="flex gap-2 mt-4">
          <button
            onClick={() => onSelect(artist)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-[#9B4D96]/15 text-[#c084d8] hover:bg-[#9B4D96]/25 rounded-[4px] border border-[#9B4D96]/20 transition"
          >
            <ExternalLink className="w-3 h-3" /> Voir profil
          </button>
          <button className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium bg-kcb-or/10 text-kcb-or hover:bg-kcb-or/20 rounded-[4px] border border-kcb-or/20 transition">
            <Phone className="w-3 h-3" /> Contacter
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function ArtistModal({ artist, onClose }) {
  if (!artist) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 16 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-kcb-ardoise border border-white/[0.08] rounded-[4px] shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#9B4D96]/50 to-kcb-or/20 flex items-center justify-center text-2xl font-bold text-white font-playfair flex-shrink-0">
                {artist.name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-playfair text-xl text-white">{artist.name}</h2>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <p className="text-kcb-pierre text-sm">{artist.flag} {artist.city}, {artist.country}</p>
                <p className="text-xs text-[#9B4D96]">{artist.medium} · {artist.style}</p>
              </div>
            </div>
            <button onClick={onClose} className="text-kcb-pierre hover:text-white transition p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Score */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-kcb-noir/40 rounded-[4px]">
            <div className="text-center">
              <p className="text-3xl font-bold text-kcb-or">{artist.score}</p>
              <p className="text-xs text-kcb-pierre">Score KCB / 100</p>
            </div>
            <div className="flex-1">
              <div className="h-2 bg-white/[0.06] rounded-full">
                <div className="h-2 rounded-full bg-kcb-or" style={{ width: `${artist.score}%` }} />
              </div>
            </div>
          </div>

          {/* Badges */}
          <div className="mb-5">
            <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Vérifications Kucibok</p>
            <VerificationBadges badges={artist.badges} />
          </div>

          {/* Bio */}
          <div className="mb-5">
            <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Biographie</p>
            <p className="text-sm text-kcb-sable leading-relaxed">{artist.bio}</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
            {[
              { label: 'Œuvres', value: artist.artworks },
              { label: 'Expositions', value: artist.exhibitions },
              { label: 'Avis curateurs', value: artist.curatorReviews },
              { label: 'Score', value: `${artist.score}/100` },
            ].map((s, i) => (
              <div key={i} className="bg-kcb-noir/40 rounded-[4px] p-3 text-center">
                <p className="text-xl font-bold text-white">{s.value}</p>
                <p className="text-xs text-kcb-pierre">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Infos */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Langues</p>
              <div className="flex flex-wrap gap-1.5">
                {artist.languages.map((l) => (
                  <span key={l} className="text-xs bg-white/[0.06] text-kcb-sable px-2 py-0.5 rounded-full">{l}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Contact préféré</p>
              <div className="flex flex-wrap gap-1.5">
                {artist.contact.map((c) => (
                  <span key={c} className="text-xs bg-[#9B4D96]/10 text-[#c084d8] px-2 py-0.5 rounded-full border border-[#9B4D96]/20">{c}</span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Fourchette prix</p>
              <p className="text-sm font-semibold text-kcb-or">{artist.priceRange}</p>
            </div>
            <div>
              <p className="text-xs text-kcb-pierre uppercase tracking-wider mb-2">Dernière exposition</p>
              <p className="text-sm text-white">{artist.recentShow}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#9B4D96] text-white font-medium text-sm rounded-[4px] hover:bg-[#8B3D86] transition">
              <Calendar className="w-4 h-4" /> Réserver visite studio
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-kcb-or/10 text-kcb-or font-medium text-sm rounded-[4px] border border-kcb-or/20 hover:bg-kcb-or/20 transition">
              <Download className="w-4 h-4" /> Télécharger portfolio
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-white/[0.04] text-white font-medium text-sm rounded-[4px] border border-white/[0.06] hover:bg-white/[0.08] transition">
              <Mail className="w-4 h-4" /> Contacter
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function ArtistDiscovery() {
  const [search, setSearch] = useState('')
  const [country, setCountry] = useState('Tous')
  const [medium, setMedium] = useState('Tous')
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [selected, setSelected] = useState(null)
  const [shortlistedIds, setShortlistedIds] = useState(new Set([1, 2, 3, 5]))
  const [showFilters, setShowFilters] = useState(false)

  const filtered = ARTISTS.filter((a) => {
    const matchSearch = !search || a.name.toLowerCase().includes(search.toLowerCase()) || a.country.toLowerCase().includes(search.toLowerCase())
    const matchCountry = country === 'Tous' || a.country === country
    const matchMedium = medium === 'Tous' || a.medium === medium
    const matchVerified = !verifiedOnly || Object.values(a.badges).every(Boolean)
    return matchSearch && matchCountry && matchMedium && matchVerified
  })

  const toggleShortlist = (id) => {
    setShortlistedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    <div className="space-y-5 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="font-playfair text-xl text-white">Découverte d'artistes</h2>
          <p className="text-sm text-kcb-pierre mt-0.5">Artistes africains vérifiés · Base Kucibok certifiée</p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-kcb-pierre">{filtered.length} artiste{filtered.length !== 1 ? 's' : ''}</span>
          <span className="text-kcb-pierre">·</span>
          <span className="text-kcb-or">{shortlistedIds.size} shortlistés</span>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kcb-pierre" />
            <input
              type="text"
              placeholder="Rechercher un artiste, un pays..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-kcb-ardoise border border-white/[0.08] rounded-[4px] text-white text-sm placeholder-kcb-pierre focus:outline-none focus:border-[#9B4D96]/50 transition"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-[4px] border text-sm transition ${
              showFilters ? 'bg-[#9B4D96]/15 border-[#9B4D96]/30 text-[#c084d8]' : 'bg-kcb-ardoise border-white/[0.08] text-kcb-pierre hover:text-white'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filtres
          </button>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="flex flex-wrap gap-3 p-4 bg-kcb-ardoise border border-white/[0.06] rounded-[4px]">
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-kcb-pierre">Pays</label>
                  <div className="relative">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 pr-7 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50"
                    >
                      {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-kcb-pierre pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs text-kcb-pierre">Médium</label>
                  <div className="relative">
                    <select
                      value={medium}
                      onChange={(e) => setMedium(e.target.value)}
                      className="appearance-none bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 pr-7 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50"
                    >
                      {MEDIUMS.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-kcb-pierre pointer-events-none" />
                  </div>
                </div>
                <div className="flex flex-col gap-1 justify-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <div
                      onClick={() => setVerifiedOnly(!verifiedOnly)}
                      className={`w-10 h-5 rounded-full relative transition-colors ${verifiedOnly ? 'bg-emerald-500' : 'bg-white/[0.1]'}`}
                    >
                      <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${verifiedOnly ? 'translate-x-5' : 'translate-x-0.5'}`} />
                    </div>
                    <span className="text-sm text-kcb-pierre">100% vérifiés uniquement</span>
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Stats bar */}
      <div className="flex gap-4 overflow-x-auto pb-1">
        {[
          { label: 'Tous', count: ARTISTS.length, active: country === 'Tous' && medium === 'Tous' },
          { label: '100% vérifiés', count: ARTISTS.filter((a) => Object.values(a.badges).every(Boolean)).length, active: verifiedOnly },
          { label: 'Shortlistés', count: shortlistedIds.size, active: false },
        ].map((s, i) => (
          <div key={i} className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${s.active ? 'bg-[#9B4D96]/15 border-[#9B4D96]/30 text-[#c084d8]' : 'border-white/[0.06] text-kcb-pierre'}`}>
            <span>{s.label}</span>
            <span className="font-bold text-white">{s.count}</span>
          </div>
        ))}
      </div>

      {/* Artist grid */}
      <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {filtered.map((artist) => (
            <ArtistCard
              key={artist.id}
              artist={artist}
              onSelect={setSelected}
              shortlistedIds={shortlistedIds}
              onShortlist={toggleShortlist}
            />
          ))}
        </AnimatePresence>
        {filtered.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center py-16 border border-dashed border-white/[0.06] rounded-[4px] text-center">
            <Search className="w-8 h-8 text-kcb-pierre mb-3" />
            <p className="text-kcb-pierre">Aucun artiste trouvé pour ces critères.</p>
            <button onClick={() => { setSearch(''); setCountry('Tous'); setMedium('Tous'); setVerifiedOnly(false) }} className="mt-3 text-xs text-kcb-or underline hover:text-kcb-bronze">
              Réinitialiser les filtres
            </button>
          </div>
        )}
      </motion.div>

      {/* Artist modal */}
      <AnimatePresence>
        {selected && <ArtistModal artist={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  )
}
