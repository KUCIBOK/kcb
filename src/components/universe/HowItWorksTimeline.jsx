const themeConfig = {
  africa: {
    stepNumberBg: "bg-amber-500/10 border border-amber-700/30 text-amber-400",
    iconColor: "text-amber-400",
    connectorColor: "bg-amber-800/30",
    labelColor: "text-amber-400",
    dotColor: "bg-amber-500",
  },
  global: {
    stepNumberBg: "bg-indigo-500/10 border border-indigo-700/30 text-indigo-400",
    iconColor: "text-indigo-400",
    connectorColor: "bg-indigo-800/30",
    labelColor: "text-indigo-400",
    dotColor: "bg-indigo-500",
  },
}

export function HowItWorksTimeline({ theme = "africa", steps = [], heading, subheading }) {
  const cfg = themeConfig[theme] ?? themeConfig.africa

  return (
    <section className="py-20 bg-[#0f1117]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        {(heading || subheading) && (
          <div className="text-center mb-16">
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

        {/* Timeline */}
        <div className="relative">
          {/* Vertical connector line (desktop) */}
          <div
            className={`absolute left-8 top-8 bottom-8 w-0.5 hidden sm:block ${cfg.connectorColor}`}
          />

          <div className="space-y-10">
            {steps.map((step, idx) => {
              const Icon = step.icon
              const isLast = idx === steps.length - 1

              return (
                <div key={idx} className="relative flex gap-6 items-start">
                  {/* Step indicator */}
                  <div className="relative z-10 flex flex-col items-center shrink-0">
                    <div
                      className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center ${cfg.stepNumberBg}`}
                    >
                      {Icon && <Icon className={`w-6 h-6 ${cfg.iconColor}`} />}
                      <span className={`text-xs font-bold mt-0.5 ${cfg.iconColor}`}>
                        {step.number}
                      </span>
                    </div>
                    {/* Dot on connector (mobile hidden) */}
                    {!isLast && (
                      <div className={`hidden sm:block w-2 h-2 rounded-full mt-2 ${cfg.dotColor}`} />
                    )}
                  </div>

                  {/* Content */}
                  <div className="pt-3 pb-4">
                    <h3 className="font-playfair text-lg font-semibold text-white mb-1">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorksTimeline
