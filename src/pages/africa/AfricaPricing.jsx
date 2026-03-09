import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Check, ChevronDown, ChevronUp,
  Globe, Zap, Building2, Star, ShieldCheck, Headphones,
  Camera, BarChart3, Infinity as InfinityIcon
} from "lucide-react"

// ─── Shared nav links ─────────────────────────────────────────────
const NAV_LINKS = [
  { label: "Africa", to: "/africa" },
  { label: "Fonctionnalités", to: "/africa/features" },
  { label: "Tarifs", to: "/africa/pricing" },
  { label: "Artistes", to: "/africa/artists" },
  { label: "Galeries", to: "/africa/galleries" },
]

// ─── Africa Header ────────────────────────────────────────────────
function AfricaHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/90 border-b border-amber-900/30 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/africa" className="flex items-center gap-2 shrink-0">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-7" />
          <span className="font-playfair text-white font-bold text-lg">
            Kucibok <span className="text-amber-400 text-sm font-normal">Africa</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
            >
              {link.label}
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
            className="text-sm font-medium bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-md transition"
          >
            Inscription
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden mt-3 border-t border-gray-800 pt-4 flex flex-col gap-3 pb-4 px-2">
          {NAV_LINKS.map(link => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setOpen(false)}
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium text-sm"
            >
              {link.label}
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
              className="text-sm font-medium bg-amber-500 text-gray-900 font-semibold px-4 py-2 rounded-md text-center"
            >
              Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Africa Footer ────────────────────────────────────────────────
function AfricaFooter() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-10">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-6" />
              <span className="font-playfair text-white font-bold">
                Kucibok <span className="text-amber-400 text-sm font-normal">Africa</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              L'infrastructure digitale de l'art africain. Certification, logistique et marché mondial.
            </p>
            <div className="mt-4">
              <Link
                to="/global"
                className="inline-flex items-center gap-2 text-xs text-gray-500 border border-gray-700 hover:border-amber-700/50 hover:text-amber-400 px-3 py-1.5 rounded-full transition"
              >
                <Globe className="w-3.5 h-3.5" />
                Passer au Portail Global →
              </Link>
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Portail Africa</p>
            <div className="flex flex-col gap-2">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to} className="text-gray-500 hover:text-amber-400 text-sm transition">
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider mb-3">Légal</p>
            <div className="flex flex-col gap-2">
              <Link to="/privacy-policy" className="text-gray-500 hover:text-white text-sm transition">Confidentialité</Link>
              <Link to="/terms-and-conditions" className="text-gray-500 hover:text-white text-sm transition">CGU</Link>
              <Link to="/contact" className="text-gray-500 hover:text-white text-sm transition">Contact</Link>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 pt-6 text-center text-gray-600 text-xs">
          © {new Date().getFullYear()} Kucibok — Art africain certifié blockchain
        </div>
      </div>
    </footer>
  )
}

// ─── Pricing data ─────────────────────────────────────────────────
const plans = [
  {
    name: "Gratuit",
    price: "0",
    currency: "FCFA",
    period: "/mois",
    subtitle: "Pour démarrer et explorer la plateforme",
    icon: Zap,
    popular: false,
    cta: "Commencer gratuitement",
    ctaTo: "/sign-up",
    features: [
      { label: "Profil artiste public", included: true },
      { label: "3 œuvres publiées", included: true },
      { label: "Certification de base", included: true },
      { label: "Accès au marketplace", included: true },
      { label: "Support communautaire", included: true },
      { label: "Standard KCB complet (NFC + blockchain)", included: false },
      { label: "Œuvres illimitées", included: false },
      { label: "Logistique internationale", included: false },
      { label: "Analytics détaillées", included: false },
      { label: "Numérisation 3D", included: false },
    ],
    accent: "border-gray-700",
    badge: null,
  },
  {
    name: "Professionnel",
    price: "15 000",
    currency: "FCFA",
    period: "/mois",
    subtitle: "Pour les artistes sérieux et les professionnels",
    icon: Star,
    popular: true,
    cta: "Choisir ce plan",
    ctaTo: "/sign-up",
    features: [
      { label: "Profil vérifié Premium (badge)", included: true },
      { label: "Œuvres illimitées", included: true },
      { label: "Standard KCB complet (NFC + blockchain)", included: true },
      { label: "Accès au marketplace", included: true },
      { label: "Logistique internationale incluse", included: true },
      { label: "Analytics détaillées (vues, favoris, revenus)", included: true },
      { label: "Support prioritaire (24h)", included: true },
      { label: "1 numérisation 3D offerte/mois", included: true },
      { label: "Export PDF certificats", included: true },
      { label: "API d'intégration", included: false },
    ],
    accent: "border-amber-500",
    badge: "Le plus populaire",
  },
  {
    name: "Galerie / Entreprise",
    price: "Sur devis",
    currency: "",
    period: "",
    subtitle: "Pour les galeries, institutions et partenaires B2B",
    icon: Building2,
    popular: false,
    cta: "Nous contacter",
    ctaTo: "/contact",
    features: [
      { label: "Tout du plan Professionnel", included: true },
      { label: "Catalogue B2B certifié", included: true },
      { label: "API d'intégration complète", included: true },
      { label: "Manager de compte dédié", included: true },
      { label: "Formations équipe (présentiel ou visio)", included: true },
      { label: "SLA personnalisé (uptime garanti)", included: true },
      { label: "Export douane et assurance", included: true },
      { label: "Multi-artistes (dashboard centralisé)", included: true },
      { label: "Numérisations 3D illimitées", included: true },
      { label: "Intégration site web (widget)", included: true },
    ],
    accent: "border-gray-700",
    badge: null,
  },
]

