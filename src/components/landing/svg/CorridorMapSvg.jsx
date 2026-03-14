/**
 * World map — animated trade routes radiating from West Africa hub to all continents.
 * ViewBox: 0 0 1000 500 (Mercator-like projection)
 * Africa hub at ~(452, 218) — Dakar / Abidjan area
 */

const HUB = { x: 452, y: 218 }

const DESTINATIONS = [
  // Europe
  { id: "paris",    label: "PARIS",     x: 506, y: 112, color: "#B4BDC8", showLabel: true,  dur: "4.2s", begin: "0s"    },
  { id: "london",   label: "LONDON",    x: 494, y: 103, color: "#B4BDC8", showLabel: true,  dur: "4.8s", begin: "1.3s"  },
  { id: "madrid",   label: "MADRID",    x: 476, y: 128, color: "#B4BDC8", showLabel: false, dur: "5.0s", begin: "2.6s"  },
  { id: "brussels", label: "BRUSSELS",  x: 510, y: 107, color: "#B4BDC8", showLabel: false, dur: "5.5s", begin: "3.8s"  },
  // Americas
  { id: "newyork",  label: "NEW YORK",  x: 286, y: 138, color: "#6CA8D8", showLabel: true,  dur: "6.5s", begin: "0.5s"  },
  { id: "miami",    label: "MIAMI",     x: 264, y: 183, color: "#6CA8D8", showLabel: false, dur: "6.0s", begin: "3.2s"  },
  { id: "saopaulo", label: "SÃO PAULO", x: 360, y: 317, color: "#6CA8D8", showLabel: true,  dur: "5.8s", begin: "1.8s"  },
  // Middle East
  { id: "dubai",    label: "DUBAI",     x: 648, y: 181, color: "#C8BA90", showLabel: true,  dur: "5.2s", begin: "0.7s"  },
  // Asia
  { id: "mumbai",   label: "MUMBAI",    x: 696, y: 202, color: "#C8BA90", showLabel: true,  dur: "6.2s", begin: "2.1s"  },
  { id: "beijing",  label: "BEIJING",   x: 818, y: 140, color: "#C8BA90", showLabel: true,  dur: "7.2s", begin: "0.9s"  },
  { id: "tokyo",    label: "TOKYO",     x: 882, y: 152, color: "#C8BA90", showLabel: true,  dur: "7.8s", begin: "3.5s"  },
  // Oceania
  { id: "sydney",   label: "SYDNEY",    x: 908, y: 344, color: "#C8BA90", showLabel: true,  dur: "8.5s", begin: "1.5s"  },
  // Africa destinations
  { id: "nairobi",  label: "NAIROBI",   x: 598, y: 257, color: "#C9A84C", showLabel: true,  dur: "3.8s", begin: "0.9s"  },
  { id: "cairo",    label: "CAIRO",     x: 581, y: 167, color: "#C9A84C", showLabel: true,  dur: "4.4s", begin: "2.8s"  },
]

const ROUTE_PATHS = {
  // Arcs bend slightly away from straight line to simulate great-circle paths
  paris:    "M452,218 C455,177 478,142 506,112",
  london:   "M452,218 C450,168 470,130 494,103",
  madrid:   "M452,218 C456,184 466,156 476,128",
  brussels: "M452,218 C458,170 484,132 510,107",
  newyork:  "M452,218 C408,162 346,142 286,138",
  miami:    "M452,218 C400,196 330,188 264,183",
  saopaulo: "M452,218 C428,264 394,296 360,317",
  dubai:    "M452,218 C516,196 584,184 648,181",
  mumbai:   "M452,218 C530,204 614,200 696,202",
  beijing:  "M452,218 C572,172 698,142 818,140",
  tokyo:    "M452,218 C586,166 734,148 882,152",
  sydney:   "M452,218 C600,274 760,314 908,344",
  nairobi:  "M452,218 C502,232 550,248 598,257",
  cairo:    "M452,218 C490,192 536,174 581,167",
}

