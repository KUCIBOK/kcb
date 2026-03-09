const colorMap = {
  amber: "bg-amber-500/10 text-amber-400",
  green: "bg-green-500/10 text-green-400",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  red: "bg-red-500/10 text-red-400",
  indigo: "bg-indigo-500/10 text-indigo-400",
}

const themeConfig = {
  africa: {
    cardHover: "hover:border-amber-700/30",
    labelColor: "text-amber-400",
  },
  global: {
    cardHover: "hover:border-indigo-700/30",
    labelColor: "text-indigo-400",
  },
}

export function ServicesGrid({ theme = "africa", services = [], heading, subheading }) {
  const cfg = themeConfig[theme] ?? themeConfig.africa

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-14">
            {heading && (
              <h2 className="font-playfair text-3xl md:text-4xl font-semibold text-white">
                {heading}
              </h2>
            )}
            {subheading && (
              <p className="mt-3 text-gray-400 max-w-2xl mx-auto">{subheading}</p>
            )}
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, idx) => {
            const iconColorClass = colorMap[service.color] ?? colorMap.indigo
            const Icon = service.icon

            return (
              <div
                key={idx}
                className={`bg-[#13161e] border border-gray-800 rounded-2xl p-6 transition-all duration-200 ${cfg.cardHover} hover:shadow-lg`}
              >
                {Icon && (
                  <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl mb-4 ${iconColorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                )}
                <h3 className="font-playfair text-lg font-semibold text-white mb-2">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default ServicesGrid
