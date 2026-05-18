import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Star,
  Calendar,
  Clock,
  CheckCircle,
  Video,
  MapPin,
  Shield,
  Truck,
  ChevronRight,
  X,
  Globe,
  AlertCircle,
  FileText,
} from 'lucide-react'
import { PlanGate } from '../shared/PlanGate'
import { PLAN_PREMIUM } from '../../utils/planUtils'

const SERVICES = [
  {
    id: 'virtual-visit',
    icon: Video,
    title: 'Visite studio virtuelle',
    subtitle: "Rencontrez l'artiste en vidéo, visitez son atelier",
    duration: '60 min',
    deliverables: [
      'Appel vidéo HD (Zoom/Meet)',
      "Visite guidée de l'atelier",
      'Présentation de 5–10 œuvres',
      "Questions/réponses avec l'artiste",
      'Rapport de visite Kucibok',
    ],
    turnaround: '5–7 jours',
    badge: 'Populaire',
    color: '#9B4D96',
    quota: '1/mois',
  },
  {
    id: 'physical-visit',
    icon: MapPin,
    title: 'Visite studio physique',
    subtitle: 'Un agent Kucibok vous représente sur place',
    duration: '½ journée',
    deliverables: [
      'Agent Kucibok certifié sur place',
      'Visite complète atelier/studio',
      'Photos HD (100+ clichés)',
      'Vidéo de présentation (15 min)',
      'Rapport complet + recommandations',
      'Évaluation condition des œuvres',
    ],
    turnaround: '10–15 jours',
    badge: 'Premium',
    color: '#C9A84C',
    quota: '1/mois',
  },
  {
    id: 'due-diligence',
    icon: Shield,
    title: 'Due diligence artiste',
    subtitle: "Vérification complète d'identité et d'authenticité",
    duration: '3–5 jours',
    deliverables: [
      'Vérification identité (ID gouvernemental)',
      'Validation portfolio (100% œuvres)',
      'Recherche provenance',
      'Contrôle expositions (vérifiées)',
      'Check réputation communauté artistique',
      'Rapport KCB-DD (10+ pages)',
    ],
    turnaround: '3–5 jours ouvrés',
    badge: null,
    color: '#10B981',
    quota: 'Illimité',
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Coordination logistique',
    subtitle: 'Gestion complète du transport et des formalités',
    duration: 'Variable',
    deliverables: [
      "Coordination Logidoo (prestataire exclusif)",
      "Obtention permis d'export",
      'Gestion formalités douanières',
      'Coordination assurance',
      'Suivi livraison end-to-end',
      'Installation coordination',
    ],
    turnaround: 'Selon planning',
    badge: 'Tout inclus',
    color: '#9B4D96',
    quota: 'Illimité',
  },
]

