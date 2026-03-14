import RevealOnScroll from "../RevealOnScroll"
import { useLang } from "../../../store/LangContext"
import { africaT } from "../../../i18n/africa"

export default function AfricaStatsStrip() {
  const { lang } = useLang()
  const STATS = africaT[lang].stats
  return (
    <div className="w-full bg-kcb-noir-deep border-t border-b border-kcb-or/[0.06] py-8">
      <RevealOnScroll>
        {/* Desktop: flex row | Mobile: 2×2 grid */}
        <div className="hidden sm:flex items-center justify-around max-w-5xl mx-auto px-6">
          {STATS.map((stat, i) => (
            <div key={stat.label} className="flex items-center">
              <StatItem stat={stat} />
              {i < STATS.length - 1 && (
                <span className="ml-12 mr-12 block w-px h-8 bg-kcb-silver/[0.12]" />
              )}
            </div>
          ))}
        </div>

        {/* Mobile 2×2 */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 sm:hidden px-8">
          {STATS.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <StatItem stat={stat} />
            </div>
          ))}
        </div>
      </RevealOnScroll>
    </div>
  )
}

function StatItem({ stat }) {
  return (
    <div className="flex flex-col items-center text-center gap-1.5">
      <span
        className="font-playfair font-bold text-white leading-none"
        style={{ fontSize: "clamp(24px, 2.5vw, 32px)" }}
      >
        {stat.number}
      </span>
      <span className="font-jetbrains text-[9px] tracking-[0.15em] uppercase text-kcb-pierre">
        {stat.label}
      </span>
    </div>
  )
}
