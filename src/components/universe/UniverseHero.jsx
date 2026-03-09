import { MapPin, Globe, ArrowRight } from "lucide-react"
import { Link } from "react-router-dom"

const themeConfig = {
  africa: {
    BadgeIcon: MapPin,
    badgeBg: "bg-amber-500/10 border border-amber-700/30 text-amber-400",
    gradientOverlay: "from-amber-900/30 via-gray-900/60 to-gray-900",
    gradientTop: "from-amber-800/20 via-transparent to-transparent",
    highlightClass: "text-amber-400",
    primaryBtn: "bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold",
    secondaryBtn: "border border-amber-700/40 text-amber-300 hover:bg-amber-500/10 hover:border-amber-500",
  },
  global: {
    BadgeIcon: Globe,
    badgeBg: "bg-indigo-500/10 border border-indigo-700/30 text-indigo-400",
    gradientOverlay: "from-indigo-900/30 via-gray-900/60 to-gray-900",
    gradientTop: "from-indigo-900/20 via-transparent to-transparent",
    highlightClass: "bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent",
    primaryBtn: "bg-indigo-600 hover:bg-indigo-500 text-white font-semibold",
    secondaryBtn: "border border-indigo-700/40 text-indigo-300 hover:bg-indigo-500/10 hover:border-indigo-500",
  },
}

export function UniverseHero({
  theme = "africa",
  badge,
  title,
  highlight,
  subtitle,
  ctas = [],
  decorativeGradient = true,
}) {
  const cfg = themeConfig[theme] ?? themeConfig.africa
  const BadgeIcon = cfg.BadgeIcon

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gray-900 pt-16">
      {/* Decorative gradient blobs */}
      {decorativeGradient && (
        <>
          <div
            className={`absolute inset-0 bg-gradient-to-b ${cfg.gradientOverlay} pointer-events-none`}
          />
          <div
            className={`absolute top-0 left-0 right-0 h-96 bg-gradient-to-br ${cfg.gradientTop} pointer-events-none`}
          />
          {theme === "africa" && (
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-amber-700/10 rounded-full blur-3xl pointer-events-none" />
          )}
          {theme === "global" && (
            <>
              <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] bg-indigo-700/10 rounded-full blur-3xl pointer-events-none" />
              <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] bg-fuchsia-700/8 rounded-full blur-3xl pointer-events-none" />
            </>
          )}
        </>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        {badge && (
          <div className="inline-flex items-center gap-2 mb-6">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider ${cfg.badgeBg}`}>
              <BadgeIcon className="w-3.5 h-3.5" />
              {badge}
            </span>
          </div>
        )}

        {/* Title */}
        <h1 className="font-playfair text-5xl md:text-7xl font-semibold text-white leading-tight mb-4">
          {title}
          {highlight && (
            <>
              <br />
              <span className={cfg.highlightClass}>{highlight}</span>
            </>
          )}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p className="mt-6 text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {subtitle}
          </p>
        )}

        {/* CTAs */}
        {ctas.length > 0 && (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            {ctas.map((cta, idx) => {
              const btnClass =
                cta.variant === "primary" ? cfg.primaryBtn : cfg.secondaryBtn
              const baseClass = `inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm transition-all duration-200 ${btnClass}`

              if (cta.href) {
                return (
                  <Link key={idx} to={cta.href} className={baseClass}>
                    {cta.label}
                    {cta.variant === "primary" && <ArrowRight className="w-4 h-4" />}
                  </Link>
                )
              }
              return (
                <button key={idx} onClick={cta.onClick} className={baseClass}>
                  {cta.label}
                  {cta.variant === "primary" && <ArrowRight className="w-4 h-4" />}
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Bottom fade overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
    </section>
  )
}

export default UniverseHero
