import { useEffect, useState } from "react"
import { getApprovedArtworks } from "../../../api/useArtworks"

/**
 * Artwork showcase frame with floating stat cards for Global hero.
 * Loads a random certified artwork from DB on each mount.
 */
export default function HeroShowcase() {
  const [artwork, setArtwork] = useState(null)

  useEffect(() => {
    getApprovedArtworks({ limit: 100 }).then((result) => {
      const list = Array.isArray(result?.data) ? result.data
                 : Array.isArray(result) ? result : []
      // Prefer certified (kucibok_id) + has image
      const certified = list.filter(a => a.kucibok_id && a.image)
      const pool = certified.length > 0 ? certified : list.filter(a => a.image)
      if (pool.length > 0) {
        setArtwork(pool[Math.floor(Math.random() * pool.length)])
      }
    })
  }, [])

  return (
    <div className="relative flex flex-col items-center -mb-12 sm:-mb-24 lg:-mb-40 z-10">
      {/* Frame */}
      <div className="w-[200px] h-[250px] sm:w-[230px] sm:h-[290px] lg:w-[300px] lg:h-[380px] relative border border-kcb-silver/12 bg-kcb-ardoise-cool overflow-hidden">
        {/* Artwork image or abstract fallback */}
        {artwork?.image ? (
          <img
            src={artwork.image}
            alt={artwork.title}
            className="absolute inset-0 w-full h-full object-cover opacity-80"
          />
        ) : (
          <>
            <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 40%, rgba(168,176,188,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(107,114,128,0.06) 0%, transparent 50%)" }} />
            <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(45deg, transparent 0px, transparent 40px, rgba(168,176,188,0.02) 40px, rgba(168,176,188,0.02) 41px)" }} />
          </>
        )}

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-7" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, transparent 100%)" }}>
          <span className="inline-block bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 mb-2">Certified</span>
          <div className="font-playfair font-semibold text-sm lg:text-lg text-white mb-1 line-clamp-2">
            {artwork?.title ?? "—"}
          </div>
          <div className="text-[11px] text-kcb-sable">
            {artwork?.artist ?? "—"}
          </div>
          {artwork?.kucibok_id && (
            <div className="font-jetbrains text-[9px] text-kcb-silver mt-1.5 tracking-[0.06em]">{artwork.kucibok_id}</div>
          )}
        </div>
      </div>

      {/* Floating stat 1 — hidden on very small screens */}
      <div className="hidden sm:block absolute top-[10%] -left-5 lg:-left-7 bg-kcb-steel/90 backdrop-blur-xl border border-kcb-silver/10 px-3 lg:px-4 py-2 lg:py-3 z-[3]"
        style={{ animation: "kcb-float-1 4s ease-in-out infinite" }}
      >
        <div className="font-playfair font-bold text-[18px] lg:text-[22px] text-kcb-silver-light leading-none">2,400+</div>
        <div className="text-[8px] lg:text-[9px] text-kcb-silver-dark mt-1 tracking-[0.08em] uppercase">Certified works</div>
      </div>

      {/* Floating stat 2 — hidden on very small screens */}
      <div className="hidden sm:block absolute bottom-[30%] -right-5 lg:-right-8 bg-kcb-steel/90 backdrop-blur-xl border border-kcb-silver/10 px-3 lg:px-4 py-2 lg:py-3 z-[3]"
        style={{ animation: "kcb-float-2 5s ease-in-out infinite" }}
      >
        <div className="font-playfair font-bold text-[18px] lg:text-[22px] text-kcb-silver-light leading-none">12</div>
        <div className="text-[8px] lg:text-[9px] text-kcb-silver-dark mt-1 tracking-[0.08em] uppercase">Countries</div>
      </div>
    </div>
  )
}
