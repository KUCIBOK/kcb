import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Truck, Package, Shield, MapPin,
  Clock, Globe, CheckCircle, FileText, Plane, ChevronDown,
  ChevronUp, AlertCircle, Star
} from "lucide-react"

// ─── Shared GlobalHeader ─────────────────────────────────────────────────────

/**
 * Navigation principale du portail Global — sticky, thème indigo.
 *
 * @returns {JSX.Element}
 */
function GlobalHeader() {
  const [open, setOpen] = useState(false)

  const navLinks = [
    { label: "Global", to: "/global" },
    { label: "Services", to: "/global/services" },
    { label: "Logistique", to: "/global/logistics" },
    { label: "Entreprise", to: "/global/enterprise" },
  ]

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#23243a]/90 border-b border-indigo-900/30 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-7" />
          <span className="font-playfair text-white font-bold text-lg">
            Kucibok <span className="text-indigo-400 text-sm font-normal">Global</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-7 text-sm">
          {navLinks.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className="text-gray-300 hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link
            to="/sign-in"
            className="text-sm font-medium bg-gray-800 border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded-md text-white transition"
          >
            Connexion
          </Link>
          <Link
            to="/sign-up"
            className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 px-4 py-2 rounded-md text-white transition"
          >
            Inscription
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-3 border-t border-gray-800 pt-4 flex flex-col gap-4 pb-4 px-1">
          {navLinks.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-indigo-400 transition-colors font-medium text-sm"
            >
              {item.label}
            </Link>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-800">
            <Link
              to="/sign-in"
              onClick={() => setOpen(false)}
              className="text-sm font-medium bg-gray-800 border border-gray-700 px-4 py-2 rounded-md text-white text-center"
            >
              Connexion
            </Link>
            <Link
              to="/sign-up"
              onClick={() => setOpen(false)}
              className="text-sm font-medium bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-2 rounded-md text-white text-center"
            >
              Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Shared GlobalFooter ─────────────────────────────────────────────────────

/**
 * Pied de page du portail Global avec switcher vers le portail Africa.
 *
 * @returns {JSX.Element}
 */
function GlobalFooter() {
  return (
    <footer className="border-t border-gray-800 bg-[#0d0f14] py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-6" />
            <span className="font-playfair text-white font-bold">
              Kucibok <span className="text-indigo-400 text-sm font-normal">Global</span>
            </span>
          </Link>
          <Link
            to="/africa"
            className="flex items-center gap-2 text-sm text-amber-400 hover:text-amber-300 border border-amber-700/40 hover:border-amber-500/60 px-4 py-2 rounded-full transition"
          >
            <ArrowRight className="w-3.5 h-3.5" />
            Portail Africa
          </Link>
        </div>
        <div className="flex flex-wrap justify-center gap-6 mb-6 text-sm text-gray-500">
          <Link to="/about" className="hover:text-white transition">À propos</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/privacy-policy" className="hover:text-white transition">Confidentialité</Link>
          <Link to="/terms-and-conditions" className="hover:text-white transition">Conditions d'utilisation</Link>
        </div>
        <p className="text-center text-gray-600 text-sm">
          © {new Date().getFullYear()} Kucibok — Infrastructure digitale pour l'art africain et mondial
        </p>
      </div>
    </footer>
  )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const processSteps = [
  {
    number: "01",
    icon: FileText,
    title: "Évaluation & devis",
    desc: "Notre équipe logistique analyse les dimensions, la fragilité et la valeur de l'œuvre. Un devis personnalisé vous est remis sous 24h avec toutes les options disponibles.",
    detail: "Dimensionnement exact · Estimation de valeur · Choix du corridor de transport",
  },
  {
    number: "02",
    icon: Package,
    title: "Emballage muséal",
    desc: "Des professionnels certifiés préparent une caisse sur mesure avec contrôle climatique. Chaque couche de protection est documentée photo pour le dossier d'assurance.",
    detail: "Caisses sur mesure · Protection anti-choc · Contrôle hygrométrique",
  },
  {
    number: "03",
    icon: FileText,
    title: "Dédouanement",
    desc: "Kucibok génère automatiquement tous les documents nécessaires — certificat d'exportation, déclaration en douane, certificat CITES si requis. Nos agents douaniers gèrent les liaisons administratives.",
    detail: "Documents générés automatiquement · Agents douaniers partenaires · Conformité 190+ pays",
  },
  {
    number: "04",
    icon: Plane,
    title: "Transport sécurisé",
    desc: "Acheminement via nos partenaires certifiés IATA spécialisés dans le transport d'œuvres d'art. Suivi GPS en temps réel accessible depuis votre espace Kucibok.",
    detail: "Partenaires IATA certifiés · GPS en temps réel · Conditions climatiques contrôlées",
  },
  {
    number: "05",
    icon: CheckCircle,
    title: "Livraison & transfert",
    desc: "Rapport d'état à la livraison avec photos. Le certificat blockchain est automatiquement transféré au nouveau propriétaire dès confirmation de réception.",
    detail: "Rapport d'état photographique · Transfert blockchain instantané · Signature de réception",
  },
]

const coverageStats = [
  { value: "54", label: "Pays africains couverts", icon: MapPin, color: "text-amber-400" },
  { value: "190+", label: "Pays de livraison finale", icon: Globe, color: "text-indigo-400" },
  { value: "3–21 j", label: "Délais selon destination", icon: Clock, color: "text-blue-400" },
  { value: "100%", label: "Des œuvres assurées", icon: Shield, color: "text-green-400" },
  { value: "0", label: "Perte déclarée depuis 2024", icon: Star, color: "text-purple-400" },
]

const serviceCards = [
  {
    name: "Transport standard",
    icon: Truck,
    price: "À partir de €180",
    color: "border-gray-700",
    accent: "indigo",
    features: [
      "Emballage spécialisé anti-choc",
      "Suivi en ligne basique",
      "Assurance valeur de remplacement",
      "Délai 5–21 jours selon destination",
      "Dédouanement inclus",
    ],
    desc: "Idéal pour les œuvres de valeur standard nécessitant un transport soigné sans urgence particulière.",
  },
  {
    name: "Transport premium",
    icon: Package,
    price: "À partir de €490",
    color: "border-indigo-600",
    accent: "indigo",
    badge: "Recommandé",
    features: [
      "Caisse climatisée sur mesure",
      "Suivi GPS en temps réel 24/7",
      "Assurance valeur de marché (full value)",
      "Rapport photo à l'emballage et à la livraison",
      "Coursier dédié pour œuvres fragiles",
      "Délai 3–10 jours",
    ],
    desc: "Pour les œuvres de haute valeur ou fragiles. L'option recommandée par nos experts pour la majorité des transactions.",
  },
  {
    name: "Urgence / VIP",
    icon: Plane,
    price: "Sur devis prioritaire",
    color: "border-purple-700/60",
    accent: "purple",
    features: [
      "Express 48h disponible (Europe–Afrique)",
      "Accompagnement humain de bout en bout",
      "Certificat de dédouanement accéléré",
      "Assurance premium tous risques",
      "Notification en temps réel toutes les 2h",
      "Coordinateur logistique dédié",
    ],
    desc: "Pour les ventes aux enchères, expositions ou urgences. Réservez 48h à l'avance.",
  },
]

const partners = [
  "DHL Art", "FedEx Custom Critical", "Colis Privé", "Chronopost International",
  "Bolloré Logistics Africa", "SDV Transports", "AFRIJET", "Air Côte d'Ivoire Cargo"
]

const faqItems = [
  {
    q: "Quels sont les délais de livraison depuis l'Afrique vers l'Europe ?",
    a: "Entre 5 et 14 jours ouvrables pour un transport standard. Notre option premium garantit 3 à 7 jours. Pour les vols directs vers Paris, Londres ou Amsterdam, nous atteignons régulièrement 3 à 5 jours.",
  },
  {
    q: "Comment sont calculés les tarifs de transport ?",
    a: "Le prix dépend de plusieurs facteurs : dimensions et poids de l'emballage final, valeur déclarée de l'œuvre (impact sur l'assurance), pays d'origine et de destination, et niveau de service choisi (standard, premium ou VIP). Le devis est gratuit et remis sous 24h.",
  },
  {
    q: "Mon œuvre est-elle assurée pendant tout le transport ?",
    a: "Oui, systématiquement. Toutes les œuvres transportées via Kucibok sont assurées de la date d'emballage jusqu'à la signature de réception. La couverture est calculée sur la valeur de marché ou la valeur de vente, selon ce qui est le plus favorable au propriétaire.",
  },
  {
    q: "Comment se passe le dédouanement à l'export depuis l'Afrique ?",
    a: "Kucibok génère automatiquement tous les documents requis : certificat d'exportation culturelle, déclaration en douane, et si nécessaire, certificat CITES pour les œuvres contenant des matériaux protégés (ivoire, bois précieux, etc.). Nos agents douaniers partenaires gèrent les liaisons administratives dans 54 pays africains.",
  },
  {
    q: "Que se passe-t-il en cas de dommage pendant le transport ?",
    a: "En cas de sinistre, notre équipe déclenche la procédure d'indemnisation dans les 48h. Le rapport d'état photographique réalisé à l'emballage sert de preuve. Le paiement de l'indemnisation intervient sous 15 jours ouvrables après expertise confirmée.",
  },
  {
    q: "Puis-je suivre mon envoi en temps réel ?",
    a: "Oui, depuis votre tableau de bord Kucibok ou via la page de suivi publique accessible à tout moment. Pour les transports premium et VIP, le suivi GPS est mis à jour en continu. Vous recevez également des notifications automatiques à chaque étape clé du transit.",
  },
]

// ─── FAQ Component ─────────────────────────────────────────────────────────────

/**
 * Accordion FAQ logistique.
 *
 * @param {{ items: Array<{q: string, a: string}> }} props
 * @returns {JSX.Element}
 */
function FaqAccordion({ items }) {
  const [openIdx, setOpenIdx] = useState(null)

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="bg-[#13161e] border border-gray-800 rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            className="w-full flex items-center justify-between gap-4 px-6 py-4 text-left hover:bg-gray-800/30 transition"
          >
            <span className="text-white font-medium text-sm leading-snug">{item.q}</span>
            {openIdx === idx
              ? <ChevronUp className="w-4 h-4 text-indigo-400 shrink-0" />
              : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
            }
          </button>
          {openIdx === idx && (
            <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
              {item.a}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

/**
 * Page Logistique internationale du portail Global.
 * Route : /global/logistics
 * Standalone — header et footer inclus.
 *
 * @returns {JSX.Element}
 */
export default function GlobalLogistics() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      <GlobalHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0d0f14] to-blue-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 text-sm px-4 py-1.5 rounded-full font-medium">
              <Truck className="w-3.5 h-3.5" /> Logistique
            </span>
          </div>

          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Votre œuvre, livrée partout dans le monde{" "}
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">
              en toute sécurité
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Transport muséal spécialisé depuis l'Afrique et le monde entier. Emballage sur mesure,
            assurance tous risques, suivi GPS en temps réel.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Obtenir un devis <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tracking"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Suivre mon colis
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d0f14] to-transparent pointer-events-none" />
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Processus</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
            Comment fonctionne le transport Kucibok
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            De l'emballage à la livraison, chaque étape est gérée par des professionnels certifiés
            et documentée en temps réel.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[2.25rem] top-12 bottom-12 w-px bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent" />
          <div className="flex flex-col gap-6">
            {processSteps.map((step, idx) => (
              <div key={idx} className="flex gap-5">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-900/30 border border-indigo-700/50 flex items-center justify-center z-10 relative">
                    <step.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="bg-[#13161e] border border-gray-800 rounded-xl p-5 flex-1 hover:border-indigo-700/30 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{step.title}</h3>
                    <span className="text-2xl font-black text-gray-700 leading-none shrink-0 ml-3">{step.number}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mb-3">{step.desc}</p>
                  <p className="text-indigo-400/80 text-xs font-medium">{step.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COVERAGE STATS ── */}
      <section className="py-16 px-4 bg-gray-900/40 border-y border-gray-800">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="font-playfair text-2xl md:text-3xl text-white">
              Une couverture mondiale, ancrée en Afrique
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 text-center">
            {coverageStats.map((stat, idx) => (
              <div key={idx} className="flex flex-col items-center gap-2">
                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <p className={`text-2xl md:text-3xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-gray-400 text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE CARDS ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Niveaux de service</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
            Choisissez votre niveau de protection
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Trois offres calibrées selon la valeur, la fragilité et l'urgence de votre envoi.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {serviceCards.map((card, idx) => (
            <div key={idx} className={`bg-[#13161e] border-2 ${card.color} rounded-xl p-7 flex flex-col relative`}>
              {card.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  {card.badge}
                </div>
              )}
              <div className={`w-10 h-10 rounded-lg ${card.accent === "purple" ? "bg-purple-900/30" : "bg-indigo-900/30"} flex items-center justify-center mb-4`}>
                <card.icon className={`w-5 h-5 ${card.accent === "purple" ? "text-purple-400" : "text-indigo-400"}`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-1">{card.name}</h3>
              <p className={`text-sm font-semibold mb-3 ${card.accent === "purple" ? "text-purple-400" : "text-indigo-400"}`}>
                {card.price}
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-5">{card.desc}</p>
              <ul className="space-y-2.5 flex-1 mb-7">
                {card.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                    <CheckCircle className={`w-4 h-4 shrink-0 mt-0.5 ${card.accent === "purple" ? "text-purple-400" : "text-indigo-400"}`} />
                    {feat}
                  </li>
                ))}
              </ul>
              <Link
                to="/contact"
                className={`w-full text-center py-2.5 rounded-md text-sm font-semibold transition ${
                  card.accent === "purple"
                    ? "bg-purple-700 hover:bg-purple-600 text-white"
                    : idx === 1
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white"
                    : "bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white"
                }`}
              >
                Demander un devis
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTENAIRES ── */}
      <section className="py-16 px-4 bg-gray-900/40">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Partenaires logistiques</span>
          <h2 className="font-playfair text-2xl md:text-3xl text-white mt-2 mb-4">
            Un réseau de confiance, certifié IATA
          </h2>
          <p className="text-gray-400 text-sm mb-8 max-w-lg mx-auto">
            Nous travaillons exclusivement avec des opérateurs certifiés, spécialisés dans le transport
            d'œuvres culturelles et d'art de haute valeur.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            {partners.map((p, idx) => (
              <span
                key={idx}
                className="bg-[#13161e] border border-gray-800 text-gray-300 text-sm px-4 py-2 rounded-full font-medium hover:border-indigo-700/50 hover:text-indigo-300 transition"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">FAQ</span>
          <h2 className="font-playfair text-3xl text-white mt-2 mb-3">
            Questions fréquentes sur la logistique
          </h2>
          <p className="text-gray-400">
            Tout ce que vous devez savoir avant d'expédier votre première œuvre.
          </p>
        </div>

        <FaqAccordion items={faqItems} />

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm mb-3">
            Vous avez une question spécifique sur votre envoi ?
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 text-sm font-medium transition"
          >
            Contacter notre équipe logistique <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-950/40 via-[#0d0f14] to-blue-950/30">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl bg-indigo-900/30 border border-indigo-700/40 flex items-center justify-center mx-auto mb-6">
            <Truck className="w-7 h-7 text-indigo-400" />
          </div>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-4">
            Prêt à expédier votre œuvre ?
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Obtenez un devis logistique en 24h. Notre équipe est disponible du lundi au samedi,
            8h–20h (heure de Paris), pour vous accompagner sur chaque envoi.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Obtenir un devis logistique <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/tracking"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition flex items-center gap-2"
            >
              <MapPin className="w-4 h-4" /> Suivre un envoi
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  )
}
