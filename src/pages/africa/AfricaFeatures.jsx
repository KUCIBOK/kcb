import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Camera, ShieldCheck, Smartphone, Truck,
  Award, Globe, LayoutDashboard, BookOpen, Headphones, ScanLine,
  QrCode, Check, ChevronRight, Zap, Lock, BarChart3
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

        {/* Desktop nav */}
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

// ─── Features data ────────────────────────────────────────────────
const features = [
  {
    icon: Camera,
    title: "Numérisation 3D & HD",
    description: "Scan 3D haute résolution et photographie multi-angles de vos œuvres physiques. Préservez chaque détail, chaque texture — pour toujours.",
    color: "amber",
    tag: "Patrimoine"
  },
  {
    icon: ShieldCheck,
    title: "Certification blockchain",
    description: "Chaque œuvre reçoit un NFT de provenance immuable (standard KCB). Authenticité incontestable, reconnue par les maisons de vente internationales.",
    color: "green",
    tag: "Sécurité"
  },
  {
    icon: Smartphone,
    title: "Passeport culturel NFC",
    description: "Un tag NFC intégré à l'œuvre. Scannez depuis votre téléphone pour accéder instantanément à l'historique complet et au certificat.",
    color: "blue",
    tag: "Innovation"
  },
  {
    icon: Truck,
    title: "Logistique internationale",
    description: "Transport muséal sécurisé depuis toutes les capitales africaines. Emballage sur mesure, assurance internationale, suivi GPS en temps réel.",
    color: "purple",
    tag: "Logistique"
  },
  {
    icon: Award,
    title: "Expertise certifiée",
    description: "Nos experts authentifient et estiment chaque pièce. Rapports reconnus par les assureurs, les douanes et les maisons de vente mondiales.",
    color: "red",
    tag: "Expertise"
  },
  {
    icon: Globe,
    title: "Marché mondial",
    description: "Connectez vos œuvres africaines à des collectionneurs dans 50+ pays. Vente directe, enchères, ou conservation dans votre collection digitale.",
    color: "indigo",
    tag: "Commerce"
  },
  {
    icon: LayoutDashboard,
    title: "Gestion de collection",
    description: "Dashboard complet pour gérer votre inventaire, suivre la valeur de vos œuvres dans le temps et générer des rapports pour vos assureurs.",
    color: "teal",
    tag: "Gestion"
  },
  {
    icon: BookOpen,
    title: "Blog & actualités",
    description: "Veille marché, articles d'expertise, tendances de l'art africain contemporain et primitif. Restez informé, développez votre connaissance.",
    color: "orange",
    tag: "Éducation"
  },
  {
    icon: Headphones,
    title: "Support expert dédié",
    description: "Un expert de l'art africain joignable par chat, email ou visio. Réponse garantie sous 24h ouvrées. Support en français, anglais et arabe.",
    color: "pink",
    tag: "Support"
  },
]

const colorMap = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
  green: { bg: "bg-green-500/10", text: "text-green-400", border: "border-green-500/20" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20" },
  pink: { bg: "bg-pink-500/10", text: "text-pink-400", border: "border-pink-500/20" },
}

const kcbHighlights = [
  {
    icon: QrCode,
    title: "Identifiant unique immuable",
    description: "Chaque œuvre reçoit un code KCB-XXXXXXXX généré automatiquement. Ce numéro de série est gravé dans la blockchain et ne peut jamais être modifié ou dupliqué."
  },
  {
    icon: ScanLine,
    title: "QR scannable instantanément",
    description: "Le QR code imprimé sur le certificat ou collé sur l'œuvre redirige vers la fiche publique /verify/[id] — accessible sans compte depuis n'importe quel smartphone."
  },
  {
    icon: Lock,
    title: "Reconnu officiellement",
    description: "Le standard KCB est reconnu par les maisons de vente partenaires, les compagnies d'assurance spécialisées et les services douaniers de 12 pays africains."
  },
  {
    icon: BarChart3,
    title: "Historique de valeur",
    description: "Chaque transaction, chaque estimation, chaque transfert est enregistré et consultable. La valeur de l'œuvre dans le temps est traçable à l'euro près."
  },
]

// ─── Page principale ──────────────────────────────────────────────
/**
 * Page des fonctionnalités Kucibok Africa.
 * Route : /africa/features
 *
 * @returns {JSX.Element}
 */
