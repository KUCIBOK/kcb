import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"

const themeConfig = {
  africa: {
    highlightColor: "text-amber-400",
    primaryBtn: "bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold",
    secondaryBtn: "border border-amber-700/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500",
    glowColor: "bg-amber-600/10",
    borderColor: "border-amber-900/20",
  },
  global: {
    highlightColor: "bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent",
    primaryBtn: "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold",
    secondaryBtn: "border border-indigo-700/40 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500",
    glowColor: "bg-indigo-700/10",
    borderColor: "border-indigo-900/20",
  },
}

export function UniverseCTA({ theme = "africa", title, highlight, subtitle, primaryCTA, secondaryCTA }) {
  const cfg = themeConfig[theme] ?? themeConfig.africa

  return (
    <section className={`relative py-24 bg-[#0f1117] border-y ${cfg.borderColor} overflow-hidden`}>
      {/* Decorative glow blob */}
      <div
        className={`absolute inset-0 flex items-center justify-center pointer-events-none`}
        aria-hidden="true"
      >
        <div
          className={`w-[600px] h-[300px] rounded-full blur-3xl opacity-40 ${cfg.glowColor}`}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="font-playfair text-3xl md:text-5xl font-semibold text-white leading-tight">
          {title}{" "}
          {highlight && (
            <span className={cfg.highlightColor}>{highlight}</span>
          )}
        </h2>

        {subtitle && (
          <p className="mt-5 text-lg text-gray-400 leading-relaxed">
            {subtitle}
          </p>
        )}

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          {primaryCTA && (
            <Link
              to={primaryCTA.href}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm transition-all duration-200 ${cfg.primaryBtn}`}
            >
              {primaryCTA.label}
              <ArrowRight className="w-4 h-4" />
            </Link>
          )}
          {secondaryCTA && (
            <Link
              to={secondaryCTA.href}
              className={`inline-flex items-center gap-2 px-7 py-3 rounded-xl text-sm transition-all duration-200 ${cfg.secondaryBtn}`}
            >
              {secondaryCTA.label}
            </Link>
          )}
        </div>
      </div>
    </section>
  )
}

export default UniverseCTA
