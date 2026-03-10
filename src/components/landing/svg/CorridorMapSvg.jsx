import { CORRIDOR_CITIES, CORRIDOR_ROUTES } from "./continentPaths"

/**
 * Full corridor map for the Global logistics section.
 * Shows Africa + Europe with animated routes and city labels.
 */
export default function CorridorMapSvg() {
  return (
    <div className="w-full aspect-[2.2/1] relative bg-kcb-ardoise-cool border border-kcb-silver/[0.08] overflow-hidden">
      <svg viewBox="-120 -80 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        <defs>
          <linearGradient id="cr-route-up" x1="40" y1="205" x2="125" y2="83" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#C9A84C" /><stop offset="100%" stopColor="#A8B0BC" />
          </linearGradient>
          <linearGradient id="cr-route-down" x1="135" y1="88" x2="60" y2="210" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A8B0BC" /><stop offset="100%" stopColor="#C9A84C" />
          </linearGradient>
        </defs>

        {/* Grid */}
        {[100, 250, 400].map(y => (
          <line key={`h${y}`} x1="-120" y1={y} x2="580" y2={y} stroke="rgba(168,176,188,0.04)" strokeWidth="0.5" />
        ))}
        {[100, 250, 400].map(x => (
          <line key={`v${x}`} x1={x} y1="-80" x2={x} y2="620" stroke="rgba(168,176,188,0.04)" strokeWidth="0.5" />
        ))}

        {/* Europe outline */}
        <path d="M260 234l-5 5-2-1 2-4 3-2 5-2-3 6z m-33-2l-7 1-4-3-3 1-8-30-2 5-4 10-130-7-1-3-6-2 3-5 8-1 7 2 4-7 2 3 16-5 6-5 5-1-1 2 2 0 0 2 1 3 30 2 3 1 1 20 1 2 6 1-6 4-4 4-2 1-2-1-1 2-6 4-2 3 3-10 3-2 20 2-3 2-2 5 2 1-2 3-7 4-9-2-9 2-3 4z M206 226l0 2 8 3 3-1 4 3 7-1-2 4-8 4-8 1-2 2-6 4-5 50 4-5 3-4 4-5 1-7 5-7 0-50-5 2-3 2-20-1-2 1-4-4-1 1-2 3-2 2-2-1-2 4-4 0-4 3-1 2-3 2-1 4-5 4-2 1-3-30-2 1-3 0 1-3-3 1-3 2 4-5 0-3 11-5 6 1 70 5 1 40 8 0z" fill="rgba(168,176,188,0.08)" stroke="rgba(168,176,188,0.15)" strokeWidth="1" />

        {/* Africa outline */}
        <path d="M235 268l-3 3-2 6-4 5-5 4-2 5 3 4-1 2 2 3-2 120 6-1 3-3 5-1 3-2 4-1 4-3 3 2 50 3 1 4 3-1 4 3 2 4-22 12-19 13-9 3-6 1 1-4-2-1-3-2-1-3-16-14-15-14-16-16 1-1 00 3-8 11-5 6-1 5-2 4-3 8-3 2-5 30 4-2 8-1 2-3-1-1 2-7 2-4 0-4 7-4 6-1 5-3 6-2 10-1 90 2 1 6-2 60 1 2 40z M310 303l-3 30 3-3 40 5-7 23-5 24-2 13-6 0-1 3-20-12-20-12-6 4-4 2-2-4-8-3-2-4-4-3-3 1-1-4 0-3-2-5 3-3 1-4 2-4 1-3 3-5 1-3 0-6 3-2 2-3 0-3 5-2 3-2 3-2 2-5 5 2 30 4 1 6 3 0 6 4 1 7 3 5 3 3-2 4-3 1-5 3-3 5-3 4-1 7 1 1 3 2 0 1 1 5 1 0 2z M360 305l0 9 0 2-2 3-3 5-2 3-2 1-1-2-2-3-1-9-1 0 0 7 2 6 2 10 1 4 1 4 4 7-1 1-1 4 6 6 1 1-22 0-22 0-23 0 5-24 7-23 0-5 3-4 0-3 3-3 70 5 2 5 2 2 1 5-2 3-2 50 4 1 0 3 2-2 4 2 4 0 3-2z" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
        {/* West Africa highlight */}
        <path d="M72 413l0 4 0 4 2 2 0 2-1 2-1 0-30-1 1-1 0-4-2-30-100-2 1-20-3 10-5 5 0 2-1 10 2-2 2 1 2 0 3-2-1-2-2 1-20-2-2-2 0-2 2-6 0-1-5-2-2 3-1 4-4 2-3 2-2 3 0 3-1 30 2 2 3 2 2 5 3 4z M74 427l0 2 1 0 2-1 1 0 1 2 2 0 2-1 2-1 2-1 1 0 1 2 0 2 2 3-1 20 2 1-1 1 10 2 2 2-1 0-1 2 1 3 1 5-2 1-1 1 0 1-1 3-1 0-20-1 3-2 0-1-1 1-3-2-4-2 1-1 0-2 0 0-2-1-2 0-2-1-3-1-2-5 0-2 1-2 0-1 1-1 2-3 3-2-4-2-2-1-1-1-10-3-1-2-2-1 3-3 2 0 2-1 1 0 1-10-2 1-1 0-2 3 0 4 2 10 1-1 3 0 10z" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />

        {/* Corridor routes */}
        <path d={CORRIDOR_ROUTES.afToEu} stroke="url(#cr-route-up)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity="0.7" />
        <path d={CORRIDOR_ROUTES.euToAf} stroke="url(#cr-route-down)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity="0.5" />

        {/* Moving dots */}
        <circle r="3.5" fill="white" opacity="0.8">
          <animateMotion dur="3.5s" repeatCount="indefinite" path={CORRIDOR_ROUTES.afToEu} />
        </circle>
        <circle r="3.5" fill="white" opacity="0.8">
          <animateMotion dur="3.5s" repeatCount="indefinite" path={CORRIDOR_ROUTES.euToAf} begin="1.7s" />
        </circle>

        {/* Cities */}
        {CORRIDOR_CITIES.map(city => (
          <g key={city.name}>
            {city.primary && (
              <circle cx={city.x} cy={city.y} r="5" fill={city.color} opacity="0.15">
                <animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" />
              </circle>
            )}
            <circle cx={city.x} cy={city.y} r={city.primary ? 3 : 2} fill={city.color} opacity={city.primary ? 1 : 0.6} />
            {city.primary && (
              <text
                x={city.color === "#C9A84C" ? city.x - 18 : city.x}
                y={city.y - 10}
                fontFamily="'JetBrains Mono', monospace"
                fontSize="9"
                fill={city.color}
                textAnchor={city.color === "#C9A84C" ? "end" : "middle"}
                letterSpacing="0.08em"
                opacity="0.8"
              >
                {city.name}
              </text>
            )}
          </g>
        ))}

        {/* Legend */}
        <g transform="translate(420, 380)">
          <line x1="0" y1="0" x2="20" y2="0" stroke="#C9A84C" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <text x="28" y="3" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#C9A84C" opacity="0.6">AF &rarr; EU</text>
          <line x1="0" y1="16" x2="20" y2="16" stroke="#A8B0BC" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
          <text x="28" y="19" fontFamily="'JetBrains Mono', monospace" fontSize="8" fill="#A8B0BC" opacity="0.6">EU &rarr; AF</text>
        </g>
      </svg>
    </div>
  )
}
