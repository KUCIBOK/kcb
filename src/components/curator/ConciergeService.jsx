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
  User,
  Globe,
  Phone,
  FileText,
} from 'lucide-react'

const SERVICES = [
  {
    id: 'virtual-visit',
    icon: Video,
    title: 'Visite studio virtuelle',
    subtitle: 'Rencontrez l\'artiste en vidéo, visitez son atelier',
    duration: '60 min',
    priceFrom: 200,
    priceTo: 500,
    currency: '€',
    deliverables: [
      'Appel vidéo HD (Zoom/Meet)',
      'Visite guidée de l\'atelier',
      'Présentation de 5-10 œuvres',
      'Questions/réponses avec l\'artiste',
      'Rapport de visite Kucibok',
    ],
    turnaround: '5–7 jours',
    badge: 'Populaire',
    color: '#9B4D96',
  },
  {
    id: 'physical-visit',
    icon: MapPin,
    title: 'Visite studio physique',
    subtitle: 'Un agent Kucibok vous représente sur place',
    duration: '½ journée',
    priceFrom: 500,
    priceTo: 1500,
    currency: '€',
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
  },
  {
    id: 'due-diligence',
    icon: Shield,
    title: 'Due diligence artiste',
    subtitle: 'Vérification complète d\'identité et d\'authenticité',
    duration: '3–5 jours',
    priceFrom: 300,
    priceTo: 800,
    currency: '€',
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
  },
  {
    id: 'logistics',
    icon: Truck,
    title: 'Coordination logistique',
    subtitle: 'Gestion complète du transport et des formalités',
    duration: 'Variable',
    priceFrom: null,
    priceTo: null,
    currency: '€',
    percent: '5–10% de la valeur',
    deliverables: [
      'Sélection et coordination transporteurs',
      'Obtention permis d\'export',
      'Gestion formalités douanières',
      'Coordination assurance',
      'Suivi livraison end-to-end',
      'Installation coordination',
    ],
    turnaround: 'Selon planning',
    badge: 'Tout inclus',
    color: '#9B4D96',
  },
]

const ACTIVE_BOOKINGS = [
  {
    id: 'KCB-CONC-001',
    service: 'Visite studio virtuelle',
    artist: 'Aïcha Diallo',
    country: 'Dakar, Sénégal 🇸🇳',
    date: '20 mai 2025 — 14h00 CET',
    status: 'confirmed',
    price: '€350',
    agent: 'Moussa Diop (Agent Kucibok)',
    link: 'https://meet.google.com/...',
  },
  {
    id: 'KCB-CONC-002',
    service: 'Due diligence',
    artist: 'Kofi Mensah',
    country: 'Accra, Ghana 🇬🇭',
    date: '2 jours restants',
    status: 'in_progress',
    price: '€500',
    agent: 'Kwame Asante (Agent Kucibok)',
    progress: 65,
  },
  {
    id: 'KCB-CONC-003',
    service: 'Coordination logistique',
    artist: '12 œuvres — Dakar → London',
    country: 'Multi-pays',
    date: 'Planifié — juin 2025',
    status: 'pending',
    price: '€6 800',
    agent: 'En affectation',
  },
]

