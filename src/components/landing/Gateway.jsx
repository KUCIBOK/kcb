import { useNavigate } from "react-router-dom"
import { useState } from "react"
import { ArrowRight } from "lucide-react"
import GatewayMapSvg from "./svg/GatewayMapSvg"

/**
 * Split-screen gateway — entry point to Africa and Global portals.
 * Full viewport, left = Africa (gold), right = Global (silver).
 * Center: Kucibok logo that changes color on hover.
 */
export default function Gateway() {
  const navigate = useNavigate()
  const [hover, setHover] = useState(null)

  return (
    <div className="fixed inset-0 z-[200] flex flex-col md:flex-row font-dm-sans">
      {/* Africa side */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-5 md:px-12 py-6 md:py-10 relative overflow-hidden cursor-pointer transition-[flex] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.15] bg-kcb-noir-deep"
        onClick={() => navigate("/africa")}
        onMouseEnter={() => setHover("africa")}
        onMouseLeave={() => setHover(null)}
      >
        {/* Subtle vertical lines */}
        <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, #C9A84C 0px, #C9A84C 1px, transparent 1px, transparent 100px)" }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(201,168,76,0.06), transparent 70%)" }}
        />

        <div className="relative z-[2] text-center max-w-[420px] flex flex-col items-center">
          {/* Kuzi — float + eyelid blink overlay */}
          <div
            className="relative mb-4 md:mb-8 flex-shrink-0 w-[140px] sm:w-[200px] md:w-[280px]"
            style={{ animation: "kuzi-float 3.5s ease-in-out infinite" }}
          >
            <img
              src="/images/Kuzi.webp"
              alt="Kuzi"
              className="w-full h-auto transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                filter: "drop-shadow(0 16px 40px rgba(0,0,0,0.4))",
                transform: hover === "africa" ? "scale(1.05)" : "scale(1)",
              }}
            />
            <div
              className="absolute pointer-events-none"
              style={{
                left: "43%",
                top: "35%",
                width: "13%",
                height: "4.5%",
                background: "#2C2424",
                borderRadius: "50% 50% 45% 45% / 100% 100% 0% 0%",
                transformOrigin: "50% 0%",
                transform: "scaleY(0)",
                animation: "kuzi-eyelid 5s ease-in-out infinite",
              }}
            />
          </div>
          <div className="font-jetbrains text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-kcb-or mb-2 md:mb-5">
            Portail Afrique
          </div>
          <h2 className="font-playfair font-bold text-[clamp(18px,3.5vw,40px)] leading-[1.1] mb-2 md:mb-4">
            Votre art merite<br />un standard <em className="italic text-kcb-or">mondial</em>
          </h2>
          <p className="hidden sm:block text-[12px] md:text-[13px] font-light leading-[1.7] text-kcb-pierre mb-5 md:mb-9 max-w-[340px]">
            Certification gratuite, logistique specialisee, visibilite internationale. Pour les artistes d'Afrique de l'Ouest.
          </p>
          <button
            className="inline-flex items-center gap-2 bg-kcb-or text-kcb-noir font-semibold text-xs tracking-[0.1em] uppercase px-7 md:px-[52px] py-3 md:py-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_8px_40px_rgba(201,168,76,0.25)] hover:-translate-y-0.5"
            onClick={(e) => { e.stopPropagation(); navigate("/africa") }}
          >
            Entrer <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="font-jetbrains text-[9px] tracking-[0.15em] uppercase text-kcb-bronze mt-2 md:mt-4">
            Acces gratuit
          </div>
        </div>
      </div>

      {/* Global side */}
      <div
        className="flex-1 flex flex-col justify-center items-center px-5 md:px-12 py-6 md:py-10 relative overflow-hidden cursor-pointer transition-[flex] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:flex-[1.15] bg-kcb-steel"
        onClick={() => navigate("/global")}
        onMouseEnter={() => setHover("global")}
        onMouseLeave={() => setHover(null)}
      >
        {/* Subtle vertical lines */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, #A8B0BC 0px, #A8B0BC 1px, transparent 1px, transparent 100px)" }}
        />
        {/* Radial glow */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 30%, rgba(168,176,188,0.05), transparent 70%)" }}
        />

        <div className="relative z-[2] text-center max-w-[420px] flex flex-col items-center">
          <div className="w-[140px] h-[140px] sm:w-[200px] sm:h-[200px] md:w-[280px] md:h-[280px] relative mb-4 md:mb-8">
            <GatewayMapSvg />
          </div>
          <div className="font-jetbrains text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-kcb-silver mb-2 md:mb-5">
            Global Portal
          </div>
          <h2 className="font-playfair font-bold text-[clamp(18px,3.5vw,40px)] leading-[1.1] mb-2 md:mb-4">
            The Standard for<br />African Art <em className="italic text-kcb-silver-light">Circulation</em>
          </h2>
          <p className="hidden sm:block text-[12px] md:text-[13px] font-light leading-[1.7] text-kcb-pierre mb-5 md:mb-9 max-w-[340px]">
            Curated catalogue, certified artworks, door-to-door logistics. For collectors and institutions worldwide.
          </p>
          <button
            className="inline-flex items-center gap-2 bg-kcb-silver text-kcb-noir-deep font-semibold text-xs tracking-[0.1em] uppercase px-7 md:px-[52px] py-3 md:py-4 transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:shadow-[0_8px_40px_rgba(168,176,188,0.2)] hover:-translate-y-0.5"
            onClick={(e) => { e.stopPropagation(); navigate("/global") }}
          >
            Enter <ArrowRight className="w-3.5 h-3.5" />
          </button>
          <div className="font-jetbrains text-[9px] tracking-[0.15em] uppercase text-kcb-silver-dark mt-2 md:mt-4">
            Premium access
          </div>
        </div>
      </div>

      {/* Center divider with logo — desktop only */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:block">
        <div
          className="w-20 h-20 rounded-full border border-white/[0.08] flex items-center justify-center p-4 transition-all duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{
            background: hover === "africa"
              ? "#C9A84C"
              : hover === "global"
                ? "#A8B0BC"
                : "linear-gradient(135deg, #050505 50%, #1A1D24 50%)",
            borderColor: hover === "africa"
              ? "#C9A84C"
              : hover === "global"
                ? "#A8B0BC"
                : "rgba(255,255,255,0.08)",
          }}
        >
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-full h-full object-contain" />
        </div>
      </div>

      {/* Horizontal divider line — mobile only */}
      <div className="absolute left-0 right-0 md:hidden z-10 pointer-events-none" style={{ top: "50%", height: "1px", background: "rgba(255,255,255,0.06)" }} />

      {/* Top logo */}
      <div className="absolute top-5 md:top-9 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 md:gap-3">
        <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="h-6 md:h-9" />
        <span className="font-playfair font-bold text-base md:text-xl text-white tracking-[0.06em] uppercase">
          Kuci<span className="text-kcb-or">bok</span>
        </span>
      </div>
    </div>
  )
}