// ─── FAQ data ─────────────────────────────────────────────────────
const faqs = [
  {
    question: "Est-ce que je peux annuler à tout moment ?",
    answer: "Oui, absolument. Il n'y a pas d'engagement minimum. Vous pouvez annuler votre abonnement à n'importe quel moment depuis votre dashboard. Vous conservez l'accès aux fonctionnalités payantes jusqu'à la fin de la période en cours."
  },
  {
    question: "Comment fonctionne la commission sur les ventes ?",
    answer: "Kucibok prend une commission de 8% sur chaque vente réalisée via la plateforme (plan Gratuit) ou 5% (plan Professionnel). Il n'y a aucun frais de mise en ligne. Vous ne payez que lorsque vous vendez."
  },
  {
    question: "Quels pays sont couverts pour la logistique ?",
    answer: "Notre réseau logistique couvre actuellement 18 pays d'Afrique de l'Ouest, Centrale et de l'Est, ainsi que les principales destinations en Europe (France, Belgique, Suisse, UK), aux États-Unis et en Asie du Golfe. La liste s'étend chaque trimestre."
  },
  {
    question: "Le plan Gratuit est-il vraiment gratuit pour toujours ?",
    answer: "Oui. Le plan Gratuit est sans limite de durée. Vous pouvez créer votre profil, publier 3 œuvres et accéder au marketplace sans jamais payer. Vous passez au plan Professionnel uniquement si vous souhaitez accéder aux fonctionnalités avancées."
  },
  {
    question: "Comment fonctionne la numérisation 3D offerte ?",
    answer: "Avec le plan Professionnel, vous bénéficiez d'un crédit de numérisation 3D par mois. Apportez votre œuvre dans l'un de nos points partenaires (Dakar, Abidjan, Accra, Bamako, Cotonou) ou organisez une visite à domicile pour les pièces volumineuses."
  },
  {
    question: "Puis-je migrer mes œuvres existantes vers Kucibok ?",
    answer: "Oui. Si vous avez déjà un catalogue d'œuvres (photos, descriptions, estimations), notre équipe vous accompagne dans la migration et la certification. Le plan Galerie / Entreprise inclut un service de migration complet."
  },
]

// ─── FAQ Item ────────────────────────────────────────────────────
function FaqItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border border-gray-800 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-800/30 transition-colors"
      >
        <span className="text-white font-medium text-sm pr-4">{question}</span>
        {open
          ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
          : <ChevronDown className="w-4 h-4 text-gray-500 shrink-0" />
        }
      </button>
      {open && (
        <div className="px-6 pb-5 text-gray-400 text-sm leading-relaxed border-t border-gray-800 pt-4">
          {answer}
        </div>
      )}
    </div>
  )
}

// ─── Page principale ──────────────────────────────────────────────
/**
 * Page des tarifs Kucibok Africa.
 * Route : /africa/pricing
 *
 * @returns {JSX.Element}
 */
