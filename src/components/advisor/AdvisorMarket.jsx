import { motion } from 'framer-motion'
import { TrendingUp, Globe, Award, Zap, ArrowUp, ArrowDown, BarChart3 } from 'lucide-react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const COUNTRY_TRENDS = [
  {
    country: 'Sénégal',
    growth: 18.4,
    volume: '€2.1M',
    avgPrice: '€12K',
    artists: 142,
    trending: true,
  },
  {
    country: 'Nigeria',
    growth: 22.7,
    volume: '€3.8M',
    avgPrice: '€18K',
    artists: 218,
    trending: true,
  },
  {
    country: "Côte d'Ivoire",
    growth: 14.2,
    volume: '€1.4M',
    avgPrice: '€9K',
    artists: 96,
    trending: false,
  },
  {
    country: 'Ghana',
    growth: 11.8,
    volume: '€0.9M',
    avgPrice: '€7K',
    artists: 74,
    trending: false,
  },
  {
    country: 'Cameroun',
    growth: 8.3,
    volume: '€0.6M',
    avgPrice: '€6K',
    artists: 58,
    trending: false,
  },
  { country: 'Bénin', growth: 31.5, volume: '€0.4M', avgPrice: '€5K', artists: 43, trending: true },
]

const TOP_ARTISTS = [
  { name: 'Aminata Diop', country: 'Sénégal', appreciation: '+28%', buzz: 94, exhibitions: 4 },
  { name: 'Ngozi Adeyemi', country: 'Nigeria', appreciation: '+41%', buzz: 88, exhibitions: 6 },
  { name: 'Kofi Mensah', country: 'Ghana', appreciation: '+19%', buzz: 72, exhibitions: 3 },
  { name: 'Bineta Sow', country: 'Sénégal', appreciation: '+35%', buzz: 81, exhibitions: 5 },
  { name: 'Cheick Mbaye', country: 'Sénégal', appreciation: '+22%', buzz: 68, exhibitions: 2 },
  { name: 'Emeka Okonkwo', country: 'Nigeria', appreciation: '+17%', buzz: 65, exhibitions: 4 },
]

const MEDIUM_DATA = {
  labels: ['Peinture', 'Sculpture', 'Photographie', 'Installation', 'Dessin', 'Vidéo'],
  datasets: [
    {
      label: 'Croissance YTD (%)',
      data: [24, 18, 31, 12, 15, 42],
      backgroundColor: ['#C9A84C', '#8B6914', '#C9A84C', '#4A4E5A', '#8B6914', '#C9A84C'],
      borderRadius: 4,
    },
  ],
}