const statusConfig = {
  confirmed: { label: 'Confirmé', color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' },
  in_progress: { label: 'En cours', color: 'text-kcb-or', bg: 'bg-kcb-or/10', dot: 'bg-kcb-or' },
  pending: { label: 'En attente', color: 'text-kcb-pierre', bg: 'bg-white/[0.06]', dot: 'bg-kcb-pierre' },
  completed: { label: 'Terminé', color: 'text-[#9B4D96]', bg: 'bg-[#9B4D96]/10', dot: 'bg-[#9B4D96]' },
}

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
            </div>
            <button onClick={onClose} className="text-kcb-pierre hover:text-white p-1">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-6">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= s ? 'bg-[#9B4D96] text-white' : 'bg-white/[0.06] text-kcb-pierre'}`}>
                  {s}
                </div>
                {s < 3 && <div className={`flex-1 h-px w-8 ${step > s ? 'bg-[#9B4D96]' : 'bg-white/[0.06]'}`} />}
              </div>
            ))}
            <span className="ml-2 text-xs text-kcb-pierre">
              {step === 1 ? 'Artiste' : step === 2 ? 'Date' : 'Confirmation'}
            </span>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Artiste concerné</label>
                <select
                  value={artist}
                  onChange={(e) => setArtist(e.target.value)}
                  className="w-full bg-kcb-noir border border-white/[0.08] text-white text-sm px-3 py-2.5 rounded-[4px] focus:outline-none focus:border-[#9B4D96]/50 appearance-none"
                >
                  <option value="">Sélectionner un artiste...</option>
                  <option>Aïcha Diallo — Dakar, Sénégal</option>
                  <option>Kofi Mensah — Accra, Ghana</option>
                  <option>Amara Touré — Bamako, Mali</option>
                  <option>Mariama Balde — Abidjan, CI</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-kcb-pierre block mb-1.5">Message (objectifs de la visite)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Décrivez vos objectifs pour cette visite..."
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
              <div className="p-3 bg-kcb-noir/40 rounded-[4px] text-xs text-kcb-pierre">
                <p className="flex items-center gap-1.5 mb-1"><Clock className="w-3.5 h-3.5" /> Délai de confirmation : 24–48h</p>
                <p className="flex items-center gap-1.5"><Globe className="w-3.5 h-3.5" /> Fuseau horaire de l'artiste : WAT (UTC+1)</p>
              </div>
              <div className="flex items-center justify-between p-3 bg-kcb-or/5 border border-kcb-or/20 rounded-[4px]">
                <span className="text-sm text-kcb-sable">Prix estimé</span>
                <span className="text-lg font-bold text-kcb-or">
                  {service.percent ?? `${service.currency}${service.priceFrom} – ${service.currency}${service.priceTo}`}
                </span>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-kcb-noir/40 rounded-[4px] space-y-2 text-sm">
                {[
                  { label: 'Service', value: service.title },
                  { label: 'Artiste', value: artist || '—' },
                  { label: 'Date', value: date || '—' },
                  { label: 'Prix', value: service.percent ?? `${service.currency}${service.priceFrom} – ${service.currency}${service.priceTo}` },
                ].map((row, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-kcb-pierre">{row.label}</span>
                    <span className="text-white font-medium">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-[4px] flex items-start gap-2 text-xs text-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>Un agent Kucibok vous contactera dans les 24h pour confirmer et coordonner la prestation.</span>
              </div>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 1 && (
              <button onClick={() => setStep(step - 1)} className="flex-1 py-2.5 text-sm text-kcb-pierre bg-white/[0.04] border border-white/[0.06] rounded-[4px] hover:bg-white/[0.08] transition">
                Retour
              </button>
            )}
            <button
              onClick={() => step < 3 ? setStep(step + 1) : onClose()}
              className="flex-1 py-2.5 text-sm font-semibold rounded-[4px] transition"
              style={{ background: '#9B4D96', color: 'white' }}
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
    <div className="space-y-6 pb-8">
      <div>
        <h2 className="font-playfair text-xl text-white">Services Concierge</h2>
        <p className="text-sm text-kcb-pierre mt-0.5">
          Des agents Kucibok certifiés vous représentent sur le terrain en Afrique
        </p>
      </div>

      {/* Active bookings */}
      {ACTIVE_BOOKINGS.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Clock className="w-4 h-4 text-kcb-or" />
            Missions en cours
          </h3>
          {ACTIVE_BOOKINGS.map((b, i) => {
            const sc = statusConfig[b.status]
            return (
              <div key={i} className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-4">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-jetbrains text-xs text-kcb-or">{b.id}</span>
                      <span className={`flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${sc.bg} ${sc.color}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                        {sc.label}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-white">{b.service}</p>
                    <p className="text-xs text-kcb-pierre">{b.artist} · {b.country}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-kcb-or">{b.price}</p>
                    <p className="text-xs text-kcb-pierre">{b.date}</p>
                  </div>
                </div>
                {b.progress !== undefined && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-white/[0.06] rounded-full">
                      <div className="h-1.5 rounded-full bg-kcb-or" style={{ width: `${b.progress}%` }} />
                    </div>
                    <p className="text-xs text-kcb-pierre mt-1">{b.progress}% complété</p>
                  </div>
                )}
                {b.agent && (
                  <p className="text-xs text-kcb-pierre mt-2 flex items-center gap-1">
                    <User className="w-3 h-3" /> {b.agent}
                  </p>
                )}
                {b.link && (
                  <a href={b.link} className="mt-2 inline-flex items-center gap-1 text-xs text-[#9B4D96] hover:text-[#c084d8] transition">
                    <Video className="w-3 h-3" /> Rejoindre la réunion
                  </a>
                )}
              </div>
            )
          })}
        </div>
      )}

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
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: `${service.color}20` }}>
                    <service.icon className="w-5 h-5" style={{ color: service.color }} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
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
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3 text-xs text-kcb-pierre">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {service.duration}</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {service.turnaround}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold" style={{ color: service.color }}>
                    {service.percent ?? `${service.currency}${service.priceFrom} – ${service.currency}${service.priceTo}`}
                  </p>
                </div>
              </div>

              <ul className="space-y-1 mb-4">
                {service.deliverables.slice(0, 3).map((d, i) => (
                  <li key={i} className="flex items-center gap-1.5 text-xs text-kcb-pierre">
                    <CheckCircle className="w-3 h-3 text-emerald-400 flex-shrink-0" />
                    {d}
                  </li>
                ))}
                {service.deliverables.length > 3 && (
                  <li className="text-xs text-kcb-pierre pl-4.5">+ {service.deliverables.length - 3} autres livrables</li>
                )}
              </ul>

              <button
                onClick={() => setBooking(service)}
                className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-[4px] transition"
                style={{ background: `${service.color}20`, color: service.color, border: `1px solid ${service.color}30` }}
                onMouseEnter={(e) => { e.currentTarget.style.background = `${service.color}35` }}
                onMouseLeave={(e) => { e.currentTarget.style.background = `${service.color}20` }}
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
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          {[
            { step: '01', label: 'Sélectionnez', desc: 'Choisissez votre service et l\'artiste concerné' },
            { step: '02', label: 'Confirmation', desc: 'Un agent Kucibok vous contacte sous 24h' },
            { step: '03', label: 'Exécution', desc: 'L\'agent réalise la prestation sur le terrain' },
            { step: '04', label: 'Rapport', desc: 'Vous recevez un rapport complet avec livrables' },
          ].map((s, i) => (
            <div key={i} className="text-center">
              <div className="w-8 h-8 rounded-full bg-[#9B4D96]/15 text-[#9B4D96] font-bold text-xs flex items-center justify-center mx-auto mb-2">
                {s.step}
              </div>
              <p className="text-xs font-semibold text-white mb-1">{s.label}</p>
              <p className="text-xs text-kcb-pierre leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Booking modal */}
      <AnimatePresence>
        {booking && <BookingModal service={booking} onClose={() => setBooking(null)} />}
      </AnimatePresence>
    </div>
  )
}