function BookingModal({ service, onClose }) {
  const [step, setStep] = useState(1)
  const [artist, setArtist] = useState('')
  const [date, setDate] = useState('')
  const [message, setMessage] = useState('')

  if (!service) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-lg bg-kcb-ardoise border border-white/[0.08] rounded-[4px] shadow-2xl"
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <p className="text-xs text-[#9B4D96] uppercase tracking-wider mb-1">Réservation Concierge</p>
              <h3 className="font-playfair text-lg text-white">{service.title}</h3>
              <p className="text-xs text-emerald-400 mt-0.5">Inclus dans votre plan Premium</p>
            </div>
            <button onClick={onClose} className="text-kcb-pierre hover:text-white p-1"><X className="w-5 h-5" /></button>
          </div>

          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-[#9B4D96] text-white' : 'bg-white/[0.06] text-kcb-pierre'}`}>{s}</div>
                {s < 3 && <div className={`flex-1 h-px w-8 ${step > s ? 'bg-[#9B4D96]' : 'bg-white/[0.06]'}`} />}
              </div>
            ))}
            <span className="ml-2 text-xs text-kcb-pierre">{step === 1 ? 'Artiste' : step === 2 ? 'Date' : 'Confirmation'}</span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Nom de l'artiste concerné</label>
                <input
                  type="text"
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  placeholder="Ex : Aïcha Diallo — Dakar, Sénégal"
                  className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 placeholder-kcb-pierre"
                />
              </div>
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Objectifs de la mission</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Décrivez vos objectifs..."
                  className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 placeholder-kcb-pierre resize-none"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Date souhaitée</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50"
                />
              </div>
              <div className="p-3 bg-kcb-noir/40 rounded-[4px] text-xs text-kcb-pierre space-y-1">
                <p className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> Délai de confirmation : 24–48h</p>
                <p className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Fuseau horaire de l'artiste : WAT (UTC+1)</p>
              </div>
              <div className="flex items-center gap-2 p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-[4px]">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-emerald-300">Service inclus — Plan Premium</p>
                  <p className="text-xs text-kcb-pierre">Quota : {service.quota} · Aucun frais supplémentaire</p>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-kcb-noir/40 rounded-[4px] space-y-2 text-sm">
                {[
                  { label: 'Service', value: service.title },
                  { label: 'Artiste', value: artist || '—' },
                  { label: 'Date souhaitée', value: date || '—' },
                  { label: 'Inclus dans', value: 'Plan Premium' },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-kcb-pierre">{row.label}</span>
                    <span className={`font-medium ${row.label === 'Inclus dans' ? 'text-emerald-400' : 'text-white'}`}>{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-[4px] flex items-start gap-2 text-xs text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                Un agent Kucibok vous contactera dans les 24h pour confirmer et coordonner la prestation.
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 py-2.5 text-sm text-kcb-pierre bg-white/[0.04] border border-white/[0.06] rounded-[4px] hover:bg-white/[0.08] transition">Retour</button>
            )}
            <button
              onClick={() => step < 3 ? setStep(step + 1) : onClose()}
              className="flex-1 py-2.5 text-sm font-semibold rounded-[4px] transition text-white"
              style={{ background: '#9B4D96' }}
            >
              {step < 3 ? 'Continuer' : 'Envoyer la demande'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export function ConciergeService() {
  const [booking, setBooking] = useState(null)

  return (
    <PlanGate
      minLevel={PLAN_PREMIUM}
      feature="Services Concierge"
      description="Agents Kucibok certifiés sur le terrain, visites studio, due diligence artiste — inclus dans le plan Premium."
    >
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="font-playfair text-xl text-white">Services Concierge</h2>
        <p className="text-sm text-kcb-pierre mt-0.5">
          Des agents Kucibok certifiés vous représentent sur le terrain en Afrique
        </p>
      </div>

      {/* Plan inclusion banner */}
      <div className="flex items-start gap-3 px-4 py-3 bg-emerald-500/5 border border-emerald-500/20 rounded-[4px] text-sm">
        <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-300 font-medium">Services inclus dans le plan Premium (€67/mois)</p>
          <p className="text-xs text-kcb-pierre mt-0.5">Aucun frais supplémentaire — réservez directement ci-dessous.</p>
        </div>
      </div>

      {/* No active missions */}
      <div className="flex items-center gap-3 px-4 py-3 bg-kcb-ardoise border border-white/[0.06] rounded-[4px] text-sm text-kcb-pierre">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        Aucune mission en cours. Réservez un service ci-dessous pour démarrer.
      </div>

      {/* Service catalog */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <Star className="w-4 h-4 text-kcb-or" />
          Catalogue de services
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service) => (
            <motion.div
              key={service.id}
              whileHover={{ scale: 1.01 }}
              className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5 hover:border-white/10 transition-all"
            >
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${service.color}20` }}>
                  <service.icon className="w-5 h-5" style={{ color: service.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-semibold text-white">{service.title}</h3>
                    {service.badge && (
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full" style={{ background: `${service.color}20`, color: service.color }}>
                        {service.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-kcb-pierre">{service.subtitle}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs text-kcb-pierre">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {service.turnaround}</span>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 border border-emerald-400/20 px-2 py-0.5 rounded-full">
                  {service.quota}
                </span>
              </div>

              <ul className="space-y-1 mb-4">
                {service.deliverables.slice(0, 3).map((d, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-kcb-pierre">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {d}
                  </li>
                ))}
                {service.deliverables.length > 3 && (
                  <li className="text-xs text-kcb-pierre pl-4">+ {service.deliverables.length - 3} autres livrables</li>
                )}
              </ul>

              <button
                onClick={() => setBooking(service)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-[4px] transition border"
                style={{ background: `${service.color}20`, color: service.color, borderColor: `${service.color}30` }}
              >
                Réserver ce service <ChevronRight className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it works */}
      <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-5">
        <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
          <FileText className="w-4 h-4 text-kcb-or" />
          Comment ça fonctionne
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { step: '01', label: 'Sélectionnez', desc: "Choisissez votre service et l'artiste concerné" },
            { step: '02', label: 'Confirmation', desc: 'Un agent Kucibok vous contacte sous 24h' },
            { step: '03', label: 'Exécution', desc: "L'agent réalise la prestation sur le terrain" },
            { step: '04', label: 'Rapport', desc: 'Vous recevez un rapport complet avec livrables' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 rounded-full bg-[#9B4D96]/15 text-[#9B4D96] font-bold text-xs flex items-center justify-center mx-auto mb-2">{s.step}</div>
              <p className="text-xs font-semibold text-white mb-1">{s.label}</p>
              <p className="text-xs text-kcb-pierre leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {booking && <BookingModal service={booking} onClose={() => setBooking(null)} />}
      </AnimatePresence>
    </div>
    </PlanGate>
  )
}