const barOptions = {
  responsive: true,
  plugins: { legend: { display: false } },
  scales: {
    y: {
      beginAtZero: true,
      ticks: { color: '#9AA0AC', callback: (v) => `+${v}%` },
      grid: { color: 'rgba(255,255,255,0.04)' },
    },
    x: { ticks: { color: '#9AA0AC' }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
}

const OPPORTUNITIES = [
  {
    type: 'buy',
    text: 'Bénin — marché émergent, croissance +31.5%. Potentiel fort sur artistes <35 ans.',
    tag: 'Opportunité',
  },
  {
    type: 'watch',
    text: 'Vidéo art africain — croissance +42% YTD, sous-représenté dans les portefeuilles.',
    tag: 'Tendance',
  },
  {
    type: 'alert',
    text: 'Peinture contemporaine nigériane — valorisation rapide, risque liquidité à surveiller.',
    tag: 'Attention',
  },
  {
    type: 'buy',
    text: 'Ngozi Adeyemi — 2 expositions majeures prévues Q3 2026, prix en hausse.',
    tag: 'Artiste',
  },
]

export function AdvisorMarket() {
  return (
    <div className="space-y-6 pb-8">
      {/* Market overview header */}
      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4"
      >
        {[
          { label: 'Art africain — marché global', value: '€4.2B', sub: '+16.3% YTD', up: true },
          {
            label: 'Volume transactions Q1 2026',
            value: '€312M',
            sub: '+24% vs Q1 2025',
            up: true,
          },
          { label: 'Prix moyen catégorie A', value: '€18K', sub: '+11% vs 2025', up: true },
          { label: 'Sentiment marché', value: 'Haussier', sub: 'Indice: 74/100', up: true },
        ].map((m, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-3">
            <p className="text-xs text-kcb-pierre mb-1">{m.label}</p>
            <p className="text-xl font-bold text-kcb-or tabular-nums">{m.value}</p>
            <p
              className={`text-xs mt-1 flex items-center gap-1 ${m.up ? 'text-kcb-or' : 'text-red-400'}`}
            >
              {m.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              {m.sub}
            </p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Country trends */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <Globe className="w-4 h-4 text-kcb-or" />
            Tendances par pays
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="text-left py-1.5 px-2 text-xs text-kcb-pierre font-medium">
                    Pays
                  </th>
                  <th className="text-right py-1.5 px-2 text-xs text-kcb-pierre font-medium">
                    Croissance
                  </th>
                  <th className="text-right py-1.5 px-2 text-xs text-kcb-pierre font-medium hidden sm:table-cell">
                    Volume
                  </th>
                  <th className="text-right py-1.5 px-2 text-xs text-kcb-pierre font-medium hidden sm:table-cell">
                    Prix moy.
                  </th>
                </tr>
              </thead>
              <tbody>
                {COUNTRY_TRENDS.sort((a, b) => b.growth - a.growth).map((c) => (
                  <tr
                    key={c.country}
                    className="border-b border-white/[0.03] hover:bg-white/[0.02]"
                  >
                    <td className="py-2 px-2">
                      <div className="flex items-center gap-2">
                        <span className="text-white text-sm">{c.country}</span>
                        {c.trending && (
                          <span className="text-[9px] px-1.5 py-0.5 bg-kcb-or/10 text-kcb-or rounded-[4px] font-medium">
                            HOT
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-2 px-2 text-right">
                      <span className="text-kcb-or font-semibold tabular-nums">+{c.growth}%</span>
                    </td>
                    <td className="py-2 px-2 text-right text-kcb-pierre hidden sm:table-cell">
                      {c.volume}
                    </td>
                    <td className="py-2 px-2 text-right text-kcb-pierre hidden sm:table-cell">
                      {c.avgPrice}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Medium trends chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-kcb-bronze" />
            Croissance par medium (YTD)
          </h3>
          <Bar data={MEDIUM_DATA} options={barOptions} height={220} />
        </motion.div>
      </div>

      {/* Top artists */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.28 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-kcb-or" />
          Top artistes — appréciation prix
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {TOP_ARTISTS.map((artist, i) => (
            <div
              key={i}
              className="bg-kcb-noir/40 rounded-[4px] border border-white/[0.04] p-3 hover:border-kcb-or/15 transition"
            >
              <div className="flex items-center justify-between mb-2">
                <p className="text-sm font-semibold text-white">{artist.name}</p>
                <span className="text-xs font-bold text-kcb-or tabular-nums">
                  {artist.appreciation}
                </span>
              </div>
              <p className="text-xs text-kcb-pierre mb-2">{artist.country}</p>
              <div className="flex items-center gap-3 text-xs text-kcb-pierre">
                <span>
                  Buzz : <span className="text-kcb-bronze font-medium">{artist.buzz}/100</span>
                </span>
                <span>
                  Expo : <span className="text-white">{artist.exhibitions}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Opportunities */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.35 }}
        className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4"
      >
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Zap className="w-4 h-4 text-kcb-or" />
          Opportunités &amp; signaux
        </h3>
        <div className="space-y-3">
          {OPPORTUNITIES.map((opp, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-3 bg-kcb-noir/40 rounded-[4px] border border-white/[0.04]"
            >
              <span
                className={`text-[10px] px-2 py-0.5 rounded-[4px] font-semibold shrink-0 mt-0.5 ${
                  opp.tag === 'Opportunité'
                    ? 'bg-kcb-or/10 text-kcb-or'
                    : opp.tag === 'Tendance'
                      ? 'bg-kcb-bronze/15 text-kcb-bronze'
                      : opp.tag === 'Attention'
                        ? 'bg-red-900/30 text-red-400'
                        : 'bg-white/[0.07] text-kcb-pierre'
                }`}
              >
                {opp.tag}
              </span>
              <p className="text-sm text-kcb-sable leading-snug">{opp.text}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
