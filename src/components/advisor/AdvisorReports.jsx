import { useState } from 'react'
import { motion } from 'framer-motion'
import { FileText, Download, Mail, Check, ChevronDown } from 'lucide-react'

const MOCK_CLIENTS = [
  { id: 1, name: 'Marie Dubois' },
  { id: 2, name: 'John Smith' },
  { id: 3, name: 'Fondation Lumière' },
  { id: 4, name: 'Ahmed Al-Rashid' },
  { id: 5, name: 'Sophie Laurent' },
  { id: 6, name: 'Marcus Weber' },
  { id: 7, name: 'Chioma Okafor' },
  { id: 8, name: 'Elena Petrov' },
]

const REPORT_TYPES = [
  { key: 'quarterly', label: 'Rapport trimestriel' },
  { key: 'annual', label: 'Rapport annuel' },
  { key: 'custom', label: 'Rapport personnalisé' },
]

const SECTIONS = [
  { key: 'summary', label: 'Synthèse portefeuille', default: true },
  { key: 'performance', label: 'Performance & ROI', default: true },
  { key: 'transactions', label: 'Historique transactions', default: true },
  { key: 'market', label: 'Intelligence marché', default: false },
  { key: 'recommendations', label: 'Recommandations', default: true },
  { key: 'risk', label: 'Analyse des risques', default: false },
]

const RECENT_REPORTS = [
  {
    id: 1,
    client: 'Fondation Lumière',
    type: 'Trimestriel Q1 2026',
    date: '2026-04-15',
    size: '2.4 MB',
  },
  { id: 2, client: 'John Smith', type: 'Trimestriel Q1 2026', date: '2026-04-10', size: '1.8 MB' },
  { id: 3, client: 'Marie Dubois', type: 'Annuel 2025', date: '2026-01-20', size: '3.1 MB' },
  { id: 4, client: 'Marcus Weber', type: 'Personnalisé', date: '2026-03-05', size: '1.2 MB' },
]

export function AdvisorReports() {
  const [client, setClient] = useState('')
  const [reportType, setReportType] = useState('quarterly')
  const [sections, setSections] = useState(
    Object.fromEntries(SECTIONS.map((s) => [s.key, s.default]))
  )
  const [generating, setGenerating] = useState(false)
  const [generated, setGenerated] = useState(false)

  const toggleSection = (key) => {
    setSections((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleGenerate = async () => {
    if (!client) return
    setGenerating(true)
    setGenerated(false)
    await new Promise((r) => setTimeout(r, 1800))
    setGenerating(false)
    setGenerated(true)
  }

  return (
    <div className="space-y-6 pb-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Config form */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5 space-y-5"
        >
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-kcb-or" />
            Configurer le rapport
          </h3>

          {/* Client select */}
          <div>
            <label className="text-xs text-kcb-pierre block mb-1.5">Client</label>
            <div className="relative">
              <select
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full appearance-none bg-kcb-noir border border-white/[0.08] rounded-[4px] px-3 py-2.5 text-sm text-white focus:outline-none focus:border-kcb-or transition pr-8"
              >
                <option value="">— Sélectionner un client —</option>
                {MOCK_CLIENTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-kcb-pierre absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Report type */}
          <div>
            <label className="text-xs text-kcb-pierre block mb-1.5">Type de rapport</label>
            <div className="flex gap-2 flex-wrap">
              {REPORT_TYPES.map((rt) => (
                <button
                  key={rt.key}
                  onClick={() => setReportType(rt.key)}
                  className={`text-xs px-3 py-1.5 rounded-[4px] border transition ${
                    reportType === rt.key
                      ? 'bg-kcb-or text-kcb-noir border-kcb-or font-semibold'
                      : 'border-white/[0.08] text-kcb-pierre hover:border-kcb-or/30'
                  }`}
                >
                  {rt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div>
            <label className="text-xs text-kcb-pierre block mb-2">Sections à inclure</label>
            <div className="space-y-2">
              {SECTIONS.map((s) => (
                <label key={s.key} className="flex items-center gap-3 cursor-pointer group">
                  <div
                    onClick={() => toggleSection(s.key)}
                    className={`w-4 h-4 rounded-[4px] border flex items-center justify-center shrink-0 transition ${
                      sections[s.key]
                        ? 'bg-kcb-or border-kcb-or'
                        : 'border-white/[0.15] group-hover:border-kcb-or/40'
                    }`}
                  >
                    {sections[s.key] && (
                      <Check className="w-2.5 h-2.5 text-kcb-noir" strokeWidth={3} />
                    )}
                  </div>
                  <span className="text-sm text-kcb-sable">{s.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={!client || generating}
            className="w-full py-2.5 bg-kcb-or hover:bg-kcb-bronze text-kcb-noir font-semibold text-sm rounded-[4px] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {generating ? (
              <>
                <span className="w-4 h-4 border-2 border-kcb-noir/40 border-t-kcb-noir rounded-full animate-spin" />
                Génération en cours…
              </>
            ) : generated ? (
              <>
                <Check className="w-4 h-4" />
                Rapport prêt
              </>
            ) : (
              <>
                <FileText className="w-4 h-4" />
                Générer le rapport
              </>
            )}
          </button>

          {generated && (
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-kcb-or/30 text-kcb-or text-xs rounded-[4px] hover:bg-kcb-or/10 transition">
                <Download className="w-3.5 h-3.5" />
                Télécharger PDF
              </button>
              <button className="flex-1 flex items-center justify-center gap-2 py-2 border border-white/[0.08] text-kcb-pierre text-xs rounded-[4px] hover:bg-white/[0.04] transition">
                <Mail className="w-3.5 h-3.5" />
                Envoyer au client
              </button>
            </div>
          )}
        </motion.div>

        {/* Recent reports */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5"
        >
          <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
            <FileText className="w-4 h-4 text-kcb-bronze" />
            Rapports récents
          </h3>
          <div className="space-y-3">
            {RECENT_REPORTS.map((r) => (
              <div
                key={r.id}
                className="flex items-center gap-3 p-3 bg-kcb-noir/40 rounded-[4px] border border-white/[0.04] hover:border-kcb-or/15 transition"
              >
                <div className="w-8 h-8 rounded-[4px] bg-kcb-or/10 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-kcb-or" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{r.client}</p>
                  <p className="text-xs text-kcb-pierre">
                    {r.type} · {r.date}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-kcb-pierre">{r.size}</span>
                  <button className="p-1 hover:text-kcb-or text-kcb-pierre transition">
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
