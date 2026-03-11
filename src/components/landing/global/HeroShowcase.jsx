/**
 * Artwork showcase frame with floating stat cards for Global hero.
 */
export default function HeroShowcase() {
  return (
    <div className="relative flex flex-col items-center -mb-40 z-10">
      {/* Frame */}
      <div className="w-[320px] h-[400px] sm:w-[240px] sm:h-[300px] relative border border-kcb-silver/12 bg-kcb-ardoise-cool overflow-hidden">
        {/* Abstract background */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 30% 40%, rgba(168,176,188,0.08) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(107,114,128,0.06) 0%, transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "repeating-linear-gradient(45deg, transparent 0px, transparent 40px, rgba(168,176,188,0.02) 40px, rgba(168,176,188,0.02) 41px)" }} />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-7" style={{ background: "linear-gradient(to top, rgba(5,5,5,0.95) 0%, transparent 100%)" }}>
          <span className="inline-block bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 mb-2.5">Certified</span>
          <div className="font-playfair font-semibold text-lg text-white mb-1">Memoires du Sahel</div>
          <div className="text-xs text-kcb-sable">Ousmane Ndiaye</div>
          <div className="font-jetbrains text-[10px] text-kcb-silver mt-2 tracking-[0.06em]">KCB-20260087</div>
        </div>
      </div>

      {/* Floating stat 1 */}
      <div className="absolute top-[10%] -left-7 bg-kcb-steel/90 backdrop-blur-xl border border-kcb-silver/10 px-4 py-3 z-[3]"
        style={{ animation: "kcb-float-1 4s ease-in-out infinite" }}
      >
        <div className="font-playfair font-bold text-[22px] text-kcb-silver-light leading-none">2,400+</div>
        <div className="text-[9px] text-kcb-silver-dark mt-1 tracking-[0.08em] uppercase">Certified works</div>
      </div>

      {/* Floating stat 2 */}
      <div className="absolute bottom-[30%] -right-8 bg-kcb-steel/90 backdrop-blur-xl border border-kcb-silver/10 px-4 py-3 z-[3]"
        style={{ animation: "kcb-float-2 5s ease-in-out infinite" }}
      >
        <div className="font-playfair font-bold text-[22px] text-kcb-silver-light leading-none">12</div>
        <div className="text-[9px] text-kcb-silver-dark mt-1 tracking-[0.08em] uppercase">Countries</div>
      </div>
    </div>
  )
}
