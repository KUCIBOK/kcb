const themeConfig = {
  africa: {
    valueColor: "text-amber-400",
    borderColor: "border-amber-900/20",
    dividerColor: "border-amber-900/20",
  },
  global: {
    valueColor: "text-indigo-400",
    borderColor: "border-indigo-900/20",
    dividerColor: "border-indigo-900/20",
  },
}

export function StatsBar({ theme = "africa", stats = [] }) {
  const cfg = themeConfig[theme] ?? themeConfig.africa

  const colClass =
    stats.length <= 2
      ? "grid-cols-2"
      : stats.length === 3
      ? "grid-cols-3"
      : "grid-cols-2 sm:grid-cols-4"

  return (
    <section className={`bg-[#13161e] border-y ${cfg.borderColor} py-10`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`grid ${colClass} gap-0 divide-x ${cfg.dividerColor}`}>
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center justify-center px-6 py-4 text-center">
              <span className={`font-playfair text-3xl md:text-4xl font-semibold ${cfg.valueColor}`}>
                {stat.value}
              </span>
              <span className="mt-1 text-xs text-gray-400 uppercase tracking-wider">
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default StatsBar