export default function CorridorMapSvg() {
  return (
    <div
      className="w-full aspect-[2/1] relative overflow-hidden"
      style={{ background: "linear-gradient(160deg, #050d1c 0%, #091526 55%, #060c18 100%)" }}
    >
      <svg
        viewBox="0 0 1000 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        aria-label="World map showing logistics routes from West Africa"
      >
        <defs>
          {/* Hub glow */}
          <filter id="glow-hub" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Moving dot glow */}
          <filter id="glow-dot" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* City node glow */}
          <filter id="glow-city" x="-100%" y="-100%" width="300%" height="300%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Africa highlight gradient */}
          <radialGradient id="africa-fill" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.07" />
          </radialGradient>
          {/* Hub radial glow */}
          <radialGradient id="hub-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* ── Latitude lines (every 30°) ── */}
        {[83, 167, 250, 333, 417].map(y => (
          <line key={`lat-${y}`} x1="0" y1={y} x2="1000" y2={y}
            stroke="rgba(80,130,220,0.05)" strokeWidth="0.6" />
        ))}
        {/* ── Longitude lines (every 30°) ── */}
        {[83, 167, 250, 333, 417, 500, 583, 667, 750, 833, 917].map(x => (
          <line key={`lon-${x}`} x1={x} y1="0" x2={x} y2="500"
            stroke="rgba(80,130,220,0.05)" strokeWidth="0.6" />
        ))}

        {/* ══════════════════════════════════════════
            CONTINENT OUTLINES
            Coordinates: x=(lon+180)/360*1000, y=(90-lat)/180*500
        ══════════════════════════════════════════ */}

        {/* ── Greenland ── */}
        <path
          d="M332,42 L360,36 L384,37 L402,44 L410,58 L408,74 L395,85 L372,90 L346,88 L328,77 L320,62 L325,50 Z"
          fill="rgba(90,130,210,0.07)" stroke="rgba(110,155,230,0.18)" strokeWidth="0.7"
        />

        {/* ── North America ── */}
        <path
          d="
            M108,105 L130,82 L162,62 L212,56 L264,57 L308,64
            L338,80 L354,100 L348,124 L330,144 L312,162
            L295,180 L278,194 L264,197 L252,192 L242,184
            L230,180 L224,172 L216,166 L208,168 L196,180
            L180,190 L168,183 L158,168 L150,150 L148,130
            L150,112 L140,100 L120,98 Z
          "
          fill="rgba(90,130,210,0.09)" stroke="rgba(110,155,230,0.22)" strokeWidth="0.8"
        />
        {/* Baja California peninsula */}
        <path
          d="M168,183 L174,192 L178,205 L172,215 L164,208 L160,198 L162,186 Z"
          fill="rgba(90,130,210,0.07)" stroke="rgba(110,155,230,0.15)" strokeWidth="0.6"
        />
        {/* Cuba / Caribbean (simplified) */}
        <ellipse cx="258" cy="206" rx="14" ry="5" fill="rgba(90,130,210,0.06)"
          stroke="rgba(110,155,230,0.12)" strokeWidth="0.5" />

        {/* ── South America ── */}
        <path
          d="
            M222,220 L268,216 L308,218 L334,230 L352,252
            L368,278 L378,308 L384,338 L380,364 L366,390
            L346,412 L320,430 L294,436 L268,432 L246,418
            L230,396 L218,370 L213,340 L213,310 L216,278 Z
          "
          fill="rgba(90,130,210,0.09)" stroke="rgba(110,155,230,0.22)" strokeWidth="0.8"
        />

        {/* ── Iceland ── */}
        <path
          d="M436,74 L450,68 L464,70 L468,80 L460,90 L444,92 L435,84 Z"
          fill="rgba(90,130,210,0.06)" stroke="rgba(110,155,230,0.15)" strokeWidth="0.6"
        />

        {/* ── Europe ── */}
        <path
          d="
            M470,148 L484,150 L498,150 L510,144 L524,130
            L534,132 L542,142 L546,128 L555,118 L566,120
            L572,112 L566,98 L556,90 L542,88 L528,84
            L512,80 L498,80 L484,82 L471,88 L462,96
            L453,106 L452,118 L456,132 L464,142 Z
          "
          fill="rgba(90,130,210,0.11)" stroke="rgba(110,155,230,0.25)" strokeWidth="0.8"
        />
        {/* Scandinavia */}
        <path
          d="M512,80 L520,68 L530,60 L545,58 L555,68 L556,82 L542,88 L528,84 Z"
          fill="rgba(90,130,210,0.09)" stroke="rgba(110,155,230,0.2)" strokeWidth="0.7"
        />
        {/* UK & Ireland */}
        <path
          d="M470,100 L480,96 L492,99 L496,110 L489,120 L478,122 L468,115 L466,107 Z"
          fill="rgba(90,130,210,0.08)" stroke="rgba(110,155,230,0.18)" strokeWidth="0.6"
        />
        {/* Iberian Peninsula */}
        <path
          d="M454,118 L472,113 L490,115 L504,120 L508,132 L502,144 L488,150 L472,150 L458,142 L452,130 Z"
          fill="rgba(90,130,210,0.09)" stroke="rgba(110,155,230,0.2)" strokeWidth="0.7"
        />
        {/* Italian Peninsula */}
        <path
          d="M524,128 L535,132 L540,142 L538,158 L530,168 L520,162 L516,148 L518,136 Z"
          fill="rgba(90,130,210,0.07)" stroke="rgba(110,155,230,0.16)" strokeWidth="0.6"
        />

        {/* ── AFRICA (highlighted — gold tint) ── */}
        <path
          d="
            M484,150 L510,146 L546,147 L570,152
            L588,163 L600,176 L614,193 L630,210
            L640,218 L636,230 L622,248 L610,268
            L602,290 L598,314 L582,338 L564,348
            L549,350 L535,346 L518,334 L516,322
            L520,308 L523,285 L518,262 L508,246
            L498,238 L486,234 L468,228 L454,218
            L448,204 L450,190 L453,177 L460,165
            L472,155 Z
          "
          fill="url(#africa-fill)" stroke="rgba(201,168,76,0.32)" strokeWidth="1.2"
        />
        {/* Madagascar */}
        <path
          d="M614,282 L622,272 L630,275 L635,292 L630,312 L618,322 L606,318 L603,302 L606,288 Z"
          fill="rgba(201,168,76,0.08)" stroke="rgba(201,168,76,0.18)" strokeWidth="0.6"
        />

        {/* ── Middle East / Arabian Peninsula ── */}
        <path
          d="
            M582,162 L600,162 L618,164 L636,168 L650,178
            L658,192 L658,210 L648,226 L632,234 L614,234
            L600,224 L588,210 L580,196 L578,182 Z
          "
          fill="rgba(90,130,210,0.08)" stroke="rgba(110,155,230,0.18)" strokeWidth="0.7"
        />

        {/* ── Asia ── */}
        <path
          d="
            M552,95 L590,86 L638,78 L695,72 L750,70
            L810,72 L860,78 L902,90 L932,108 L955,130
            L965,155 L958,178 L942,196 L912,210 L882,216
            L852,216 L822,210 L798,215 L774,228 L752,242
            L726,248 L702,244 L678,236 L658,230 L646,234
            L630,234 L616,228 L600,222 L584,208 L578,192
            L588,163 L570,150 L546,147 L534,132
            L532,118 L540,102 L550,96 Z
          "
          fill="rgba(90,130,210,0.09)" stroke="rgba(110,155,230,0.22)" strokeWidth="0.8"
        />
        {/* India sub-peninsula */}
        <path
          d="M654,212 L672,218 L686,232 L696,248 L694,266 L682,280 L668,286 L654,282 L642,268 L638,252 L642,236 L650,222 Z"
          fill="rgba(90,130,210,0.07)" stroke="rgba(110,155,230,0.16)" strokeWidth="0.6"
        />
        {/* Japan */}
        <path
          d="M876,142 L888,136 L898,140 L903,150 L898,164 L886,170 L875,165 L872,154 Z"
          fill="rgba(90,130,210,0.08)" stroke="rgba(110,155,230,0.2)" strokeWidth="0.6"
        />
        {/* Sri Lanka */}
        <ellipse cx="690" cy="250" rx="5" ry="8"
          fill="rgba(90,130,210,0.06)" stroke="rgba(110,155,230,0.12)" strokeWidth="0.5" />

        {/* ── Australia ── */}
        <path
          d="
            M792,298 L830,290 L872,293 L908,302
            L926,320 L932,342 L924,364 L906,380
            L878,388 L848,384 L820,370 L800,352
            L790,330 L790,314 Z
          "
          fill="rgba(90,130,210,0.09)" stroke="rgba(110,155,230,0.22)" strokeWidth="0.8"
        />
        {/* New Zealand */}
        <path
          d="M935,368 L943,360 L952,364 L955,375 L948,386 L937,388 L931,380 Z"
          fill="rgba(90,130,210,0.07)" stroke="rgba(110,155,230,0.16)" strokeWidth="0.6"
        />

        {/* ══════════════════════════════════════════
            TRADE ROUTE ARCS
        ══════════════════════════════════════════ */}

        {DESTINATIONS.map(dest => (
          <path
            key={`route-${dest.id}`}
            d={ROUTE_PATHS[dest.id]}
            stroke={dest.color}
            strokeWidth="0.9"
            strokeDasharray="5 5"
            strokeLinecap="round"
            opacity="0.35"
          />
        ))}

        {/* ══════════════════════════════════════════
            ANIMATED DOTS (one per route)
        ══════════════════════════════════════════ */}

        {DESTINATIONS.map(dest => (
          <circle key={`dot-${dest.id}`} r="2.5" fill="white" filter="url(#glow-dot)">
            <animate attributeName="opacity" values="0;1;1;0" dur={dest.dur} repeatCount="indefinite" begin={dest.begin} keyTimes="0;0.05;0.9;1" />
            <animateMotion dur={dest.dur} repeatCount="indefinite" begin={dest.begin} path={ROUTE_PATHS[dest.id]} />
          </circle>
        ))}

        {/* ══════════════════════════════════════════
            WEST AFRICA HUB
        ══════════════════════════════════════════ */}

        {/* Background radial glow */}
        <circle cx={HUB.x} cy={HUB.y} r="50" fill="url(#hub-glow)" />

        {/* Outer pulsing ring */}
        <circle cx={HUB.x} cy={HUB.y} r="20" fill="none" stroke="#C9A84C" strokeWidth="0.8">
          <animate attributeName="r"       values="20;38;20"     dur="3.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35"  dur="3.5s" repeatCount="indefinite" />
        </circle>

        {/* Middle pulsing ring */}
        <circle cx={HUB.x} cy={HUB.y} r="12" fill="none" stroke="#C9A84C" strokeWidth="1.2">
          <animate attributeName="r"       values="12;24;12"     dur="3.5s" repeatCount="indefinite" begin="0.6s" />
          <animate attributeName="opacity" values="0.5;0;0.5"    dur="3.5s" repeatCount="indefinite" begin="0.6s" />
        </circle>

        {/* Gold core glow */}
        <circle cx={HUB.x} cy={HUB.y} r="7" fill="#C9A84C" opacity="0.35" filter="url(#glow-hub)" />
        {/* Gold dot */}
        <circle cx={HUB.x} cy={HUB.y} r="4.5" fill="#C9A84C" opacity="1" />
        {/* White center */}
        <circle cx={HUB.x} cy={HUB.y} r="2" fill="white" opacity="0.95" />

        {/* Hub label */}
        <text
          x={HUB.x} y={HUB.y - 26}
          fontFamily="'JetBrains Mono', monospace"
          fontSize="7.5"
          fill="#C9A84C"
          textAnchor="middle"
          letterSpacing="0.14em"
          opacity="0.9"
        >
          WEST AFRICA HUB
        </text>

        {/* ══════════════════════════════════════════
            DESTINATION CITY NODES
        ══════════════════════════════════════════ */}

        {DESTINATIONS.map(dest => {
          // Position label above or below depending on vertical position
          const labelY = dest.y > 280 ? dest.y + 14 : dest.y - 9
          return (
            <g key={`city-${dest.id}`}>
              {/* Pulsing halo */}
              <circle cx={dest.x} cy={dest.y} r="5" fill={dest.color} opacity="0" filter="url(#glow-city)">
                <animate attributeName="opacity" values="0;0.3;0"   dur="4s" repeatCount="indefinite" begin={dest.begin} />
                <animate attributeName="r"       values="5;9;5"     dur="4s" repeatCount="indefinite" begin={dest.begin} />
              </circle>
              {/* City dot */}
              <circle cx={dest.x} cy={dest.y} r="2.2" fill={dest.color} opacity="0.85" />
              {/* City label (only for primary destinations) */}
              {dest.showLabel && (
                <text
                  x={dest.x}
                  y={labelY}
                  fontFamily="'JetBrains Mono', monospace"
                  fontSize="6"
                  fill={dest.color}
                  textAnchor="middle"
                  letterSpacing="0.1em"
                  opacity="0.7"
                >
                  {dest.label}
                </text>
              )}
            </g>
          )
        })}

        {/* ══════════════════════════════════════════
            LEGEND
        ══════════════════════════════════════════ */}
        <g transform="translate(18, 418)">
          <rect x="-4" y="-8" width="178" height="60" rx="2"
            fill="rgba(5,12,24,0.75)" />
          {/* Row 1 */}
          <line x1="0" y1="0" x2="20" y2="0" stroke="#C9A84C" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <circle cx="26" cy="0" r="2" fill="#C9A84C" opacity="0.9" />
          <text x="36" y="3.5" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#C9A84C" opacity="0.75">West Africa hub</text>
          {/* Row 2 */}
          <line x1="0" y1="17" x2="20" y2="17" stroke="#B4BDC8" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <circle cx="26" cy="17" r="2" fill="#B4BDC8" opacity="0.9" />
          <text x="36" y="20.5" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#B4BDC8" opacity="0.75">Europe / Americas</text>
          {/* Row 3 */}
          <line x1="0" y1="34" x2="20" y2="34" stroke="#C8BA90" strokeWidth="1" strokeDasharray="4 3" opacity="0.7" />
          <circle cx="26" cy="34" r="2" fill="#C8BA90" opacity="0.9" />
          <text x="36" y="37.5" fontFamily="'JetBrains Mono', monospace" fontSize="7" fill="#C8BA90" opacity="0.75">Middle East / Asia / Oceania</text>
        </g>

        {/* KCB brand mark (subtle) */}
        <text
          x="982" y="492"
          fontFamily="'JetBrains Mono', monospace"
          fontSize="6"
          fill="rgba(201,168,76,0.3)"
          textAnchor="end"
          letterSpacing="0.1em"
        >
          KUCIBOK BRIDGE
        </text>
      </svg>
    </div>
  )
}
