import { Helmet } from "react-helmet"
import { useEffect, useState } from "react"
import { useArtworks } from "../store/ArtworkContext"
import { Search } from "lucide-react"
import { Marketplace } from "../components/artworks/Marketplace"
import { Filters } from "../components/artworks/Filters"
import { DataLoader } from "../components/loaders/PageLoader"
import { useParams } from "react-router-dom"
import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"

/**
 * Explore page — browse artworks with search and filters.
 * Stays in Layout (main nav + footer).
 *
 * @returns {JSX.Element}
 */
export default function Explore() {
  const { forSale } = useArtworks()
  const { category } = useParams()
  const pageSize = 9

  // Single state object for all filtering, search, and pagination
  const [state, setState] = useState({
    search: "",
    filters: {
      category: category || "all",
      minPrice: "",
      maxPrice: "",
      created: "all",
    },
    loading: true,
    artworks: [],
    set: [],
    page: 0,
  })

  // Filtering logic (search + filters)
  useEffect(() => {
    let filtered = forSale
    // Category from URL param
    if (category && category !== "all") {
      filtered = filtered.filter((item) => item.category === category)
    }
    // Category from filter
    if (state.filters.category && state.filters.category !== "all") {
      filtered = filtered.filter(
        (item) => item.category === state.filters.category
      )
    }
    // Price
    if (state.filters.minPrice) {
      filtered = filtered.filter(
        (item) => item.price >= parseFloat(state.filters.minPrice)
      )
    }
    if (state.filters.maxPrice) {
      filtered = filtered.filter(
        (item) => item.price <= parseFloat(state.filters.maxPrice)
      )
    }
    // Created date
    if (state.filters.created && state.filters.created !== "all") {
      const now = new Date()
      let timeLimit
      switch (state.filters.created) {
        case "last-24":
          timeLimit = new Date(now.getTime() - 24 * 60 * 60 * 1000)
          break
        case "last-7d":
          timeLimit = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "last-30d":
          timeLimit = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          break
        case "last-90d":
          timeLimit = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
          break
        default:
          timeLimit = now
      }
      filtered = filtered.filter(
        (item) => new Date(item.created) >= timeLimit
      )
    }
    // Search
    if (state.search.trim() !== "") {
      const s = state.search.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.title.toLowerCase().includes(s) ||
          item.description?.toLowerCase().includes(s) ||
          item.tags?.toString().toLowerCase().includes(s)
      )
    }
    setState((prev) => ({
      ...prev,
      artworks: filtered,
      set: filtered.slice(
        state.page * pageSize,
        state.page * pageSize + pageSize
      ),
      loading: false,
    }))
  }, [forSale, state.search, state.filters, state.page, category])

  // Reset page to 0 when filters/search change
  useEffect(() => {
    setState((prev) => ({ ...prev, page: 0 }))
  }, [state.search, state.filters, category])

  // Update paged set when page changes
  useEffect(() => {
    setState((prev) => ({
      ...prev,
      set: prev.artworks.slice(
        prev.page * pageSize,
        prev.page * pageSize + pageSize
      ),
    }))
  }, [state.page, state.artworks])

  const pageCount = Math.ceil(state.artworks.length / pageSize)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
    <Helmet>
      <title>Explorer les œuvres — Kucibok | Art africain certifié</title>
      <meta name="description" content="Explorez et achetez des œuvres d'art africain certifiées et traçables. Peintures, sculptures, photographies d'artistes africains contemporains vérifiés." />
      <meta property="og:title" content="Explorer les œuvres d'art africain — Kucibok" />
      <meta property="og:description" content="Marketplace d'art africain certifié. Découvrez 1000+ œuvres d'artistes africains contemporains vérifiés." />
      <meta property="og:url" content="https://kucibok.com/explore" />
      <link rel="canonical" href="https://kucibok.com/explore" />
    </Helmet>
    <div className="mx-auto px-4 md:px-6 flex-grow pb-16 mt-8">
      {/* ── HEADER ── */}
      <div className="text-center mb-14">
        <RevealOnScroll>
          <SectionLabel text="Explorer" />
        </RevealOnScroll>
        <RevealOnScroll delay={0.1}>
          <h1 className="font-playfair font-bold text-[clamp(28px,3.5vw,48px)] text-white mt-4 mb-3">
            Explorez les oeuvres d'art
          </h1>
        </RevealOnScroll>
        <RevealOnScroll delay={0.2}>
          <p className="text-kcb-pierre text-[15px]">
            Decouvrez des oeuvres uniques et soutenez les artistes
          </p>
        </RevealOnScroll>
      </div>

      {/* ── SEARCH ── */}
      <RevealOnScroll delay={0.25}>
        <div className="flex justify-center items-center mb-10 mx-auto w-full max-w-xl">
          <div className="relative w-full">
            <input
              value={state.search}
              onChange={(e) =>
                setState((prev) => ({ ...prev, search: e.target.value }))
              }
              type="text"
              className="w-full bg-kcb-noir border border-white/[0.08] focus:border-kcb-or transition-colors duration-200 outline-none text-white placeholder-kcb-pierre rounded-[4px] py-3 pl-12 pr-4 shadow-sm focus:shadow-md focus:ring-2 focus:ring-kcb-or"
              placeholder="Cherchez par titre, artiste, ou mots-cles"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-kcb-pierre pointer-events-none">
              <Search className="w-5 h-5" />
            </span>
          </div>
        </div>
      </RevealOnScroll>

      {/* ── CONTENT ── */}
      <div className="flex flex-col md:flex-row gap-6 items-start">
        <Filters state={state} setState={setState} forSale={forSale} />
        <div className="flex-1 min-w-0">
          {state.loading ? (
            <div className="flex items-center justify-center h-40">
              <DataLoader />
            </div>
          ) : (
            <Marketplace artworks={state.set} />
          )}
        </div>
      </div>

      {/* ── PAGINATION ── */}
      {state.artworks.length > pageSize && (
        <div className="flex justify-end gap-2 mt-8">
          <button
            className="px-4 py-2 rounded-[4px] border border-white/[0.06] text-kcb-sable bg-transparent hover:bg-white/[0.03] transition text-sm disabled:opacity-40"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                page: Math.max(0, prev.page - 1),
              }))
              window.scrollTo({ top: 0 })
            }}
            disabled={state.page === 0}
          >
            Precedent
          </button>
          <span className="text-xs text-kcb-pierre flex items-center px-2">
            Page {state.page + 1} / {pageCount}
          </span>
          <button
            className="px-4 py-2 rounded-[4px] border border-white/[0.06] text-kcb-sable bg-transparent hover:bg-white/[0.03] transition text-sm disabled:opacity-40"
            onClick={() => {
              setState((prev) => ({
                ...prev,
                page: Math.min(pageCount - 1, prev.page + 1),
              }))
              window.scrollTo({ top: 0 })
            }}
            disabled={state.page >= pageCount - 1}
          >
            Suivant
          </button>
        </div>
      )}
    </div>
    </>
  )
}
