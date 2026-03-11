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
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {pillars.map((p, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div
                className={`py-12 px-10 lg:border-r border-white/[0.03] last:border-r-0 transition-colors ${hoverBg}`}
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
