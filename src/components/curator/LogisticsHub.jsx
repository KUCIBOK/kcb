import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  Package,
  Shield,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  Calculator,
  MapPin,
  Globe,
} from 'lucide-react'

const TABS = [
  { id: 'shipping', label: 'Devis transport', icon: Truck },
  { id: 'permits', label: "Permis d'export", icon: FileText },
  { id: 'insurance', label: 'Assurance', icon: Shield },
  { id: 'customs', label: 'Droits de douane', icon: Calculator },
  { id: 'tracking', label: 'Suivi en temps réel', icon: MapPin },
]

const SHIPPING_QUOTES = [
  {
    provider: 'DHL Express Art',
    type: 'Transport standard',
    from: 'Dakar, Sénégal',
    to: 'London, UK',
    artworks: 12,
    value: '€85 000',
    transit: '5 jours ouvrés',
    price: '€4 200',
    priceUnit: 'HT',
    climate: false,
    tracking: 'GPS temps réel',
    insurance: 'En option',
    status: 'available',
    recommended: false,
  },
  {
    provider: 'Hasenkamp Fine Art',
    type: 'Transport spécialisé art',
    from: 'Dakar, Sénégal',
    to: 'London, UK',
    artworks: 12,
    value: '€85 000',
    transit: '10 jours ouvrés',
    price: '€6 800',
    priceUnit: 'HT',
    climate: true,
    tracking: 'GPS + rapport quotidien',
    insurance: 'Incluse (full coverage)',
    status: 'available',
    recommended: true,
  },
  {
    provider: 'Unipack Africa',
    type: 'Fret aérien groupé',
    from: 'Dakar, Sénégal',
    to: 'London, UK',
    artworks: 12,
    value: '€85 000',
    transit: '7 jours ouvrés',
    price: '€5 100',
    priceUnit: 'HT',
    climate: false,
    tracking: 'GPS standard',
    insurance: 'À souscrire',
    status: 'pending_quote',
    recommended: false,
  },
]

const PERMITS = [
  {
    country: 'Sénégal 🇸🇳',
    status: 'required',
    authority: "Ministère de la Culture — DCPA",
    delay: '15–30 jours ouvrés',
    docs: ['Lettre de prêt signée', 'Inventaire œuvres (KCB-XXXXX)', 'Accord de retour', 'Photos des œuvres'],
    note: "Permis requis pour les œuvres de plus de 30 ans ou considérées 'patrimoine national'.",
    renewed: 'Renouveler avant le 1er juin 2025',
    urgency: 'warning',
  },
  {
    country: 'Ghana 🇬🇭',
    status: 'ok',
    authority: 'Ghana Museums & Monuments Board',
    delay: '10–20 jours ouvrés',
    docs: ['Formulaire GMMB-EX1', 'Factures artiste', 'Certificat KCB'],
    note: 'Procédure standard. Délais respectés si dossier complet.',
    urgency: 'ok',
  },
  {
    country: 'Mali 🇲🇱',
    status: 'complex',
    authority: "Direction Nationale du Patrimoine Culturel",
    delay: '30–60 jours ouvrés',
    docs: ['Dossier complet en français', "Avis du Conseil d'Art", 'Preuve de provenance'],
    note: 'Processus complexe. Recommandation : prévoir 60 jours minimum.',
    urgency: 'danger',
  },
]

const INSURANCE = {
  totalValue: 85000,
  currency: 'EUR',
  coverage: 'All Risk (clou-à-clou)',
  provider: 'AXA Art (partenaire Kucibok)',
  rate: 0.4,
  premium: 340,
  period: '12 mois',
  conditions: [
    'Couverture porte-à-porte (studio → musée)',
    'Vol, dommages accidentels, catastrophes naturelles',
    'Couverture stockage temporaire incluse',
    "Expertise KCB pour l'évaluation",
    'Paiement sinistre sous 30 jours',
  ],
}

const TRACKING = [
  { id: 'KCB-SHIP-001', artworks: '3 œuvres (Kofi Mensah)', status: 'in_transit', location: 'Accra → Londres', eta: '22 mai 2025', progress: 60 },
  { id: 'KCB-SHIP-002', artworks: '5 œuvres (Aïcha Diallo)', status: 'customs', location: "Douanes Roissy CDG", eta: '25 mai 2025', progress: 80 },
  { id: 'KCB-SHIP-003', artworks: '4 œuvres (Amara Touré)', status: 'delivered', location: 'Tate Modern — Reçu', eta: 'Livré le 18 mai', progress: 100 },
]

