import { useState, useEffect, useCallback } from "react"
import { Link } from "react-router-dom"
import {
  Search, SlidersHorizontal, ShieldCheck, X, Loader2, ArrowRight
} from "lucide-react"
import { getApprovedArtworks } from "../api/useArtworks"
import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"

/** Number of artworks shown per page load. */
const PAGE_SIZE = 12

/** Sort comparator functions keyed by sort option value. */
const SORT_FNS = {
  recent:    (a, b) => new Date(b.created_at ?? 0) - new Date(a.created_at ?? 0),
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
      className="group bg-kcb-ardoise border border-white/[0.06] hover:border-kcb-or/40 rounded-[4px] overflow-hidden transition-all hover:-translate-y-0.5"
    >
      <div className="relative aspect-square bg-kcb-noir overflow-hidden">
        {artwork.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-kcb-pierre">
            <span className="text-4xl">🖼️</span>
          </div>
        )}

        {artwork.kucibok_id && (
          <div
            className="absolute top-2 right-2 bg-kcb-or/90 backdrop-blur-sm rounded-full p-1"
            title="Certifié Standard Kucibok"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-kcb-noir" />
          </div>
        )}
      </div>

      <div className="p-3">
        <p className="text-white text-sm font-semibold truncate leading-snug">
          {artwork.title}
        </p>
        <p className="text-kcb-pierre text-xs mt-0.5 truncate">
          {artwork.artist ?? "Artiste inconnu"}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          {artwork.for_sale && artwork.price ? (
            <p className="text-kcb-or text-xs font-semibold">
              {Number(artwork.price).toLocaleString("fr-FR")}{" "}
              {artwork.currency || "XOF"}
            </p>
          ) : (
            <p className="text-kcb-pierre/60 text-xs">Non disponible</p>
          )}

          {artwork.kucibok_id && (
            <span className="flex items-center gap-1 text-kcb-or text-[10px] font-medium">
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
      if (forSaleOnly && !a.for_sale) return false
      if (certifiedOnly && !a.kucibok_id) return false
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
    <div className="min-h-screen bg-kcb-noir-deep text-white">
      {/* ── PAGE HEADER ── */}
      <div className="border-b border-white/[0.06] px-[clamp(24px,5vw,80px)] py-14">
        <div className="max-w-6xl mx-auto">
          <RevealOnScroll>
            <div className="flex items-center gap-3 mb-4">
              <SectionLabel text="Marketplace" />
              <span className="flex items-center gap-2 bg-kcb-or/10 border border-kcb-or/20 text-kcb-or text-xs px-3 py-1 rounded-full font-medium">
                <ShieldCheck className="w-3.5 h-3.5" /> Certifié blockchain
              </span>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <h1 className="font-playfair font-bold text-[clamp(32px,4vw,56px)] text-white mb-4 leading-tight">
              Marketplace
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.15}>
            <p className="text-kcb-pierre text-[15px] max-w-2xl mb-8">
              Découvrez des milliers d'œuvres d'art africain et international certifiées blockchain
            </p>
          </RevealOnScroll>

          {/* Stats */}
          {!loading && (
            <RevealOnScroll delay={0.2}>
              <div className="flex flex-wrap gap-6 text-sm">
                <div>
                  <span className="text-kcb-or font-bold text-xl">{allArtworks.length}</span>
                  <span className="text-kcb-pierre ml-2">œuvres disponibles</span>
                </div>
                <div className="text-kcb-pierre/40">·</div>
                <div>
                  <span className="text-kcb-or font-bold text-xl">{artistCount}</span>
                  <span className="text-kcb-pierre ml-2">artistes</span>
                </div>
                {countryCount > 0 && (
                  <>
                    <div className="text-kcb-pierre/40">·</div>
                    <div>
                      <span className="text-kcb-or font-bold text-xl">{countryCount}</span>
                      <span className="text-kcb-pierre ml-2">pays</span>
                    </div>
                  </>
                )}
              </div>
            </RevealOnScroll>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        {/* ── FILTER BAR ── */}
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 mb-8 space-y-4">
          <div className="flex flex-wrap gap-3 items-center">
            {/* Search */}
            <div className="relative flex-1 min-w-52">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-kcb-pierre" />
              <input
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setVisibleCount(PAGE_SIZE) }}
                placeholder="Rechercher par titre ou artiste…"
                className="w-full bg-kcb-noir border border-white/[0.08] rounded-[4px] pl-9 pr-4 py-2 text-sm text-white placeholder-kcb-pierre focus:outline-none focus:ring-2 focus:ring-kcb-or focus:border-transparent transition"
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setVisibleCount(PAGE_SIZE) }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-kcb-pierre hover:text-white transition"
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
                className="appearance-none bg-kcb-noir border border-white/[0.08] rounded-[4px] pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or cursor-pointer transition"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setVisibleCount(PAGE_SIZE) }}
                className="appearance-none bg-kcb-noir border border-white/[0.08] rounded-[4px] pl-3 pr-8 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-kcb-or cursor-pointer transition"
              >
                {Object.entries(SORT_LABELS).map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
              <SlidersHorizontal className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-kcb-pierre pointer-events-none" />
            </div>

            {/* Clear filters */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-xs text-kcb-pierre hover:text-white border border-white/[0.06] hover:border-white/[0.12] rounded-[4px] px-3 py-2 transition"
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
                  ? "bg-kcb-or border-kcb-or text-kcb-noir"
                  : "bg-kcb-noir border-white/[0.08] text-kcb-pierre hover:text-white hover:border-white/[0.12]"
              }`}
            >
              En vente
            </button>
            <button
              onClick={() => { setCertifiedOnly(!certifiedOnly); setVisibleCount(PAGE_SIZE) }}
              className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded-full border transition-all ${
                certifiedOnly
                  ? "bg-kcb-or border-kcb-or text-kcb-noir"
                  : "bg-kcb-noir border-white/[0.08] text-kcb-pierre hover:text-white hover:border-white/[0.12]"
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Certifié KCB
            </button>

            <span className="ml-auto text-xs text-kcb-pierre self-center">
              {loading ? "Chargement…" : `${filtered.length} résultat${filtered.length !== 1 ? "s" : ""}`}
            </span>
          </div>
        </div>

        {/* ── RESULTS ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-10 h-10 text-kcb-or animate-spin" />
            <p className="text-kcb-pierre text-sm">Chargement des œuvres…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
            <span className="text-5xl">🎨</span>
            <p className="text-kcb-sable text-lg font-medium">Aucune œuvre trouvée</p>
            <p className="text-kcb-pierre text-sm max-w-xs">
              Essayez d'ajuster vos filtres ou élargissez votre recherche.
            </p>
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-4 py-2 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir text-sm font-medium rounded-[4px] transition"
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
                  className="inline-flex items-center gap-2 px-6 py-3 bg-kcb-ardoise border border-white/[0.06] hover:bg-white/[0.03] hover:border-kcb-or/30 text-white text-sm font-medium rounded-[4px] transition"
                >
                  Voir plus d'œuvres <ArrowRight className="w-4 h-4" />
                </button>
                <p className="text-kcb-pierre/60 text-xs mt-2">
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
