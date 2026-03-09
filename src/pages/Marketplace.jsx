import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Search, SlidersHorizontal, ShieldCheck, X, Loader2, ArrowRight
} from "lucide-react"
import { getApprovedArtworks } from "../api/useArtworks"

/** Number of artworks shown per page load. */
const PAGE_SIZE = 12

/** Sort comparator functions keyed by sort option value. */
const SORT_FNS = {
  recent:    (a, b) => new Date(b.createdAt ?? 0) - new Date(a.createdAt ?? 0),
  price_asc: (a, b) => (Number(a.price) || 0) - (Number(b.price) || 0),
  price_desc:(a, b) => (Number(b.price) || 0) - (Number(a.price) || 0),
}

const SORT_LABELS = {
  recent:    "Plus récent",
  price_asc: "Prix croissant",
  price_desc:"Prix décroissant",
}

/**
 * Artwork card — displays image, title, artist, price and KCB badge.
 *
 * @param {{ artwork: object }} props
 */
function ArtworkCard({ artwork }) {
  return (
    <Link
      to={`/artwork/${artwork._id}`}
      className="group bg-gray-800 border border-gray-700 hover:border-indigo-600/50 rounded-xl overflow-hidden transition-all hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-gray-700 overflow-hidden">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-600">
            <span className="text-4xl">🖼️</span>
          </div>
        )}

        {artwork.kuciobkId && (
          <div
            className="absolute top-2 right-2 bg-indigo-500/90 backdrop-blur-sm rounded-full p-1"
            title="Certifié Standard Kucibok"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-white" />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate leading-snug">
          {artwork.title}
        </p>
        <p className="text-gray-400 text-xs mt-0.5 truncate">
          {artwork.artist ?? "Artiste inconnu"}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          {artwork.forSale && artwork.price ? (
            <p className="text-amber-400 text-xs font-semibold">
              {Number(artwork.price).toLocaleString("fr-FR")}{" "}
              {artwork.currency || "XOF"}
            </p>
          ) : (
            <p className="text-gray-600 text-xs">Non disponible</p>
          )}

          {artwork.kuciobkId && (
            <span className="flex items-center gap-1 text-indigo-400 text-[10px] font-medium">
              <ShieldCheck className="w-3 h-3" /> KCB
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}

/**
 * Marketplace page — full public catalogue with client-side filtering.
 * Route: /marketplace
 *
 * @returns {JSX.Element}
 */
export default function Marketplace() {
  const [allArtworks, setAllArtworks]   = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState("")
  const [category, setCategory]         = useState("Tous")
  const [forSaleOnly, setForSaleOnly]   = useState(false)
  const [certifiedOnly, setCertifiedOnly] = useState(false)
  const [sort, setSort]                 = useState("recent")
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  useEffect(() => {
    window.scrollTo(0, 0)
    getApprovedArtworks().then((result) => {
      if (Array.isArray(result?.data)) {
        setAllArtworks(result.data)
      } else if (Array.isArray(result)) {
        setAllArtworks(result)
      }
      setLoading(false)
    })
  }, [])

  /** Unique categories derived from artwork data. */
  const categories = ["Tous", ...new Set(allArtworks.map((a) => a.category).filter(Boolean))]

  /** Artworks after all active filters + sort applied. */
  const filtered = allArtworks
    .filter((a) => {
      if (search) {
        const q = search.toLowerCase()
        const matchTitle  = a.title?.toLowerCase().includes(q)
        const matchArtist = a.artist?.toLowerCase().includes(q)
        if (!matchTitle && !matchArtist) return false
      }
      if (category !== "Tous" && a.category !== category) return false
      if (forSaleOnly && !a.forSale) return false
      if (certifiedOnly && !a.kuciobkId) return false
      return true
    })
    .sort(SORT_FNS[sort])

  const visible   = filtered.slice(0, visibleCount)
  const hasMore   = visibleCount < filtered.length
  const artistCount  = new Set(allArtworks.map((a) => a.artist).filter(Boolean)).size
  const countryCount = new Set(allArtworks.map((a) => a.country).filter(Boolean)).size

  /** Load 12 more artworks. */
  const loadMore = useCallback(() => {
    setVisibleCount((prev) => prev + PAGE_SIZE)
  }, [])

  /** Reset all filters to default state. */
  const clearFilters = useCallback(() => {
    setSearch("")
    setCategory("Tous")
    setForSaleOnly(false)
    setCertifiedOnly(false)
    setSort("recent")
    setVisibleCount(PAGE_SIZE)
  }, [])

  const hasActiveFilters =
    search || category !== "Tous" || forSaleOnly || certifiedOnly || sort !== "recent"

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ── PAGE HEADER ── */}
      <div className="bg-gradient-to-br from-indigo-950/50 via-gray-900 to-gray-900 border-b border-gray-800 px-4 md:px-6 lg:px-8 py-14">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center gap-2 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-xs px-3 py-1 rounded-full font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Certifié blockchain
            </span>
          </div>

          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Marketplace
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mb-8">
            Découvrez des milliers d'œuvres d'art africain et international certifiées blockchain
          </p>

          {/* Stats */}
          {!loading && (
            <div className="flex flex-wrap gap-6 text-sm">
              <div>
                <span className="text-indigo-400 font-bold text-xl">{allArtworks.length}</span>
                <span className="text-gray-400 ml-2">œuvres disponibles</span>
              </div>
              <div className="text-gray-600">·</div>
              <div>
                <span className="text-indigo-400 font-bold text-xl">{artistCount}</span>
                <span className="text-gray-400 ml-2">artistes</span>
              </div>
              {countryCount > 0 && (
                <>
                  <div className="text-gray-600">·</div>
                  <div>
                    <span className="text-indigo-400 font-bold text-xl">{countryCount}</span>
                    <span className="text-gray-400 ml-2">pays</span>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* ── FILTER BAR ── */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-4 mb-8 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
                placeholder="Rechercher par titre ou artiste…"
                className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setVisibleCount(PAGE_SIZE) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category */}
            <div className="relative">
              <select
                value={category}
                onChange={(e) => { setCategory(e.target.value); setVisibleCount(PAGE_SIZE) }}
                className="appearance-none bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setVisibleCount(PAGE_SIZE) }}
                className="appearance-none bg-gray-900 border border-gray-700 rounded-lg pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition"
              >
                {Object.entries(SORT_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-500 pointer-events-none" />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-lg px-3 py-2 transition"
              >
                <X className="w-3.5 h-3.5" /> Réinitialiser
              </button>
            )}
          </div>

          {/* Toggle filters */}
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => { setForSaleOnly(!forSaleOnly); setVisibleCount(PAGE_SIZE) }}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                forSaleOnly
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              En vente
            </button>
            <button
              onClick={() => { setCertifiedOnly(!certifiedOnly); setVisibleCount(PAGE_SIZE) }}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                certifiedOnly
                  ? "bg-indigo-600 border-indigo-500 text-white"
                  : "bg-gray-900 border-gray-700 text-gray-400 hover:text-white hover:border-gray-500"
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Certifié KCB
            </button>

            <span className="ml-auto text-xs text-gray-500 self-center">
              {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {/* ── RESULTS ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
            <p className="text-gray-400 text-sm">Chargement des œuvres…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <span className="text-5xl">🎨</span>
            <p className="text-gray-300 text-lg font-medium">Aucune œuvre trouvée</p>
            <p className="text-gray-500 text-sm max-w-xs">
              Essayez d'ajuster vos filtres ou élargissez votre recherche.
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition"
            >
              <X className="w-4 h-4" /> Réinitialiser les filtres
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {visible.map((artwork) => (
                <ArtworkCard key={artwork._id} artwork={artwork} />
              ))}
            </div>

            {/* Load More */}
            {hasMore && (
              <div className="text-center mt-10">
                <button
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 hover:border-indigo-600/50 text-white text-sm font-medium rounded-lg transition"
                >
                  Voir plus d'œuvres <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-gray-600 text-xs mt-2">
                  {visible.length} / {filtered.length} œuvres affichées
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
