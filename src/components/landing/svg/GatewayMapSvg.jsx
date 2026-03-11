/**
 * Mini corridor map for the Gateway split-screen (Africa + Europe only).
 */
export default function GatewayMapSvg() {
  return (
    <svg viewBox="-120 -80 700 700" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet" className="w-full h-full">
      <defs>
        <linearGradient id="gw-route-up" x1="40" y1="205" x2="125" y2="83" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C9A84C" /><stop offset="100%" stopColor="#A8B0BC" />
        </linearGradient>
        <linearGradient id="gw-route-down" x1="135" y1="88" x2="60" y2="210" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A8B0BC" /><stop offset="100%" stopColor="#C9A84C" />
        </linearGradient>
      </defs>

      {/* Grid lines */}
      {[100, 250, 400].map(y => (
        <line key={`h${y}`} x1="-120" y1={y} x2="580" y2={y} stroke="rgba(168,176,188,0.04)" strokeWidth="0.5" />
      ))}
      {[100, 250, 400].map(x => (
        <line key={`v${x}`} x1={x} y1="-80" x2={x} y2="620" stroke="rgba(168,176,188,0.04)" strokeWidth="0.5" />
      ))}

      {/* Europe */}
      <path d="M260 234l-5 5-2-1 2-4 3-2 5-2-3 6z m-33-2l-7 1-4-3-3 1-8-30-2 5-4 10-130-7-1-3-6-2 3-5 8-1 7 2 4-7 2 3 16-5 6-5 5-1-1 2 2 0 0 2 1 3 30 2 3 1 1 20 1 2 6 1-6 4-4 4-2 1-2-1-1 2-6 4-2 3 3-10 3-2 20 2-3 2-2 5 2 1-2 3-7 4-9-2-9 2-3 4z M206 226l0 2 8 3 3-1 4 3 7-1-2 4-8 4-8 1-2 2-6 4-5 50 4-5 3-4 4-5 1-7 5-7 0-50-5 2-3 2-20-1-2 1-4-4-1 1-2 3-2 2-2-1-2 4-4 0-4 3-1 2-3 2-1 4-5 4-2 1-3-30-2 1-3 0 1-3-3 1-3 2 4-5 0-3 11-5 6 1 70 5 1 40 8 0z" fill="rgba(168,176,188,0.08)" stroke="rgba(168,176,188,0.15)" strokeWidth="1" />

      {/* Africa */}
      <path d="M235 268l-3 3-2 6-4 5-5 4-2 5 3 4-1 2 2 3-2 120 6-1 3-3 5-1 3-2 4-1 4-3 3 2 50 3 1 4 3-1 4 3 2 4-22 12-19 13-9 3-6 1 1-4-2-1-3-2-1-3-16-14-15-14-16-16 1-1 00 3-8 11-5 6-1 5-2 4-3 8-3 2-5 30 4-2 8-1 2-3-1-1 2-7 2-4 0-4 7-4 6-1 5-3 6-2 10-1 90 2 1 6-2 60 1 2 40z" fill="rgba(201,168,76,0.06)" stroke="rgba(201,168,76,0.12)" strokeWidth="1" />
      {/* West Africa glow */}
      <path d="M72 413l0 4 0 4 2 2 0 2-1 2-1 0-30-1 1-1 0-4-2-30-100-2 1-20-3 10-5 5 0 2-1 10 2-2 2 1 2 0 3-2-1-2-2 1-20-2-2-2 0-2 2-6 0-1-5-2-2 3-1 4-4 2-3 2-2 3 0 3-1 30 2 2 3 2 2 5 3 4z M74 427l0 2 1 0 2-1 1 0 1 2 2 0 2-1 2-1 2-1 1 0 1 2 0 2 2 3-1 20 2 1-1 1 10 2 2 2-1 0-1 2 1 3 1 5-2 1-1 1 0 1-1 3-1 0-20-1 3-2 0-1-1 1-3-2-4-2 1-1 0-2 0 0-2-1-2 0-2-1-3-1-2-5 0-2 1-2 0-1 1-1 2-3 3-2-4-2-2-1-1-1-10-3-1-2-2-1 3-3 2 0 2-1 1 0 1-10-2 1-1 0-2 3 0 4 2 10 1-1 3 0 10z" fill="rgba(201,168,76,0.12)" stroke="rgba(201,168,76,0.25)" strokeWidth="1" />

      {/* Route AF->EU */}
      <path d="M40,205 C30,170 50,130 80,105 C95,93 110,87 125,83" stroke="url(#gw-route-up)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity="0.7" />
      {/* Route EU->AF */}
      <path d="M135,88 C150,110 140,145 120,170 C105,188 85,198 60,210" stroke="url(#gw-route-down)" strokeWidth="2" strokeDasharray="6 4" strokeLinecap="round" opacity="0.5" />

      {/* Moving dot AF->EU */}
      <circle r="3.5" fill="white" opacity="0.8">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M40,205 C30,170 50,130 80,105 C95,93 110,87 125,83" />
      </circle>
      {/* Moving dot EU->AF */}
      <circle r="3.5" fill="white" opacity="0.8">
        <animateMotion dur="3.5s" repeatCount="indefinite" path="M135,88 C150,110 140,145 120,170 C105,188 85,198 60,210" begin="1.7s" />
      </circle>

      {/* Dakar */}
      <circle cx="-10" cy="202" r="5" fill="#C9A84C" opacity="0.15"><animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" /></circle>
      <circle cx="-10" cy="202" r="3" fill="#C9A84C" />
      <text x="-28" y="200" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#C9A84C" textAnchor="end" letterSpacing="0.08em" opacity="0.8">DAKAR</text>

      {/* Paris */}
      <circle cx="110" cy="100" r="5" fill="#A8B0BC" opacity="0.15"><animate attributeName="r" values="5;8;5" dur="3s" repeatCount="indefinite" begin="1.5s" /></circle>
      <circle cx="110" cy="100" r="3" fill="#A8B0BC" />
      <text x="110" y="90" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#A8B0BC" textAnchor="middle" letterSpacing="0.08em" opacity="0.8">PARIS</text>

      {/* Bruxelles */}
      <circle cx="135" cy="85" r="3" fill="#A8B0BC" opacity="0.15"><animate attributeName="r" values="3;6;3" dur="4s" repeatCount="indefinite" begin="0.8s" /></circle>
      <circle cx="135" cy="85" r="2" fill="#A8B0BC" opacity="0.6" />

      {/* Abidjan */}
      <circle cx="55" cy="220" r="3" fill="#C9A84C" opacity="0.15"><animate attributeName="r" values="3;6;3" dur="4s" repeatCount="indefinite" begin="2s" /></circle>
      <circle cx="55" cy="220" r="2" fill="#C9A84C" opacity="0.6" />
    </svg>
  )
}
