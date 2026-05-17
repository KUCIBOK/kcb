import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Truck,
  Package,
  Shield,
  FileText,
  CheckCircle,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Download,
  Calculator,
  MapPin,
  Plus,
  Loader2,
} from 'lucide-react'
import { useLogistics } from '../../hooks/useLogistics'

const TABS = [
  { id: 'shipping', label: 'Devis transport', icon: Truck },
  { id: 'permits', label: "Permis d'export", icon: FileText },
  { id: 'insurance', label: 'Assurance', icon: Shield },
  { id: 'customs', label: 'Droits de douane', icon: Calculator },
]

const PERMITS = [
  {
    country: 'Sénégal 🇸🇳',
    authority: 'Ministère de la Culture — DCPA',
    delay: '15–30 jours ouvrés',
    docs: ['Lettre de prêt signée', 'Inventaire œuvres (KCB-XXXXX)', 'Accord de retour', 'Photos des œuvres'],
    note: "Permis requis pour les œuvres de plus de 30 ans ou considérées 'patrimoine national'.",
    urgency: 'warning',
  },
  {
    country: 'Ghana 🇬🇭',
    authority: 'Ghana Museums & Monuments Board',
    delay: '10–20 jours ouvrés',
    docs: ['Formulaire GMMB-EX1', 'Factures artiste', 'Certificat KCB'],
    note: 'Procédure standard. Délais respectés si dossier complet.',
    urgency: 'ok',
  },
  {
    country: 'Mali 🇲🇱',
    authority: 'Direction Nationale du Patrimoine Culturel',
    delay: '30–60 jours ouvrés',
    docs: ['Dossier complet en français', "Avis du Conseil d'Art", 'Preuve de provenance'],
    note: 'Processus complexe. Recommandation : prévoir 60 jours minimum.',
    urgency: 'danger',
  },
  {
    country: "Côte d'Ivoire 🇨🇮",
    authority: 'Ministère de la Culture et de la Francophonie',
    delay: '10–20 jours ouvrés',
    docs: ['Lettre de prêt', 'Inventaire certifié', 'Contrat de transport'],
    note: 'Procédure standard. Coordonner avec la galerie partenaire sur place.',
    urgency: 'ok',
  },
  {
    country: 'Nigeria 🇳🇬',
    authority: 'National Commission for Museums and Monuments',
    delay: '20–45 jours ouvrés',
    docs: ['Formulaire NCMM', 'Certificat expert', 'Preuve achat légal', 'Assurance'],
    note: 'Vérifier que les œuvres ne sont pas classées patrimoine national.',
    urgency: 'warning',
  },
]