export default function AfricaFeatures() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AfricaHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium mb-6">
            <Zap className="w-3.5 h-3.5" />
            Fonctionnalités complètes
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Tout pour protéger et valoriser<br />
            <span className="text-amber-400">l'art africain</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            De la numérisation à la vente internationale, Kucibok couvre l'intégralité de la chaîne de valeur de votre patrimoine artistique.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              S'inscrire gratuitement <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/africa/pricing"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition"
            >
              Voir les tarifs
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>

      {/* ── FEATURES GRID ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Nos services</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">9 fonctionnalités intégrées</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Une plateforme unique qui couvre tout — de la numérisation patrimoniale à la gestion de collection professionnelle.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => {
            const colors = colorMap[feature.color]
            return (
              <div
                key={idx}
                className="bg-[#13161e] border border-gray-800 rounded-xl p-6 hover:border-amber-700/30 transition-all group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-lg flex items-center justify-center ${colors.bg}`}>
                    <feature.icon className={`w-5 h-5 ${colors.text}`} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                    {feature.tag}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2 group-hover:text-amber-300 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* ── KCB STANDARD HIGHLIGHT ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Texte */}
            <div>
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Standard exclusif</span>
              <h2 className="font-playfair text-4xl text-white mt-2 mb-5">
                Le standard Kucibok<br />
                <span className="text-amber-400">KCB-XXXXXXXX</span>
              </h2>
              <p className="text-gray-400 leading-relaxed mb-6">
                Chaque œuvre enregistrée sur Kucibok reçoit un identifiant unique et permanent, généré automatiquement selon notre standard propriétaire. Ce numéro de série est votre première ligne de défense contre la contrefaçon et la dépossession illégale.
              </p>
              <div className="space-y-3 mb-8">
                {[
                  "Immuable — impossible à falsifier ou à dupliquer",
                  "Scannable via QR code ou tag NFC",
                  "Reconnu par les assureurs et maisons de vente",
                  "Accessible publiquement via /verify/[id]",
                  "Inclut l'historique complet de l'œuvre",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition text-sm"
              >
                Certifier une œuvre <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Right: KCB Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {kcbHighlights.map((item, idx) => (
                <div
                  key={idx}
                  className="bg-[#13161e] border border-gray-800 hover:border-amber-700/30 rounded-xl p-5 transition-colors"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-500/10 flex items-center justify-center mb-3">
                    <item.icon className="w-4.5 h-4.5 text-amber-400 w-[18px] h-[18px]" />
                  </div>
                  <h4 className="text-white text-sm font-semibold mb-1.5">{item.title}</h4>
                  <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── COMPARISON TABLE ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Comparaison</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Kucibok vs. méthodes traditionnelles</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Ce que nous offrons que les galeries et maisons de vente traditionnelles ne peuvent pas garantir.
          </p>
        </div>

        <div className="bg-[#13161e] border border-gray-800 rounded-xl overflow-hidden">
          <div className="grid grid-cols-3 bg-gray-800/50 px-6 py-3 text-xs font-semibold uppercase tracking-wider text-gray-400">
            <span>Fonctionnalité</span>
            <span className="text-center text-amber-400">Kucibok</span>
            <span className="text-center">Traditionnel</span>
          </div>
          {[
            ["Certification immuable blockchain", true, false],
            ["Accès mondial immédiat", true, false],
            ["Logistique intégrée clé en main", true, false],
            ["QR / NFC scannable", true, false],
            ["Historique traçable 100%", true, false],
            ["Dashboard analytics artiste", true, false],
            ["Support expert africain", true, "partiel"],
            ["Expertise et estimation", true, true],
            ["Vente & enchères en ligne", true, "partiel"],
          ].map(([feat, kuci, trad], i) => (
            <div
              key={i}
              className={`grid grid-cols-3 px-6 py-3.5 text-sm items-center ${i % 2 === 0 ? "" : "bg-gray-800/20"}`}
            >
              <span className="text-gray-300">{feat}</span>
              <span className="text-center">
                {kuci === true
                  ? <Check className="w-4 h-4 text-green-400 mx-auto" />
                  : <X className="w-4 h-4 text-red-400 mx-auto" />}
              </span>
              <span className="text-center">
                {trad === true
                  ? <Check className="w-4 h-4 text-green-400 mx-auto" />
                  : trad === "partiel"
                  ? <span className="text-yellow-500 text-xs">Partiel</span>
                  : <X className="w-4 h-4 text-red-400 mx-auto" />}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gray-800/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Prêt à certifier votre<br />
            <span className="text-amber-400">première œuvre ?</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez plus de 500 artistes africains qui font confiance à Kucibok pour protéger et valoriser leur travail.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              Créer un compte gratuit <ArrowRight className="w-4 h-4" />
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
