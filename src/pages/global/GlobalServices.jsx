import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Globe, ShieldCheck, TrendingUp, Wallet,
  CreditCard, BarChart2, HeadphonesIcon, BookOpen, Users,
  Layers, Check, ChevronDown, ChevronUp, Zap, Package
} from "lucide-react"

// ─── Shared GlobalHeader ─────────────────────────────────────────────────────

/**
 * Navigation principale du portail Global — sticky, thème indigo.
 * Liens directs vers les sous-pages du portail (pas de scroll interne).
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

        {/* Desktop nav */}
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

      {/* Mobile menu */}
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

          {/* Portal switcher */}
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

const collectorFeatures = [
  { icon: ShieldCheck, label: "Achat sécurisé par escrow automatique", desc: "Les fonds sont bloqués jusqu'à réception confirmée de l'œuvre. Zéro risque de fraude." },
  { icon: Layers, label: "Certification de provenance blockchain", desc: "Chaque œuvre reçoit un certificat immuable. Historique complet, authenticité garantie à vie." },
  { icon: Package, label: "Assurance transport internationale", desc: "Couverture tous risques sur toute la chaîne logistique. Valeur assurée jusqu'à €500k par envoi." },
  { icon: BookOpen, label: "Portfolio digital de collection", desc: "Visualisez et gérez l'intégralité de votre collection en un seul tableau de bord." },
  { icon: TrendingUp, label: "Analytics valeur de collection", desc: "Suivez la valorisation de vos œuvres en temps réel avec les données de marché intégrées." },
  { icon: HeadphonesIcon, label: "Support expert 24/7", desc: "Une équipe de spécialistes de l'art à votre disposition pour chaque décision d'acquisition." },
]

const galleryFeatures = [
  { icon: Globe, label: "Catalogue en ligne certifié", desc: "Publiez votre catalogue avec certification blockchain intégrée. Chaque œuvre est vérifiable par QR code." },
  { icon: Zap, label: "Intégration API / widget", desc: "Intégrez Kucibok directement dans votre site existant via notre API REST ou widget embeddable." },
  { icon: CreditCard, label: "Ventes multi-devises", desc: "Encaissez en EUR, USD, XOF, GBP et plus. Conversion automatique, virements hebdomadaires." },
  { icon: BarChart2, label: "Dashboard analytics avancé", desc: "Vues en temps réel : ventes, performances des artistes, taux de conversion, origine des acheteurs." },
  { icon: Users, label: "Manager de compte dédié", desc: "Un expert Kucibok attitré à votre galerie pour onboarding, conseil et support prioritaire." },
  { icon: BookOpen, label: "Formations équipe", desc: "Accès aux formations certifiantes Kucibok : certification d'œuvres, logistique internationale, ventes en ligne." },
]

const galleryReach = [
  { stat: "100%", label: "Personnalisable", desc: "Votre identité visuelle, vos artistes, vos prix. Kucibok comme infrastructure invisible." },
  { stat: "Multi-artistes", label: "Gestion simplifiée", desc: "Gérez des dizaines d'artistes, commissions automatiques, reversements en un clic." },
  { stat: "50k+", label: "Collectionneurs actifs", desc: "Accédez directement à notre base de collectionneurs qualifiés répartis dans 60+ pays." },
  { stat: "Auto", label: "Export douanier", desc: "Documents douaniers générés automatiquement selon les réglementations de chaque pays de destination." },
]