export default function AfricaPricing() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AfricaHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-950 pointer-events-none" />
        <div className="relative max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium mb-6">
            <ShieldCheck className="w-3.5 h-3.5" />
            Tarifs transparents
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-5 leading-tight">
            Choisissez votre plan
          </h1>
          <p className="text-gray-300 text-xl max-w-xl mx-auto leading-relaxed">
            Pas de frais cachés. Payez au résultat.
          </p>
          <p className="text-gray-500 text-sm mt-3">
            Tous les prix sont en FCFA (Franc CFA d'Afrique de l'Ouest). Facturation mensuelle ou annuelle.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>

      {/* ── PRICING CARDS ── */}
      <section className="py-4 pb-24 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {plans.map((plan, idx) => (
            <div
              key={idx}
              className={`relative bg-[#13161e] border-2 rounded-2xl p-7 flex flex-col transition-all ${
                plan.popular
                  ? "border-amber-500 shadow-[0_0_40px_rgba(245,158,11,0.12)]"
                  : "border-gray-800 hover:border-gray-700"
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-amber-500 text-gray-900 text-xs font-bold px-4 py-1 rounded-full">
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="mb-6">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${plan.popular ? "bg-amber-500/20" : "bg-gray-800"}`}>
                    <plan.icon className={`w-4.5 h-4.5 ${plan.popular ? "text-amber-400" : "text-gray-400"} w-[18px] h-[18px]`} />
                  </div>
                  <h3 className="text-white font-semibold">{plan.name}</h3>
                </div>

                <div className="flex items-end gap-1.5 mb-1">
                  {plan.currency === "" ? (
                    <span className="font-playfair text-3xl font-bold text-white">{plan.price}</span>
                  ) : (
                    <>
                      <span className="font-playfair text-4xl font-bold text-white">{plan.price}</span>
                      <span className="text-gray-400 text-sm mb-1.5">{plan.currency}{plan.period}</span>
                    </>
                  )}
                </div>
                <p className="text-gray-500 text-sm">{plan.subtitle}</p>
              </div>

              {/* Features */}
              <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                {plan.features.map((feature, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5 text-sm">
                    {feature.included ? (
                      <Check className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                    ) : (
                      <X className="w-4 h-4 text-gray-700 shrink-0 mt-0.5" />
                    )}
                    <span className={feature.included ? "text-gray-300" : "text-gray-600"}>
                      {feature.label}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to={plan.ctaTo}
                className={`w-full text-center py-3 rounded-lg font-semibold text-sm transition ${
                  plan.popular
                    ? "bg-amber-500 hover:bg-amber-400 text-gray-900"
                    : "bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>

        {/* Trust badges */}
        <div className="mt-10 flex flex-wrap justify-center gap-6 text-sm text-gray-500">
          {[
            { icon: ShieldCheck, label: "Paiement sécurisé via PayDunya & carte" },
            { icon: InfinityIcon, label: "Sans engagement — annulez à tout moment" },
            { icon: Headphones, label: "Support dédié en français" },
            { icon: BarChart3, label: "Remise annuelle de 20%" },
          ].map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <badge.icon className="w-4 h-4 text-amber-500" />
              <span>{badge.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── COMMISSION EXPLAINER ── */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-4xl mx-auto text-center">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Transparent</span>
          <h2 className="font-playfair text-3xl text-white mt-2 mb-8">Comment fonctionne notre commission</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                plan: "Gratuit",
                commission: "8%",
                detail: "de commission sur chaque vente réalisée via la plateforme",
                sub: "Aucun frais de mise en ligne"
              },
              {
                plan: "Professionnel",
                commission: "5%",
                detail: "de commission seulement — vous gardez plus de vos revenus",
                sub: "Logistique incluse dans le plan"
              },
              {
                plan: "Galerie / Entreprise",
                commission: "Négociable",
                detail: "taux préférentiel selon volume et partenariat",
                sub: "SLA et conditions personnalisés"
              },
            ].map((item, i) => (
              <div key={i} className="bg-[#13161e] border border-gray-800 rounded-xl p-6">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wider mb-2">{item.plan}</p>
                <p className="font-playfair text-4xl font-bold text-amber-400 mb-2">{item.commission}</p>
                <p className="text-gray-400 text-sm leading-relaxed mb-2">{item.detail}</p>
                <p className="text-gray-600 text-xs">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">FAQ</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Questions fréquentes</h2>
          <p className="text-gray-400">
            Tout ce que vous devez savoir sur nos tarifs et notre fonctionnement.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {faqs.map((faq, idx) => (
            <FaqItem key={idx} question={faq.question} answer={faq.answer} />
          ))}
        </div>
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Vous n'avez pas trouvé votre réponse ?{" "}
            <Link to="/contact" className="text-amber-400 hover:text-amber-300 underline transition">
              Contactez-nous
            </Link>
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gray-800/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Commencez gratuitement<br />
            <span className="text-amber-400">dès aujourd'hui</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Aucune carte bancaire requise pour le plan Gratuit. Passez au Professionnel quand vous êtes prêt.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              Créer un compte gratuit <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/africa/features"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition"
            >
              Voir les fonctionnalités
            </Link>
          </div>
        </div>
      </section>

      <AfricaFooter />
    </div>
  )
}