const trackingStatus = {
  in_transit: { label: 'En transit', color: 'text-kcb-or', bg: 'bg-kcb-or/10' },
  customs: { label: 'En douane', color: 'text-amber-300', bg: 'bg-amber-300/10' },
  delivered: { label: 'Livré ✓', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
}

function ShippingTab() {
  return (
    <div className="space-y-4">
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
          <div>
            <p className="text-xs text-kcb-pierre mb-1">De</p>
            <div className="flex items-center gap-1.5 text-white"><MapPin className="w-3.5 h-3.5 text-kcb-or" /> Dakar, Sénégal</div>
          </div>
          <div>
            <p className="text-xs text-kcb-pierre mb-1">À</p>
            <div className="flex items-center gap-1.5 text-white"><MapPin className="w-3.5 h-3.5 text-[#9B4D96]" /> London, UK</div>
          </div>
          <div>
            <p className="text-xs text-kcb-pierre mb-1">Œuvres</p>
            <p className="text-white font-medium">12 caisses</p>
          </div>
          <div>
            <p className="text-xs text-kcb-pierre mb-1">Valeur assurée</p>
            <p className="text-kcb-or font-medium">€85 000</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {SHIPPING_QUOTES.map((q, i) => (
          <div
            key={i}
            className={`bg-kcb-ardoise border rounded-[4px] p-4 transition ${q.recommended ? 'border-kcb-or/40' : 'border-white/[0.06]'}`}
          >
            {q.recommended && (
              <span className="inline-block text-[10px] font-semibold uppercase tracking-wider bg-kcb-or/15 text-kcb-or px-2 py-0.5 rounded-full mb-3">
                ★ Recommandé Kucibok
              </span>
            )}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-sm font-semibold text-white">{q.provider}</h3>
                  {q.climate && (
                    <span className="text-[10px] bg-blue-500/15 text-blue-300 px-1.5 py-0.5 rounded-full border border-blue-500/20">Climatisé</span>
                  )}
                </div>
                <p className="text-xs text-kcb-pierre mb-3">{q.type}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span className="text-kcb-pierre">Transit :</span> <span className="text-white ml-1">{q.transit}</span></div>
                  <div><span className="text-kcb-pierre">Tracking :</span> <span className="text-white ml-1">{q.tracking}</span></div>
                  <div><span className="text-kcb-pierre">Assurance :</span> <span className="text-white ml-1">{q.insurance}</span></div>
                  <div>
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${q.status === 'available' ? 'bg-emerald-400/10 text-emerald-400' : 'bg-amber-400/10 text-amber-300'}`}>
                      {q.status === 'available' ? 'Disponible' : 'Devis en attente'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end gap-3">
                <div className="text-right">
                  <p className="text-2xl font-bold text-kcb-or">{q.price}</p>
                  <p className="text-xs text-kcb-pierre">{q.priceUnit}</p>
                </div>
                <button className={`text-xs px-4 py-2 rounded-[4px] font-medium transition ${q.recommended ? 'bg-kcb-or text-kcb-noir hover:bg-kcb-bronze' : 'bg-white/[0.06] text-white hover:bg-white/[0.1] border border-white/[0.06]'}`}>
                  {q.status === 'available' ? 'Sélectionner' : 'Demander devis'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function PermitsTab() {
  const [expanded, setExpanded] = useState(null)
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 p-3 bg-amber-500/5 border border-amber-500/20 rounded-[4px] text-sm text-amber-300">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <span>Vérifiez les délais : certains permis prennent jusqu'à 60 jours ouvrés.</span>
      </div>
      {PERMITS.map((p, i) => (
        <div key={i} className={`bg-kcb-ardoise border rounded-[4px] overflow-hidden ${p.urgency === 'danger' ? 'border-red-500/30' : p.urgency === 'warning' ? 'border-amber-500/30' : 'border-white/[0.06]'}`}>
          <button
            onClick={() => setExpanded(expanded === i ? null : i)}
            className="w-full flex items-center justify-between p-4 text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.urgency === 'danger' ? 'bg-red-400' : p.urgency === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div>
                <p className="text-sm font-semibold text-white">{p.country}</p>
                <p className="text-xs text-kcb-pierre">{p.authority}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.urgency === 'danger' ? 'bg-red-400/10 text-red-300' : p.urgency === 'warning' ? 'bg-amber-400/10 text-amber-300' : 'bg-emerald-400/10 text-emerald-400'}`}>
                {p.urgency === 'ok' ? 'OK' : p.urgency === 'warning' ? '⚠ À renouveler' : '⚠ Complexe'}
              </span>
              {expanded === i ? <ChevronDown className="w-4 h-4 text-kcb-pierre" /> : <ChevronRight className="w-4 h-4 text-kcb-pierre" />}
            </div>
          </button>
          <AnimatePresence>
            {expanded === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06]">
                  <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-kcb-pierre mb-1">Délai de traitement</p>
                      <p className="text-sm text-white">{p.delay}</p>
                    </div>
                    {p.renewed && (
                      <div>
                        <p className="text-xs text-kcb-pierre mb-1">Échéance</p>
                        <p className="text-sm text-amber-300">{p.renewed}</p>
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-kcb-pierre mb-2">Documents requis</p>
                    <ul className="space-y-1">
                      {p.docs.map((d, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-kcb-sable">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <p className="text-xs text-kcb-pierre bg-kcb-noir/40 rounded-[4px] p-2.5">{p.note}</p>
                  <button className="flex items-center gap-2 text-xs text-kcb-or hover:text-kcb-bronze transition">
                    <Download className="w-3.5 h-3.5" /> Télécharger le guide complet
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}

function InsuranceTab() {
  const ins = INSURANCE
  const premium = (ins.totalValue * ins.rate) / 100
  return (
    <div className="space-y-4">
      <div className="bg-kcb-ardoise border border-kcb-or/20 rounded-[4px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#9B4D96] uppercase tracking-wider mb-1">Partenaire officiel</p>
            <h3 className="text-lg font-semibold text-white">{ins.provider}</h3>
          </div>
          <Shield className="w-8 h-8 text-kcb-or" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
          {[
            { label: 'Valeur assurée', value: `€${ins.totalValue.toLocaleString()}` },
            { label: 'Type', value: ins.coverage },
            { label: 'Taux', value: `${ins.rate}%` },
            { label: 'Prime annuelle', value: `€${premium.toFixed(0)}` },
          ].map((s, i) => (
            <div key={i} className="bg-kcb-noir/40 rounded-[4px] p-3">
              <p className="text-xs text-kcb-pierre mb-1">{s.label}</p>
              <p className="text-sm font-semibold text-white">{s.value}</p>
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs text-kcb-pierre mb-2">Couverture incluse</p>
          <ul className="space-y-1.5">
            {ins.conditions.map((c, i) => (
              <li key={i} className="flex items-center gap-2 text-xs text-kcb-sable">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                {c}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex gap-3 mt-5">
          <button className="flex-1 py-2.5 bg-kcb-or text-kcb-noir text-sm font-semibold rounded-[4px] hover:bg-kcb-bronze transition">
            Souscrire — €{premium.toFixed(0)}/an
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/[0.06] text-white text-sm rounded-[4px] hover:bg-white/[0.1] border border-white/[0.06] transition">
            <ExternalLink className="w-3.5 h-3.5" /> Détails
          </button>
        </div>
      </div>

      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-kcb-or" />
          Simulateur de prime
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Valeur déclarée (€)</label>
            <input type="number" defaultValue="85000" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or" />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Type de couverture</label>
            <select className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or appearance-none">
              <option>All Risk clou-à-clou</option>
              <option>Transport uniquement</option>
              <option>Exposition uniquement</option>
            </select>
          </div>
        </div>
        <div className="mt-3 p-3 bg-kcb-or/5 border border-kcb-or/20 rounded-[4px] flex items-center justify-between">
          <span className="text-sm text-kcb-sable">Prime estimée</span>
          <span className="text-lg font-bold text-kcb-or">€340 / an</span>
        </div>
      </div>
    </div>
  )
}

function TrackingTab() {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-blue-500/5 border border-blue-500/20 rounded-[4px] text-sm text-blue-300">
        <Globe className="w-4 h-4 flex-shrink-0" />
        <span>3 expéditions actives · Données GPS mises à jour toutes les 2h</span>
      </div>
      {TRACKING.map((t, i) => {
        const sc = trackingStatus[t.status]
        return (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-jetbrains text-xs text-kcb-or">{t.id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>{sc.label}</span>
                </div>
                <p className="text-sm font-medium text-white">{t.artworks}</p>
                <p className="text-xs text-kcb-pierre flex items-center gap-1 mt-0.5">
                  <MapPin className="w-3 h-3" /> {t.location}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-kcb-pierre">ETA</p>
                <p className="text-sm text-white">{t.eta}</p>
              </div>
            </div>
            <div className="h-1.5 bg-white/[0.06] rounded-full">
              <div
                className="h-1.5 rounded-full transition-all duration-700"
                style={{ width: `${t.progress}%`, background: t.progress === 100 ? '#10B981' : 'linear-gradient(90deg, #9B4D96, #C9A84C)' }}
              />
            </div>
            <p className="text-xs text-kcb-pierre mt-1.5 text-right">{t.progress}%</p>
          </div>
        )
      })}
    </div>
  )
}

function CustomsTab() {
  const [value, setValue] = useState('85000')
  const [fromCountry, setFromCountry] = useState('Sénégal')
  const RATE_MAP = { 'Sénégal': 0, 'Ghana': 2.5, 'Mali': 0, "Côte d'Ivoire": 0 }
  const ukVat = 0
  const importDuty = RATE_MAP[fromCountry] ?? 5
  const calculated = {
    value: parseFloat(value) || 0,
    duty: ((parseFloat(value) || 0) * importDuty) / 100,
    vat: 0,
    handling: 320,
    total: ((parseFloat(value) || 0) * importDuty) / 100 + 320,
  }
  return (
    <div className="space-y-4">
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-kcb-or" />
          Calculateur droits d'importation — Royaume-Uni
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Valeur totale (€)</label>
            <input
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or"
            />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Pays d'origine</label>
            <select
              value={fromCountry}
              onChange={(e) => setFromCountry(e.target.value)}
              className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or appearance-none"
            >
              {Object.keys(RATE_MAP).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Destination</label>
            <div className="bg-kcb-noir border border-white/[0.06] text-kcb-pierre text-sm px-3 py-2 rounded-[4px]">Royaume-Uni (post-Brexit)</div>
          </div>
        </div>

        <div className="space-y-2">
          {[
            { label: "Valeur déclarée", value: `€${calculated.value.toLocaleString()}`, highlight: false },
            { label: `Droits d'import (${importDuty}% — code HS 9701)`, value: `€${calculated.duty.toLocaleString()}`, highlight: false },
            { label: 'TVA UK (œuvres d\'art — taux réduit 5%)', value: 'Exonéré (œuvre originale)', highlight: false },
            { label: 'Frais de dédouanement (estimation)', value: `€${calculated.handling}`, highlight: false },
          ].map((row, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
              <span className="text-sm text-kcb-pierre">{row.label}</span>
              <span className="text-sm text-white font-medium">{row.value}</span>
            </div>
          ))}
          <div className="flex justify-between items-center py-3 bg-kcb-or/5 rounded-[4px] px-3">
            <span className="text-sm font-semibold text-white">Total coût douane estimé</span>
            <span className="text-lg font-bold text-kcb-or">€{calculated.total.toLocaleString()}</span>
          </div>
        </div>

        <p className="text-xs text-kcb-pierre mt-3">
          * Estimation indicative. Les œuvres d'art originales importées au RU bénéficient généralement d'une franchise ou d'un taux réduit. Consultez un agent en douane agréé.
        </p>
      </div>

      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Codes HS courants — Art africain</h4>
        <div className="space-y-2">
          {[
            { code: '9701', desc: 'Peintures, dessins, pastels (originaux)', rate: '0% EU / 5% UK' },
            { code: '9702', desc: "Gravures, estampes, lithographies (originaux)", rate: '0%' },
            { code: '9703', desc: 'Sculptures et statues (originaux)', rate: '0%' },
            { code: '9705', desc: 'Collections et pièces pour collections', rate: '0%' },
          ].map((row, i) => (
            <div key={i} className="flex items-center justify-between bg-kcb-noir/30 rounded-[4px] px-3 py-2">
              <div>
                <span className="font-jetbrains text-xs text-kcb-or">{row.code}</span>
                <span className="text-xs text-kcb-sable ml-3">{row.desc}</span>
              </div>
              <span className="text-xs font-medium text-emerald-400">{row.rate}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export function LogisticsHub() {
  const [activeTab, setActiveTab] = useState('shipping')

  return (
    <div className="space-y-5 pb-8">
      <div>
        <h2 className="font-playfair text-xl text-white">Centre Logistique</h2>
        <p className="text-sm text-kcb-pierre mt-0.5">Transport, permis, assurance et douane — tout en un</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Expéditions actives', value: '3', icon: Truck, color: 'text-[#9B4D96]', bg: 'bg-[#9B4D96]/10' },
          { label: 'Permis requis', value: '3', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Œuvres en transit', value: '12', icon: Package, color: 'text-kcb-or', bg: 'bg-kcb-or/10' },
          { label: 'Coût total estimé', value: '€11k', icon: Calculator, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((s, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-kcb-pierre leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-1 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${
              activeTab === t.id
                ? 'bg-[#9B4D96]/20 text-[#c084d8] border border-[#9B4D96]/30'
                : 'text-kcb-pierre hover:text-white hover:bg-white/[0.04]'
            }`}
          >
            <t.icon className="w-3.5 h-3.5" />
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.15 }}
        >
          {activeTab === 'shipping' && <ShippingTab />}
          {activeTab === 'permits' && <PermitsTab />}
          {activeTab === 'insurance' && <InsuranceTab />}
          {activeTab === 'customs' && <CustomsTab />}
          {activeTab === 'tracking' && <TrackingTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
