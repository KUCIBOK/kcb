import { useState, useCallback } from "react"
import { Link } from "react-router-dom"
import { Clock, Mail, MapPin, Phone, ArrowRight, CheckCircle2, HelpCircle } from "lucide-react"

/** Contact info items shown in the left column. */
const CONTACT_INFO = [
  {
    icon: Mail,
    label: "Email",
    lines: ["contact@kucibok.com"],
  },
  {
    icon: Phone,
    label: "Téléphone",
    lines: ["+221 76 275 09 18", "+221 77 505 43 92"],
  },
  {
    icon: MapPin,
    label: "Adresse",
    lines: ["Institut Français", "89 rue Joseph Gomis, Dakar"],
  },
  {
    icon: Clock,
    label: "Horaires",
    lines: ["Lun–Ven : 8h – 17h", "Sam : 8h – 13h"],
  },
]

/** Subject options for the contact form dropdown. */
const SUBJECTS = [
  "Question générale",
  "Support technique",
  "Vente ou achat d'œuvre",
  "Certification d'une œuvre",
  "Partenariat",
  "Devenir artiste partenaire",
  "Presse & médias",
  "Autre",
]

/** Preview FAQ items. */
const FAQ_PREVIEW = [
  {
    question: "Quel est le délai moyen de réponse ?",
    answer: "Nous répondons généralement dans les 24 heures ouvrables.",
  },
  {
    question: "Puis-je visiter votre galerie physique ?",
    answer:
      "Oui, notre espace à l'Institut Français est ouvert au public du lundi au vendredi de 9h à 18h.",
  },
  {
    question: "Comment devenir artiste partenaire ?",
    answer:
      "Remplissez le formulaire de contact en précisant votre demande et nous vous enverrons notre processus de sélection.",
  },
]

const INITIAL_FORM = { name: "", email: "", subject: SUBJECTS[0], message: "" }

/**
 * Contact page — two-column layout with contact info and form.
 * Wrapped in Layout (main nav + footer provided by parent).
 *
 * @returns {JSX.Element}
 */
export default function Contact() {
  const [form, setForm]       = useState(INITIAL_FORM)
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  /** Update a single form field. */
  const handleChange = useCallback((e) => {
    const { id, value } = e.target
    setForm((prev) => ({ ...prev, [id]: value }))
  }, [])

  /**
   * Submit handler — shows success state (no actual API call required).
   *
   * @param {React.FormEvent<HTMLFormElement>} e
   */
  const handleSubmit = useCallback((e) => {
    e.preventDefault()
    setSending(true)
    // Simulate network delay — replace with real API call when backend is ready.
    setTimeout(() => {
      setSending(false)
      setSubmitted(true)
      setForm(INITIAL_FORM)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ── HEADER ── */}
      <div className="bg-gradient-to-br from-indigo-950/40 via-gray-900 to-gray-900 border-b border-gray-800 px-4 md:px-6 lg:px-8 py-14 text-center">
        <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-4">
          Parlons d'art ensemble
        </h1>
        <p className="text-gray-300 text-xl max-w-2xl mx-auto">
          Une question ? Un projet ? Notre équipe est là pour vous accompagner dans votre parcours artistique.
        </p>
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8 py-14">
        <div className="grid lg:grid-cols-5 gap-10">
          {/* ── LEFT COLUMN — Info + FAQ ── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact info */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-7">
              <h2 className="font-playfair text-2xl text-white font-semibold mb-6">
                Nos coordonnées
              </h2>
              <div className="space-y-5">
                {CONTACT_INFO.map(({ icon: Icon, label, lines }, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-indigo-900/40 border border-indigo-800/40 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-white text-sm font-medium">{label}</p>
                      {lines.map((line, j) => (
                        <p key={j} className="text-gray-400 text-sm">{line}</p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* FAQ Preview */}
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-7">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-playfair text-2xl text-white font-semibold">
                  Questions fréquentes
                </h2>
                <Link
                  to="/faq"
                  className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 text-sm transition"
                >
                  Voir toutes <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="space-y-4">
                {FAQ_PREVIEW.map((item, i) => (
                  <div key={i} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
                    <p className="text-white text-sm font-medium">{item.question}</p>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">{item.answer}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Help links */}
            <div className="bg-indigo-900/20 border border-indigo-800/40 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="w-5 h-5 text-indigo-400" />
                <h3 className="text-white font-semibold text-sm">Vous cherchez de l'aide ?</h3>
              </div>
              <div className="space-y-2">
                <Link
                  to="/faq"
                  className="flex items-center justify-between text-sm text-gray-300 hover:text-indigo-400 transition py-1 group"
                >
                  Centre d'aide & FAQ
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 transition" />
                </Link>
                <Link
                  to="/africa"
                  className="flex items-center justify-between text-sm text-gray-300 hover:text-amber-400 transition py-1 group"
                >
                  Portail Africa
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-amber-400 transition" />
                </Link>
                <Link
                  to="/global"
                  className="flex items-center justify-between text-sm text-gray-300 hover:text-indigo-400 transition py-1 group"
                >
                  Portail Global
                  <ArrowRight className="w-3.5 h-3.5 text-gray-600 group-hover:text-indigo-400 transition" />
                </Link>
              </div>
            </div>
          </div>

          {/* ── RIGHT COLUMN — Form ── */}
          <div className="lg:col-span-3">
            <div className="bg-gray-800/60 border border-gray-700 rounded-2xl p-7 lg:sticky lg:top-24">
              <h2 className="font-playfair text-2xl text-white font-semibold mb-2">
                Envoyez-nous un message
              </h2>
              <p className="text-gray-400 text-sm mb-8">
                Remplissez le formulaire ci-dessous et nous vous répondrons rapidement.
              </p>

              {submitted ? (
                <div className="flex flex-col items-center justify-center text-center gap-4 py-12">
                  <CheckCircle2 className="w-14 h-14 text-green-400" />
                  <h3 className="text-white font-semibold text-xl">Message envoyé !</h3>
                  <p className="text-gray-400 text-sm max-w-xs leading-relaxed">
                    Merci de nous avoir contactés. Notre équipe vous répondra dans les 24 heures ouvrables.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-2 text-indigo-400 hover:text-indigo-300 text-sm transition"
                  >
                    Envoyer un autre message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Nom complet
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="Votre nom"
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1.5">
                        Email
                      </label>
                      <input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="votre@email.com"
                        required
                        className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Sujet
                    </label>
                    <select
                      id="subject"
                      value={form.subject}
                      onChange={handleChange}
                      required
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition cursor-pointer"
                    >
                      {SUBJECTS.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1.5">
                      Message
                    </label>
                    <textarea
                      id="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Décrivez votre demande en détail…"
                      required
                      rows={6}
                      className="w-full bg-gray-900 border border-gray-700 rounded-lg px-4 py-3 text-sm text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 disabled:opacity-60 text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
                  >
                    {sending ? "Envoi en cours…" : "Envoyer le message"}
                    {!sending && <ArrowRight className="w-4 h-4" />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