const pricingTiers = [
  {
    name: "Basic",
    price: "Gratuit",
    period: "",
    desc: "Pour les collectionneurs individuels",
    color: "border-gray-700",
    badge: null,
    features: [
      "Portfolio digital illimité",
      "Achat sécurisé par escrow",
      "Certificats blockchain inclus",
      "Suivi de colis en temps réel",
      "Support email",
    ],
    cta: "Créer un compte gratuit",
    ctaTo: "/sign-up",
    ctaStyle: "bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white",
  },
  {
    name: "Gallery",
    price: "€299",
    period: "/ mois",
    desc: "Pour les galeries et marchands d'art",
    color: "border-indigo-600",
    badge: "Le plus populaire",
    features: [
      "Catalogue en ligne certifié (illimité)",
      "Dashboard analytics avancé",
      "Ventes multi-devises (EUR, USD, XOF, GBP)",
      "API et widget intégrables",
      "Jusqu'à 10 utilisateurs",
      "Manager de compte dédié",
      "Formations équipe incluses",
      "Support prioritaire 24/7",
    ],
    cta: "Démarrer l'essai 30 jours",
    ctaTo: "/sign-up",
    ctaStyle: "bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white",
  },
  {
    name: "Enterprise",
    price: "Sur devis",
    period: "",
    desc: "Pour hôtels, fondations et institutions",
    color: "border-purple-700/60",
    badge: null,
    features: [
      "White-label (votre marque)",
      "API complète + webhooks",
      "Utilisateurs illimités",
      "Intégration ERP/CRM",
      "SLA personnalisé (99,9% uptime)",
      "Rapports PDF automatisés",
      "Formation et certification équipe",
      "Manager de compte senior dédié",
    ],
    cta: "Contacter l'équipe Enterprise",
    ctaTo: "/contact",
    ctaStyle: "bg-purple-700 hover:bg-purple-600 text-white",
  },
]

const integrations = [
  "Stripe", "PayPal", "PayDunya", "Mailchimp", "Zapier", "HubSpot",
  "Salesforce", "Google Analytics", "Shopify", "WooCommerce", "Notion", "Slack"
]

// ─── Main Page ─────────────────────────────────────────────────────────────────

/**
 * Page Services Premium du portail Global.
 * Route : /global/services
 * Standalone — header et footer inclus.
 *
 * @returns {JSX.Element}
 */
