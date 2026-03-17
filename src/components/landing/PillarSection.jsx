import RevealOnScroll from "./RevealOnScroll"

/**
 * Three-column pillar grid section.
 * @param {object} props
 * @param {Array<{num: string, title: string, text: string}>} props.pillars - Array of 3 pillar items
 * @param {"africa"|"global"} [props.portal="africa"] - Portal theme
 */
export default function PillarSection({ pillars, portal = "africa" }) {
  const borderColor = portal === "global"
    ? "border-kcb-silver/8"
    : "border-kcb-or/8"
  const hoverBg = portal === "global"
    ? "hover:bg-kcb-silver/[0.02]"
    : "hover:bg-kcb-or/[0.02]"

  return (
    <section className={`bg-kcb-ardoise-cool border-t border-b ${borderColor} pt-20`}>
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="grid grid-cols-1 md:grid-cols-3">
          {pillars.map((p, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div
                className={`py-10 px-6 md:px-8 lg:px-10 md:border-r border-b md:border-b-0 border-white/[0.03] last:border-r-0 last:border-b-0 transition-colors ${hoverBg}`}
              >
                <div className="font-jetbrains text-[10px] text-[var(--accent)] tracking-[0.2em] mb-3">
                  {p.num}
                </div>
                <h3 className="font-playfair font-semibold text-lg text-white mb-2">
                  {p.title}
                </h3>
                <p className="text-[13px] leading-relaxed text-kcb-pierre">
                  {p.text}
                </p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
