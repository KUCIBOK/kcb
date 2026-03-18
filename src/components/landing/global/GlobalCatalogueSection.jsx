import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { ArrowRight, ShieldCheck } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { globalT } from "../../../i18n/global"
import { getApprovedArtworks } from "../../../api/useArtworks"

/** Fallback pattern backgrounds for artworks without images */
const PATTERNS = [
  "repeating-linear-gradient(45deg, var(--kcb-silver-dark, #2a2f36) 0px, var(--kcb-silver-dark, #2a2f36) 1px, transparent 1px, transparent 16px), #141618",
  "radial-gradient(circle at 40% 40%, #2a2f36 0%, transparent 60%), #141618",
  "repeating-conic-gradient(#2a2f36 0% 25%, transparent 0% 50%) 0 0 / 32px 32px, #141618",
  "linear-gradient(160deg, #2a2f36 0%, #0a0a0b 100%)",
]

/**
 * Catalogue grid for Global portal — shows 4 real certified artworks from DB.
 * Falls back to pattern placeholders while loading or if no images.
 */
export default function GlobalCatalogueSection() {
  const { lang } = useLang()
  const t = globalT[lang].catalogue

  const [artworks, setArtworks] = useState([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    getApprovedArtworks({ limit: 200 }).then((result) => {
      const list = Array.isArray(result?.data) ? result.data
                 : Array.isArray(result)        ? result
                 : []
      // Prefer certified artworks with image, shuffle randomly, take 4 unique
      const withImage = list.filter(a => a.image)
      const certified = withImage.filter(a => a.kucibok_id)
      const pool = certified.length >= 4 ? certified : withImage
      // Deduplicate by title
      const seen = new Set()
      const unique = pool.filter(a => {
        const key = (a.title || '').toLowerCase().trim()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      // Shuffle and pick 4
      const shuffled = unique.sort(() => Math.random() - 0.5)
      setArtworks(shuffled.slice(0, 4).map(a => ({ ...a, _id: a._id ?? a.id })))
      setLoading(false)
    })
  }, [])

  // While loading, render 4 skeleton slots
  const items = loading
    ? Array.from({ length: 4 }, (_, i) => ({ _id: `sk-${i}`, skeleton: true }))
    : artworks.length > 0
      ? artworks
      : Array.from({ length: 4 }, (_, i) => ({ _id: `fb-${i}`, fallback: true, idx: i }))

  return (
    <section id="catalogue" className="py-36 bg-kcb-noir-deep">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="flex justify-between items-end mb-20 flex-wrap gap-6">
          <RevealOnScroll>
            <SectionLabel text={t.label} />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6">
              {t.title}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll>
            <Link
              to="/explore"
              className="inline-flex items-center gap-1.5 text-kcb-pierre font-dm-sans font-medium text-xs tracking-[0.05em] uppercase transition-colors hover:text-[var(--accent)] no-underline"
            >
              {t.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1fr_1fr] gap-0.5" style={{ gridAutoRows: "340px" }}>
          {items.map((item, i) => (
            <RevealOnScroll key={item._id} delay={i * 0.1}>
              {item.skeleton ? (
                /* Loading skeleton */
                <div className="relative h-full bg-kcb-noir animate-pulse" />
              ) : (
                <Link
                  to={item.fallback ? "/explore" : `/artwork/${item.id ?? item._id}`}
                  className="block relative overflow-hidden cursor-pointer bg-kcb-noir h-full group no-underline"
                >
                  {/* Image or pattern background */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-100"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-15 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-25"
                      style={{ background: PATTERNS[i % PATTERNS.length] }}
                    />
                  )}

                  {/* Info overlay */}
                  <div
                    className="absolute inset-0 flex flex-col justify-end p-7 transition-all duration-400 group-hover:[background:linear-gradient(to_top,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.2)_60%)]"
                    style={{ background: "linear-gradient(to top, rgba(5,5,5,0.92) 0%, transparent 50%)" }}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2.5">
                      <span className="inline-block bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-[9px] tracking-[0.1em] uppercase px-2 py-0.5">
                        {item.fallback ? "Certified" : "Certified"}
                      </span>
                      {item.kucibok_id && (
                        <ShieldCheck className="w-4 h-4 text-[var(--accent)] shrink-0" />
                      )}
                    </div>
                    <div className="font-playfair font-semibold text-[17px] text-white mb-1 line-clamp-2">
                      {item.fallback ? "—" : item.title}
                    </div>
                    <div className="text-xs text-kcb-sable">
                      {item.fallback ? "—" : (item.artist ?? "Unknown artist")}
                    </div>
                    {item.kucibok_id && (
                      <div className="font-jetbrains text-[10px] text-[var(--accent)] mt-2 tracking-[0.06em]">
                        {item.kucibok_id}
                      </div>
                    )}
                  </div>
                </Link>
              )}
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