export default function GlobalServices() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      <GlobalHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-[#0d0f14] to-purple-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 text-sm px-4 py-1.5 rounded-full font-medium">
              <Globe className="w-3.5 h-3.5" /> Services
            </span>
          </div>

          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Des services premium pour les{" "}
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">
              professionnels de l'art
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            De la certification blockchain à la logistique internationale — Kucibok offre une infrastructure
            complète pour le marché de l'art mondial.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="#pricing"
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Voir les tarifs <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/contact"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition"
            >
              Nous contacter
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d0f14] to-transparent pointer-events-none" />
      </section>

      {/* ── SERVICES COLLECTIONNEURS ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="mb-12">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Pour les collectionneurs</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
            Achetez en toute confiance
          </h2>
          <p className="text-gray-400 max-w-xl">
            De l'authentification à la livraison, chaque étape de votre acquisition est protégée et certifiée.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {collectorFeatures.map((feat, idx) => (
            <div
              key={idx}
              className="bg-[#13161e] border border-gray-800 hover:border-indigo-700/40 rounded-xl p-6 transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-indigo-900/30 flex items-center justify-center mb-4">
                <feat.icon className="w-5 h-5 text-indigo-400" />
              </div>
              <h3 className="text-white font-semibold mb-2 text-sm leading-snug">{feat.label}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── SERVICES GALERIES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="mb-12">
            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Pour les galeries</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
              Vendez à l'échelle mondiale
            </h2>
            <p className="text-gray-400 max-w-xl">
              Kucibok devient l'extension digitale de votre galerie — catalogue certifié, paiements multi-devises, analytics de pointe.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {galleryFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#13161e] border border-gray-800 hover:border-purple-700/40 rounded-xl p-6 transition-colors"
              >
                <div className="w-10 h-10 rounded-lg bg-purple-900/20 flex items-center justify-center mb-4">
                  <feat.icon className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-white font-semibold mb-2 text-sm leading-snug">{feat.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── GALERIES INTERNATIONALES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Galeries internationales</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-5">
              Votre vitrine mondiale,<br />
              <span className="text-indigo-400">clé en main</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Kucibok s'adapte à votre identité de galerie. Votre catalogue, vos artistes, vos prix — présentés
              sur une infrastructure certifiée et reconnue par les collectionneurs du monde entier.
            </p>
            <div className="space-y-3">
              {[
                "Votre marque en premier plan — Kucibok reste discret en infrastructure",
                "Gestion multi-artistes avec commissions automatisées",
                "Accès direct à 50k+ collectionneurs actifs qualifiés",
                "Documents douaniers générés automatiquement par destination",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-8 flex gap-4">
              <Link
                to="/sign-up"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold rounded-md transition flex items-center gap-2"
              >
                Ouvrir ma galerie <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/contact"
                className="px-5 py-2.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white text-sm rounded-md transition"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {galleryReach.map((item, idx) => (
              <div key={idx} className="bg-[#13161e] border border-gray-800 rounded-xl p-5">
                <p className="text-2xl font-bold text-indigo-400 mb-1">{item.stat}</p>
                <p className="text-white text-sm font-semibold mb-1">{item.label}</p>
                <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Tarifs</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
              Un plan pour chaque ambition
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              De l'accès gratuit au collecteur individuel jusqu'aux solutions Enterprise white-label —
              choisissez le niveau d'infrastructure qui correspond à vos objectifs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-[#13161e] border-2 ${tier.color} rounded-xl p-7 flex flex-col relative`}
              >
                {tier.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full whitespace-nowrap">
                    {tier.badge}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-white font-bold text-lg mb-1">{tier.name}</h3>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-bold text-indigo-400">{tier.price}</span>
                    {tier.period && <span className="text-gray-400 text-sm">{tier.period}</span>}
                  </div>
                  <p className="text-gray-400 text-sm">{tier.desc}</p>
                </div>

                <ul className="space-y-2.5 flex-1 mb-7">
                  {tier.features.map((feat, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                      <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                      {feat}
                    </li>
                  ))}
                </ul>

                <Link
                  to={tier.ctaTo}
                  className={`w-full text-center py-2.5 rounded-md text-sm font-semibold transition ${tier.ctaStyle}`}
                >
                  {tier.cta}
                </Link>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-8">
            Tous les plans incluent la certification blockchain. Aucun frais de mise en place.{" "}
            <Link to="/contact" className="text-indigo-400 hover:text-indigo-300 underline">
              Questions sur les tarifs ?
            </Link>
          </p>
        </div>
      </section>

      {/* ── INTEGRATIONS ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Intégrations</span>
          <h2 className="font-playfair text-3xl text-white mt-2 mb-3">
            Compatible avec votre infrastructure
          </h2>
          <p className="text-gray-400 max-w-lg mx-auto">
            Kucibok s'intègre nativement avec les outils que vous utilisez déjà — paiements, CRM, marketing et automatisation.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {integrations.map((tool, idx) => (
            <span
              key={idx}
              className="bg-[#13161e] border border-gray-800 text-gray-300 text-sm px-4 py-2 rounded-full font-medium hover:border-indigo-700/50 hover:text-indigo-300 transition"
            >
              {tool}
            </span>
          ))}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Et bien plus via notre API REST et webhooks.{" "}
          <Link to="/contact" className="text-indigo-400 hover:text-indigo-300">
            Voir la documentation API →
          </Link>
        </p>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gradient-to-br from-indigo-950/40 via-[#0d0f14] to-purple-950/30">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-3xl md:text-4xl text-white mb-4">
            Démarrer avec{" "}
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">
              Kucibok Global
            </span>
          </h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            Rejoignez les galeries, collectionneurs et institutions qui font confiance à Kucibok
            pour gérer, certifier et distribuer l'art à l'échelle mondiale.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="px-7 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Créer un compte <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition"
            >
              Parler à un expert
            </Link>
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  )
}
