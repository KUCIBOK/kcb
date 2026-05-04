/**
 * World map for the Gateway Global side.
 * Compact version of CorridorMapSvg — all continents + animated routes from West Africa hub.
 * ViewBox 0 0 1000 500 (Mercator). Displayed square/portrait via container.
 */

const HUB = { x: 452, y: 218 }

const ROUTES = [
  {
    id: 'eu1',
    path: 'M452,218 C455,177 478,142 506,112',
    color: '#B4BDC8',
    dur: '3.8s',
    begin: '0s',
  },
  {
    id: 'eu2',
    path: 'M452,218 C450,168 470,130 494,103',
    color: '#B4BDC8',
    dur: '4.2s',
    begin: '1.1s',
  },
  {
    id: 'am1',
    path: 'M452,218 C408,162 346,142 286,138',
    color: '#6CA8D8',
    dur: '5.8s',
    begin: '0.5s',
  },
  {
    id: 'am2',
    path: 'M452,218 C428,264 394,296 360,317',
    color: '#6CA8D8',
    dur: '5.2s',
    begin: '2.3s',
  },
  {
    id: 'me',
    path: 'M452,218 C516,196 584,184 648,181',
    color: '#C8BA90',
    dur: '4.6s',
    begin: '0.8s',
  },
  {
    id: 'as1',
    path: 'M452,218 C572,172 698,142 818,140',
    color: '#C8BA90',
    dur: '6.5s',
    begin: '1.5s',
  },
  {
    id: 'as2',
    path: 'M452,218 C586,166 734,148 882,152',
    color: '#C8BA90',
    dur: '7.2s',
    begin: '3.0s',
  },
  {
    id: 'oc',
    path: 'M452,218 C600,274 760,314 908,344',
    color: '#C8BA90',
    dur: '8.0s',
    begin: '2.0s',
  },
  {
    id: 'af1',
    path: 'M452,218 C502,232 550,248 598,257',
    color: '#C9A84C',
    dur: '3.5s',
    begin: '0.4s',
  },
]

