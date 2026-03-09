import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Globe, ShieldCheck, Truck, BadgeCheck,
  Upload, Award, LayoutDashboard, BarChart3, ShoppingBag,
  Star, Quote, Check, ChevronRight, UserPlus, Camera
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

// ─── Data ─────────────────────────────────────────────────────────
const painPoints = [
  {
    problem: "Authenticité difficile à prouver",
    solution: "Certificat blockchain immuable",
    problemDetail: "Les acheteurs doutent, les galeries demandent des preuves que vous n'avez pas toujours.",
    solutionDetail: "Chaque œuvre reçoit un NFT de provenance — incontestable, scannable, reconnu partout.",
    icon: ShieldCheck,
    color: "green",
  },
  {
    problem: "Marché limité à votre région",
    solution: "Connecté à 50+ pays",
    problemDetail: "Votre talent mérite mieux que le marché local. Les collectionneurs internationaux ne vous trouvent pas.",
    solutionDetail: "Votre profil et vos œuvres sont visibles par des collectionneurs en Europe, en Asie et en Amérique.",
    icon: Globe,
    color: "blue",
  },
  {
    problem: "Logistique internationale complexe",
    solution: "Transport muséal clé en main",
    problemDetail: "Douanes, emballage, assurance, suivi — gérer tout ça seul est un cauchemar.",
    solutionDetail: "Kucibok gère tout : emballage sur mesure, transport muséal sécurisé, assurance et suivi GPS.",
    icon: Truck,
    color: "amber",
  },
]

const artistFeatures = [
  {
    icon: BadgeCheck,
    title: "Profil artiste vérifié",
    description: "Badge de vérification, portfolio complet avec bio, citations et liens. Votre identité artistique protégée et présentée professionnellement.",
    color: "amber",
  },
  {
    icon: Upload,
    title: "Publication d'œuvres",
    description: "Téléchargez vos photos en haute résolution, rédigez une description riche, définissez votre prix. En ligne en moins de 10 minutes.",
    color: "blue",
  },
  {
    icon: ShieldCheck,
    title: "Certification automatique",
    description: "Standard KCB généré automatiquement à chaque publication. NFC + blockchain inclus dans le plan Professionnel.",
    color: "green",
  },
  {
    icon: ShoppingBag,
    title: "Vente directe & Enchères",
    description: "Prix fixe ou enchères — vous choisissez. Commissions transparentes (5 à 8%), paiement par Mobile Money ou carte.",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "Dashboard analytics",
    description: "Suivez vos vues, favoris, demandes de contact et revenus en temps réel. Comprenez ce qui attire les collectionneurs.",
    color: "indigo",
  },
  {
    icon: Truck,
    title: "Logistique intégrée",
    description: "Emballage professionnel, transport muséal sécurisé, assurance et suivi GPS. Tout est géré par Kucibok.",
    color: "orange",
  },
]

const colorMap = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
}

const steps = [
  {
    number: "01",
    icon: UserPlus,
    title: "Créer votre profil artiste",
    description: "Inscrivez-vous gratuitement, choisissez le rôle 'Artiste', renseignez votre bio et vos influences. Votre profil est en ligne en 5 minutes.",
  },
  {
    number: "02",
    icon: Upload,
    title: "Soumettre vos premières œuvres",
    description: "Photographiez vos œuvres sous plusieurs angles, renseignez les détails (matériaux, dimensions, technique, date) et soumettez pour review.",
  },
  {
    number: "03",
    icon: Award,
    title: "Certification par nos experts",
    description: "Notre équipe valide l'authenticité, génère votre standard KCB et émet le certificat blockchain. Délai : 2 à 5 jours ouvrés.",
  },
  {
    number: "04",
    icon: Globe,
    title: "Vendre au monde entier",
    description: "Votre œuvre est visible par des collectionneurs dans 50+ pays. Recevez des offres, acceptez les paiements en ligne, Kucibok gère la suite.",
  },
]

const testimonials = [
  {
    name: "Aminata Diallo",
    role: "Artiste peintre",
    location: "Dakar, Sénégal",
    avatar: "AD",
    stars: 5,
    quote: "J'ai vendu mes premières toiles en Europe grâce à Kucibok. En deux mois sur la plateforme, j'ai trouvé trois acheteurs à Paris et à Amsterdam. Ce qui m'aurait pris des années s'est passé en quelques semaines.",
  },
  {
    name: "Kwame Asante",
    role: "Sculpteur",
    location: "Accra, Ghana",
    avatar: "KA",
    stars: 5,
    quote: "La certification blockchain a radicalement changé la façon dont les collectionneurs me perçoivent. Avant, ils demandaient des preuves d'authenticité que je ne pouvais pas toujours fournir. Maintenant, mon identifiant KCB suffit.",
  },
  {
    name: "Fatou Kouyaté",
    role: "Céramiste",
    location: "Bamako, Mali",
    avatar: "FK",
    stars: 5,
    quote: "Le transport international sans stress, c'est exactement ce dont j'avais besoin. Kucibok a géré l'emballage, l'assurance et la livraison de mes pièces fragiles à Genève. Elles sont arrivées parfaites.",
  },
]