function ShippingTab() {
  const { getShippingRates, createExpedition, loading } = useLogistics()
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [pieces, setPieces] = useState('')
  const [value, setValue] = useState('')
  const [rates, setRates] = useState(null)
  const [rateError, setRateError] = useState('')
  const [booked, setBooked] = useState(false)
  const [bookLoading, setBookLoading] = useState(false)

  const handleGetRates = async () => {
    if (!from || !to) return
    setRateError('')
    setRates(null)
    try {
      const data = await getShippingRates(from, to, { pieces: Number(pieces) || 1, declaredValue: Number(value) || 0 })
      setRates(data)
    } catch {
      setRateError("Impossible d'obtenir les tarifs Logidoo. Vérifiez vos informations et réessayez.")
    }
  }

  const handleBook = async () => {
    setBookLoading(true)
    try {
      await createExpedition({ origin: from, destination: to, pieces: Number(pieces) || 1, declaredValue: Number(value) || 0 })
      setBooked(true)
    } catch {
      setRateError("Impossible de créer l'expédition. Contactez votre coordinateur Kucibok.")
    } finally {
      setBookLoading(false)
    }
  }

  const reset = () => { setFrom(''); setTo(''); setPieces(''); setValue(''); setRates(null); setRateError(''); setBooked(false) }

  if (booked) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4 border border-dashed border-emerald-500/30 rounded-[4px] bg-emerald-500/5">
        <CheckCircle className="w-10 h-10 text-emerald-400" />
        <div className="text-center">
          <p className="text-sm font-semibold text-white mb-1">Expédition Logidoo créée</p>
          <p className="text-xs text-kcb-pierre max-w-xs">Vous recevrez un numéro de suivi par email. Votre coordinateur Kucibok vous contactera sous 24h.</p>
        </div>
        <button onClick={reset} className="text-xs text-kcb-or underline hover:text-kcb-bronze">Nouvelle demande</button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-[#9B4D96]/10 border border-[#9B4D96]/25 rounded-[4px] text-xs text-[#c084d8]">
        <Truck className="w-4 h-4 flex-shrink-0" />
        Logidoo est le prestataire logistique exclusif Kucibok — spécialiste du transport d'art Afrique Ouest ↔ Europe.
      </div>

      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5 space-y-4">
        <h4 className="text-sm font-semibold text-white">Obtenir un devis Logidoo</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-kcb-pierre block mb-1.5">Ville de départ</label>
            <input type="text" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Ex : Dakar, Sénégal" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 placeholder-kcb-pierre" />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1.5">Ville d'arrivée</label>
            <input type="text" value={to} onChange={(e) => setTo(e.target.value)} placeholder="Ex : London, UK" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 placeholder-kcb-pierre" />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1.5">Nombre de caisses / œuvres</label>
            <input type="number" value={pieces} onChange={(e) => setPieces(e.target.value)} placeholder="Ex : 12" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 placeholder-kcb-pierre" />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1.5">Valeur totale déclarée (€)</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ex : 85000" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 placeholder-kcb-pierre" />
          </div>
        </div>
        {rateError && <p className="text-xs text-red-400">{rateError}</p>}
        <button
          onClick={handleGetRates}
          disabled={!from || !to || loading}
          className="w-full py-2.5 text-sm font-semibold rounded-[4px] transition disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-white"
          style={{ background: '#9B4D96' }}
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          {loading ? 'Interrogation Logidoo…' : 'Obtenir les tarifs'}
        </button>
      </div>

      {rates && (
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5 space-y-3">
          <h4 className="text-sm font-semibold text-white mb-1">Tarifs Logidoo — {from} → {to}</h4>
          {Array.isArray(rates.rates) && rates.rates.length > 0 ? (
            rates.rates.map((r, i) => (
              <div key={i} className="flex items-center justify-between bg-kcb-noir/40 rounded-[4px] px-3 py-2.5">
                <div>
                  <p className="text-sm font-medium text-white">{r.service ?? r.name ?? `Option ${i + 1}`}</p>
                  <p className="text-xs text-kcb-pierre">{r.transit_days ? `Délai estimé : ${r.transit_days} jours` : ''}</p>
                </div>
                <span className="text-sm font-bold text-kcb-or">{r.currency ?? '€'}{r.price ?? r.amount ?? '—'}</span>
              </div>
            ))
          ) : (
            <p className="text-xs text-kcb-pierre">Aucun tarif disponible pour cette route. Contactez votre coordinateur Kucibok.</p>
          )}
          {Array.isArray(rates.rates) && rates.rates.length > 0 && (
            <button
              onClick={handleBook}
              disabled={bookLoading}
              className="w-full py-2.5 text-sm font-semibold rounded-[4px] transition disabled:opacity-40 flex items-center justify-center gap-2 bg-emerald-600 text-white hover:bg-emerald-500"
            >
              {bookLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              {bookLoading ? 'Création en cours…' : 'Confirmer l\'expédition Logidoo'}
            </button>
          )}
        </div>
      )}

      <div className="bg-kcb-ardoise border border-[#9B4D96]/20 rounded-[4px] p-4">
        <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#9B4D96]" />
          Logidoo — Partenaire logistique exclusif Kucibok
        </h4>
        <div className="space-y-1.5">
          {[
            'Spécialiste transport d\'art Afrique Ouest ↔ Europe',
            'Suivi GPS en temps réel, notifications proactives',
            'Emballage aux normes conservation muséale',
            'Gestion douane & formalités d\'export intégrée',
            'Couverture assurance art sur demande',
          ].map((f, i) => (
            <p key={i} className="flex items-center gap-2 text-xs text-kcb-pierre">
              <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />{f}
            </p>
          ))}
        </div>
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
        Vérifiez les délais : certains permis prennent jusqu'à 60 jours ouvrés. Anticipez bien à l'avance.
      </div>
      {PERMITS.map((p, i) => (
        <div key={i} className={`bg-kcb-ardoise border rounded-[4px] overflow-hidden ${p.urgency === 'danger' ? 'border-red-500/30' : p.urgency === 'warning' ? 'border-amber-500/30' : 'border-white/[0.06]'}`}>
          <button onClick={() => setExpanded(expanded === i ? null : i)} className="w-full flex items-center justify-between p-4 text-left">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${p.urgency === 'danger' ? 'bg-red-400' : p.urgency === 'warning' ? 'bg-amber-400' : 'bg-emerald-400'}`} />
              <div>
                <p className="text-sm font-semibold text-white">{p.country}</p>
                <p className="text-xs text-kcb-pierre">{p.authority}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs px-2 py-0.5 rounded-full ${p.urgency === 'danger' ? 'bg-red-400/10 text-red-300' : p.urgency === 'warning' ? 'bg-amber-400/10 text-amber-300' : 'bg-emerald-400/10 text-emerald-400'}`}>
                {p.urgency === 'ok' ? 'Standard' : p.urgency === 'warning' ? '⚠ Attention' : '⚠ Complexe'}
              </span>
              {expanded === i ? <ChevronDown className="w-4 h-4 text-kcb-pierre" /> : <ChevronRight className="w-4 h-4 text-kcb-pierre" />}
            </div>
          </button>
          <AnimatePresence>
            {expanded === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                <div className="px-4 pb-4 space-y-3 border-t border-white/[0.06]">
                  <div className="pt-3">
                    <p className="text-xs text-kcb-pierre mb-1">Délai de traitement</p>
                    <p className="text-sm text-white">{p.delay}</p>
                  </div>
                  <div>
                    <p className="text-xs text-kcb-pierre mb-2">Documents requis</p>
                    <ul className="space-y-1">
                      {p.docs.map((d, j) => (
                        <li key={j} className="flex items-center gap-2 text-xs text-kcb-sable">
                          <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />{d}
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
  const [value, setValue] = useState('')
  const rate = 0.4
  const premium = value ? ((Number(value) * rate) / 100).toFixed(0) : null

  return (
    <div className="space-y-4">
      <div className="bg-kcb-ardoise border border-kcb-or/20 rounded-[4px] p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-xs text-[#9B4D96] uppercase tracking-wider mb-1">Partenaire officiel Kucibok</p>
            <h3 className="text-lg font-semibold text-white">AXA Art</h3>
          </div>
          <Shield className="w-8 h-8 text-kcb-or" />
        </div>
        <div className="space-y-1.5 mb-4">
          {[
            'Couverture All Risk porte-à-porte (clou-à-clou)',
            'Vol, dommages accidentels, catastrophes naturelles',
            'Stockage temporaire inclus',
            "Expertise KCB pour l'évaluation",
            'Paiement sinistre sous 30 jours',
          ].map((c, i) => (
            <li key={i} className="flex items-center gap-2 text-xs text-kcb-sable list-none">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />{c}
            </li>
          ))}
        </div>
        <button className="w-full py-2.5 bg-kcb-or text-kcb-noir text-sm font-semibold rounded-[4px] hover:bg-kcb-bronze transition">
          Demander un devis AXA Art
        </button>
      </div>

      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Calculator className="w-4 h-4 text-kcb-or" />
          Simulateur de prime
        </h4>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Valeur déclarée des œuvres (€)</label>
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ex : 85000" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre" />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Type de couverture</label>
            <select className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none appearance-none">
              <option>All Risk clou-à-clou (0,40%)</option>
              <option>Transport uniquement (0,20%)</option>
              <option>Exposition uniquement (0,25%)</option>
            </select>
          </div>
          {premium && (
            <div className="mt-3 p-3 bg-kcb-or/5 border border-kcb-or/20 rounded-[4px] flex items-center justify-between">
              <span className="text-sm text-kcb-sable">Prime estimée / an</span>
              <span className="text-lg font-bold text-kcb-or">€{premium}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function CustomsTab() {
  const [value, setValue] = useState('')
  const [fromCountry, setFromCountry] = useState('Sénégal')
  const RATE_MAP = { 'Sénégal': 0, 'Ghana': 2.5, 'Mali': 0, "Côte d'Ivoire": 0, 'Nigeria': 5 }
  const importDuty = RATE_MAP[fromCountry] ?? 5
  const baseValue = parseFloat(value) || 0
  const duty = (baseValue * importDuty) / 100
  const handling = baseValue > 0 ? 320 : 0
  const total = duty + handling

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
            <input type="number" value={value} onChange={(e) => setValue(e.target.value)} placeholder="Ex : 85000" className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none focus:border-kcb-or placeholder-kcb-pierre" />
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Pays d'origine</label>
            <select value={fromCountry} onChange={(e) => setFromCountry(e.target.value)} className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2 rounded-[4px] focus:outline-none appearance-none">
              {Object.keys(RATE_MAP).map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-kcb-pierre block mb-1">Destination</label>
            <div className="bg-kcb-noir border border-white/[0.06] text-kcb-pierre text-sm px-3 py-2 rounded-[4px]">Royaume-Uni</div>
          </div>
        </div>

        {baseValue > 0 && (
          <div className="space-y-2">
            {[
              { label: 'Valeur déclarée', value: `€${baseValue.toLocaleString()}` },
              { label: `Droits d'import (${importDuty}% — code HS 9701)`, value: `€${duty.toLocaleString()}` },
              { label: "TVA UK (œuvres d'art)", value: 'Exonéré (originale)' },
              { label: 'Frais de dédouanement (estimation)', value: `€${handling}` },
            ].map((row, i) => (
              <div key={i} className="flex justify-between items-center py-2 border-b border-white/[0.04]">
                <span className="text-sm text-kcb-pierre">{row.label}</span>
                <span className="text-sm text-white font-medium">{row.value}</span>
              </div>
            ))}
            <div className="flex justify-between items-center py-3 bg-kcb-or/5 rounded-[4px] px-3 mt-2">
              <span className="text-sm font-semibold text-white">Total coût douane estimé</span>
              <span className="text-lg font-bold text-kcb-or">€{total.toLocaleString()}</span>
            </div>
          </div>
        )}
        <p className="text-xs text-kcb-pierre mt-3">* Estimation indicative. Consultez un agent en douane agréé pour confirmation.</p>
      </div>

      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
        <h4 className="text-sm font-semibold text-white mb-3">Codes HS courants — Art africain</h4>
        <div className="space-y-2">
          {[
            { code: '9701', desc: 'Peintures, dessins, pastels (originaux)', rate: '0% EU / 5% UK' },
            { code: '9702', desc: 'Gravures, estampes, lithographies (originaux)', rate: '0%' },
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

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Pays couverts', value: '12', icon: MapPin, color: 'text-[#9B4D96]', bg: 'bg-[#9B4D96]/10' },
          { label: 'Pays avec permis requis', value: '5', icon: FileText, color: 'text-amber-400', bg: 'bg-amber-400/10' },
          { label: 'Prestataire logistique', value: 'Logidoo', icon: Package, color: 'text-kcb-or', bg: 'bg-kcb-or/10' },
          { label: 'Assureur partenaire', value: 'AXA Art', icon: Shield, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
        ].map((s, i) => (
          <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4 flex items-center gap-3">
            <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${s.bg}`}>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <div>
              <p className="text-lg font-bold text-white">{s.value}</p>
              <p className="text-xs text-kcb-pierre leading-tight">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-1 overflow-x-auto">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-[4px] text-xs font-medium whitespace-nowrap transition flex-shrink-0 ${activeTab === t.id ? 'bg-[#9B4D96]/20 text-[#c084d8] border border-[#9B4D96]/30' : 'text-kcb-pierre hover:text-white hover:bg-white/[0.04]'}`}
          >
            <t.icon className="w-3.5 h-3.5" />{t.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.15 }}>
          {activeTab === 'shipping' && <ShippingTab />}
          {activeTab === 'permits' && <PermitsTab />}
          {activeTab === 'insurance' && <InsuranceTab />}
          {activeTab === 'customs' && <CustomsTab />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