export default function GatewayMapSvg() {
  return (
    <svg
      viewBox="0 0 1000 500"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      <defs>
        <filter id="gw-glow-hub" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="gw-glow-dot" x="-150%" y="-150%" width="400%" height="400%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="gw-africa-fill" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0.07" />
        </radialGradient>
        <radialGradient id="gw-hub-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#C9A84C" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#C9A84C" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Grid */}
      {[83, 250, 417].map((y) => (
        <line
          key={`gy${y}`}
          x1="0"
          y1={y}
          x2="1000"
          y2={y}
          stroke="rgba(80,130,220,0.05)"
          strokeWidth="0.5"
        />
      ))}
      {[167, 333, 500, 667, 833].map((x) => (
        <line
          key={`gx${x}`}
          x1={x}
          y1="0"
          x2={x}
          y2="500"
          stroke="rgba(80,130,220,0.05)"
          strokeWidth="0.5"
        />
      ))}

      {/* ── Continents ── */}
      {/* Greenland */}
      <path
        d="M332,42 L360,36 L384,37 L402,44 L410,58 L408,74 L395,85 L372,90 L346,88 L328,77 L320,62 L325,50 Z"
        fill="rgba(90,130,210,0.07)"
        stroke="rgba(110,155,230,0.16)"
        strokeWidth="0.6"
      />
      {/* North America */}
      <path
        d="M108,105 L130,82 L162,62 L212,56 L264,57 L308,64 L338,80 L354,100 L348,124 L330,144 L312,162 L295,180 L278,194 L264,197 L252,192 L242,184 L230,180 L224,172 L216,166 L208,168 L196,180 L180,190 L168,183 L158,168 L150,150 L148,130 L150,112 L140,100 L120,98 Z"
        fill="rgba(90,130,210,0.09)"
        stroke="rgba(110,155,230,0.2)"
        strokeWidth="0.7"
      />
      {/* South America */}
      <path
        d="M222,220 L268,216 L308,218 L334,230 L352,252 L368,278 L378,308 L384,338 L380,364 L366,390 L346,412 L320,430 L294,436 L268,432 L246,418 L230,396 L218,370 L213,340 L213,310 L216,278 Z"
        fill="rgba(90,130,210,0.09)"
        stroke="rgba(110,155,230,0.2)"
        strokeWidth="0.7"
      />
      {/* Europe */}
      <path
        d="M458,95 L478,88 L500,85 L525,88 L548,95 L562,108 L565,122 L556,138 L538,150 L515,156 L490,154 L468,146 L454,134 L450,118 L453,105 Z"
        fill="rgba(90,130,210,0.11)"
        stroke="rgba(110,155,230,0.24)"
        strokeWidth="0.8"
      />
      <path
        d="M512,80 L520,68 L530,60 L545,58 L555,68 L556,82 L542,88 L528,84 Z"
        fill="rgba(90,130,210,0.09)"
        stroke="rgba(110,155,230,0.18)"
        strokeWidth="0.6"
      />
      <path
        d="M470,100 L480,96 L492,99 L496,110 L489,120 L478,122 L468,115 L466,107 Z"
        fill="rgba(90,130,210,0.08)"
        stroke="rgba(110,155,230,0.16)"
        strokeWidth="0.5"
      />
      {/* Africa — gold highlight */}
      <path
        d="M484,150 L510,146 L546,147 L570,152 L588,163 L600,176 L614,193 L630,210 L640,218 L636,230 L622,248 L610,268 L602,290 L598,314 L582,338 L564,348 L549,350 L535,346 L518,334 L516,322 L520,308 L523,285 L518,262 L508,246 L498,238 L486,234 L468,228 L454,218 L448,204 L450,190 L453,177 L460,165 L472,155 Z"
        fill="url(#gw-africa-fill)"
        stroke="rgba(201,168,76,0.3)"
        strokeWidth="1.1"
      />
      {/* Middle East */}
      <path
        d="M582,162 L600,162 L618,164 L636,168 L650,178 L658,192 L658,210 L648,226 L632,234 L614,234 L600,224 L588,210 L580,196 L578,182 Z"
        fill="rgba(90,130,210,0.07)"
        stroke="rgba(110,155,230,0.15)"
        strokeWidth="0.6"
      />
      {/* Asia */}
      <path
        d="M552,95 L590,86 L638,78 L695,72 L750,70 L810,72 L860,78 L902,90 L932,108 L955,130 L965,155 L958,178 L942,196 L912,210 L882,216 L852,216 L822,210 L798,215 L774,228 L752,242 L726,248 L702,244 L678,236 L658,230 L646,234 L630,234 L616,228 L600,222 L584,208 L578,192 L588,163 L570,150 L546,147 L534,132 L532,118 L540,102 L550,96 Z"
        fill="rgba(90,130,210,0.09)"
        stroke="rgba(110,155,230,0.2)"
        strokeWidth="0.7"
      />
      {/* Australia */}
      <path
        d="M792,300 L830,292 L872,294 L908,302 L926,320 L932,342 L924,364 L906,380 L878,388 L848,384 L820,370 L800,352 L790,330 L790,314 Z"
        fill="rgba(90,130,210,0.09)"
        stroke="rgba(110,155,230,0.2)"
        strokeWidth="0.7"
      />

      {/* ── Routes ── */}
      {ROUTES.map((r) => (
        <path
          key={`r-${r.id}`}
          d={r.path}
          stroke={r.color}
          strokeWidth="0.8"
          strokeDasharray="5 5"
          strokeLinecap="round"
          opacity="0.35"
        />
      ))}

      {/* ── Animated dots ── */}
      {ROUTES.map((r) => (
        <circle key={`d-${r.id}`} r="2" fill="white" filter="url(#gw-glow-dot)">
          <animate
            attributeName="opacity"
            values="0;1;1;0"
            dur={r.dur}
            repeatCount="indefinite"
            begin={r.begin}
            keyTimes="0;0.05;0.9;1"
          />
          <animateMotion dur={r.dur} repeatCount="indefinite" begin={r.begin} path={r.path} />
        </circle>
      ))}

      {/* ── Hub ── */}
      <circle cx={HUB.x} cy={HUB.y} r="45" fill="url(#gw-hub-glow)" />
      <circle cx={HUB.x} cy={HUB.y} r="18" fill="none" stroke="#C9A84C" strokeWidth="0.7">
        <animate attributeName="r" values="18;34;18" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.3;0;0.3" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle cx={HUB.x} cy={HUB.y} r="10" fill="none" stroke="#C9A84C" strokeWidth="1.2">
        <animate
          attributeName="r"
          values="10;20;10"
          dur="3.5s"
          repeatCount="indefinite"
          begin="0.6s"
        />
        <animate
          attributeName="opacity"
          values="0.5;0;0.5"
          dur="3.5s"
          repeatCount="indefinite"
          begin="0.6s"
        />
      </circle>
      <circle
        cx={HUB.x}
        cy={HUB.y}
        r="6"
        fill="#C9A84C"
        opacity="0.35"
        filter="url(#gw-glow-hub)"
      />
      <circle cx={HUB.x} cy={HUB.y} r="3.5" fill="#C9A84C" />
      <circle cx={HUB.x} cy={HUB.y} r="1.5" fill="white" opacity="0.95" />

      {/* Hub label */}
      <text
        x={HUB.x}
        y={HUB.y - 22}
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8"
        fill="#C9A84C"
        textAnchor="middle"
        letterSpacing="0.14em"
        opacity="0.85"
      >
        WEST AFRICA
      </text>

      {/* Destination city dots */}
      {[
        { x: 506, y: 112 },
        { x: 494, y: 103 },
        { x: 286, y: 138 },
        { x: 360, y: 317 },
        { x: 648, y: 181 },
        { x: 818, y: 140 },
        { x: 882, y: 152 },
        { x: 908, y: 344 },
        { x: 598, y: 257 },
      ].map((c, i) => (
        <circle key={i} cx={c.x} cy={c.y} r="2" fill="rgba(180,189,200,0.7)" />
      ))}
    </svg>
  )
}
