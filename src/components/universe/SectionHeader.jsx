const themeConfig = {
  africa: {
    labelColor: "text-amber-400",
    highlightColor: "text-amber-400",
    labelBg: "bg-amber-500/10",
  },
  global: {
    labelColor: "text-indigo-400",
    highlightColor: "text-indigo-400",
    labelBg: "bg-indigo-500/10",
  },
}

export function SectionHeader({
  theme = "africa",
  label,
  title,
  highlight,
  subtitle,
  align = "center",
}) {
  const cfg = themeConfig[theme] ?? themeConfig.africa
  const alignClass = align === "left" ? "text-left items-start" : "text-center items-center"

  return (
    <div className={`flex flex-col gap-3 ${alignClass}`}>
      {label && (
        <span
          className={`inline-flex self-start items-center px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-widest ${cfg.labelColor} ${cfg.labelBg}`}
          style={align === "center" ? { alignSelf: "center" } : {}}
        >
          {label}
        </span>
      )}
      <h2 className={`font-playfair text-3xl md:text-4xl font-semibold text-white leading-tight`}>
        {title}
        {highlight && (
          <span className={` ${cfg.highlightColor}`}> {highlight}</span>
        )}
      </h2>
      {subtitle && (
        <p className="text-gray-400 text-base max-w-2xl leading-relaxed">{subtitle}</p>
      )}
    </div>
  )
}

export default SectionHeader