// ─── Page principale ──────────────────────────────────────────────
/**
 * Page Kucibok pour les artistes africains.
 * Route : /africa/artists
 *
 * @returns {JSX.Element}
 */
export default function AfricaArtists() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AfricaHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium mb-6">
            <Camera className="w-3.5 h-3.5" />
            Artistes
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Votre talent mérite d'être connu{" "}
            <span className="text-amber-400">dans le monde entier</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Kucibok donne aux artistes africains les outils pour certifier, vendre et valoriser leurs œuvres à l'échelle mondiale. Pas besoin d'une galerie à Paris — votre talent suffit.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              Rejoindre en tant qu'artiste <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/africa/pricing"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition"
            >
              Voir les tarifs
            </Link>
          </div>
          {/* Stats */}
          <div className="mt-14 flex flex-wrap justify-center gap-10">
            {[
              { value: "500+", label: "Artistes actifs" },
              { value: "50+", label: "Pays couverts" },
              { value: "2 000+", label: "Œuvres certifiées" },
              { value: "98%", label: "Satisfaction artistes" },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="font-playfair text-3xl font-bold text-amber-400">{stat.value}</p>
                <p className="text-gray-500 text-sm mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>

      {/* ── PAIN POINTS → SOLUTIONS ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Vos défis, nos solutions</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">
            Nous connaissons vos obstacles
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Chaque artiste africain fait face aux mêmes barrières. Kucibok les a éliminées une par une.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {painPoints.map((item, idx) => {
            const colors = colorMap[item.color]
            return (
              <div key={idx} className="bg-[#13161e] border border-gray-800 rounded-xl overflow-hidden">
                {/* Problem */}
                <div className="p-5 border-b border-gray-800 bg-gray-800/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <X className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Problème</p>
                      <p className="text-white font-semibold text-sm">{item.problem}</p>
                      <p className="text-gray-500 text-xs mt-1.5 leading-relaxed">{item.problemDetail}</p>
                    </div>
                  </div>
                </div>
                {/* Solution */}
                <div className="p-5">
                  <div className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${colors.bg}`}>
                      <item.icon className={`w-4 h-4 ${colors.text}`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium uppercase tracking-wider mb-1 ${colors.text}`}>Solution Kucibok</p>
                      <p className="text-white font-semibold text-sm">{item.solution}</p>
                      <p className="text-gray-400 text-xs mt-1.5 leading-relaxed">{item.solutionDetail}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── FEATURES ARTISTES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Vos outils</span>
            <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Tout ce qu'un artiste professionnel a besoin</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Une suite d'outils pensée pour les artistes africains — pas pour les multinationales.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {artistFeatures.map((feature, idx) => {
              const colors = colorMap[feature.color]
              return (
                <div
                  key={idx}
                  className="bg-[#13161e] border border-gray-800 rounded-xl p-6 hover:border-amber-700/30 transition-all group"
                >
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center mb-4 ${colors.bg}`}>
                    <feature.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <h3 className="text-white font-semibold mb-2 group-hover:text-amber-300 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── ÉTAPES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Démarrer</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">4 étapes pour vendre au monde entier</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            De votre inscription à votre première vente internationale — en moins de deux semaines.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[2.25rem] top-10 bottom-10 w-px bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
          <div className="flex flex-col gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-900/30 border border-amber-700/50 flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div className="bg-[#13161e] border border-gray-800 rounded-xl p-5 flex-1 hover:border-amber-700/30 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{step.title}</h3>
                    <span className="text-2xl font-black text-gray-800 leading-none">{step.number}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/sign-up"
            className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition text-sm"
          >
            Commencer maintenant <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Témoignages</span>
            <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Ce que disent nos artistes</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Des artistes de toute l'Afrique partagent leur expérience avec Kucibok.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, idx) => (
              <div
                key={idx}
                className="bg-[#13161e] border border-gray-800 rounded-xl p-6 hover:border-amber-700/20 transition-colors flex flex-col"
              >
                <Quote className="w-6 h-6 text-amber-500/40 mb-4" />
                <p className="text-gray-300 text-sm leading-relaxed mb-6 flex-1">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-800">
                  <div className="w-10 h-10 rounded-full bg-amber-900/40 border border-amber-700/40 flex items-center justify-center text-amber-400 font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role} — {t.location}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: t.stars }).map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Rejoignez la communauté<br />
            <span className="text-amber-400">des artistes Kucibok</span>
          </h2>
          <p className="text-gray-400 mb-4">
            500+ artistes africains ont déjà rejoint la plateforme. Votre prochain acheteur international vous attend.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-gray-500 mb-8">
            {[
              "Gratuit pour commencer",
              "Sans engagement",
              "Support en français",
            ].map((item, i) => (
              <span key={i} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                {item}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              Créer mon profil artiste <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/africa/pricing"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition flex items-center gap-2"
            >
              Voir les tarifs <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AfricaFooter />
    </div>
  )
}
