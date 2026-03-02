import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Globe, ShieldCheck, TrendingUp, Wallet,
  Award, Users, Upload, ShoppingCart, Check, Gavel, BookOpen
} from "lucide-react"

// ─── Global Header ────────────────────────────────────────────────
function GlobalHeader() {
  const [open, setOpen] = useState(false)

  const scrollTo = (id) => {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

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
          {[
            { label: "Explorer", id: "explore" },
            { label: "Services", id: "services" },
            { label: "Comment ça marche", id: "how-it-works" },
            { label: "À propos", id: "about" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-gray-300 hover:text-indigo-400 transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Link to="/sign-in" className="text-sm font-medium bg-gray-800 border border-gray-700 hover:bg-gray-700 px-4 py-2 rounded-md text-white transition">
            Connexion
          </Link>
          <Link to="/sign-up" className="text-sm font-medium bg-gradient px-4 py-2 rounded-md text-white hover:opacity-90 transition">
            Inscription
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden text-white p-2">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden mt-3 border-t border-gray-800 pt-4 flex flex-col gap-4 pb-4">
          {[
            { label: "Explorer", id: "explore" },
            { label: "Services", id: "services" },
            { label: "Comment ça marche", id: "how-it-works" },
            { label: "À propos", id: "about" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-gray-300 hover:text-indigo-400 transition-colors font-medium text-sm"
            >
              {item.label}
            </button>
          ))}
          <div className="flex flex-col gap-2 pt-2 border-t border-gray-800">
            <Link to="/sign-in" onClick={() => setOpen(false)} className="text-sm font-medium bg-gray-800 border border-gray-700 px-4 py-2 rounded-md text-white text-center">
              Connexion
            </Link>
            <Link to="/sign-up" onClick={() => setOpen(false)} className="text-sm font-medium bg-gradient px-4 py-2 rounded-md text-white text-center">
              Inscription
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Data ────────────────────────────────────────────────────────
const artCategories = [
  { label: "Peintures", icon: "🖼️", description: "Art contemporain mondial" },
  { label: "Sculptures", icon: "🗿", description: "Œuvres tridimensionnelles" },
  { label: "Photographie", icon: "📸", description: "Art photographique" },
  { label: "Art numérique", icon: "💻", description: "NFT et créations digitales" },
  { label: "Enchères", icon: "🔨", description: "Ventes aux enchères en direct" },
  { label: "Collections", icon: "✨", description: "Collections curatées" },
]

const globalServices = [
  {
    icon: Globe,
    title: "Marché mondial",
    description: "Achetez et vendez des œuvres d'art auprès d'artistes et collectionneurs du monde entier. Plus de 190 pays connectés sur une seule plateforme.",
    color: "indigo"
  },
  {
    icon: ShieldCheck,
    title: "Certification blockchain",
    description: "Chaque œuvre reçoit un certificat d'authenticité immuable sur la blockchain. Provenance vérifiée, historique complet, valeur garantie.",
    color: "green"
  },
  {
    icon: Gavel,
    title: "Enchères en direct",
    description: "Participez à des ventes aux enchères en temps réel. Système de mises instantanées, notifications push, et résultats transparents.",
    color: "purple"
  },
  {
    icon: Wallet,
    title: "Paiements sécurisés",
    description: "Paiement par carte, virement ou cryptomonnaie. Escrow automatique pour une sécurité maximale sur chaque transaction.",
    color: "blue"
  },
  {
    icon: TrendingUp,
    title: "Analyse de marché",
    description: "Suivez les tendances du marché de l'art, les cotes des artistes et l'évolution de la valeur de votre collection en temps réel.",
    color: "amber"
  },
  {
    icon: Award,
    title: "Programme artistes",
    description: "Accompagnement dédié pour les artistes : profil vérifié, promotion, accès aux collectionneurs premium et galeries partenaires.",
    color: "red"
  },
]

const colorMap = {
  amber: "bg-amber-500/10 text-amber-400",
  green: "bg-green-500/10 text-green-400",
  blue: "bg-blue-500/10 text-blue-400",
  purple: "bg-purple-500/10 text-purple-400",
  red: "bg-red-500/10 text-red-400",
  indigo: "bg-indigo-kcb/10 text-indigo-400",
}

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Créez votre profil",
    description: "Inscrivez-vous en tant qu'artiste, collectionneur ou professionnel de l'art. Complétez votre profil vérifié en quelques minutes.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Publiez ou explorez",
    description: "Artistes : publiez vos œuvres avec certificats. Collectionneurs : explorez des milliers de créations du monde entier.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Achat sécurisé",
    description: "Paiement protégé par escrow. Les fonds sont transférés à l'artiste uniquement à réception confirmée par l'acheteur.",
  },
  {
    number: "04",
    icon: ShoppingCart,
    title: "Livraison & certificat",
    description: "Livraison assurée avec suivi GPS. Votre certificat blockchain est automatiquement transféré à votre portefeuille numérique.",
  },
]

const stats = [
  { value: "10k+", label: "Artistes inscrits" },
  { value: "50k+", label: "Œuvres disponibles" },
  { value: "190+", label: "Pays connectés" },
  { value: "€2M+", label: "Transactions réalisées" },
]

// ─── Main Page ────────────────────────────────────────────────────
export default function GlobalPage() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <GlobalHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-gray-900 to-fuchsia-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="flex items-center gap-2 bg-indigo-900/30 border border-indigo-700/40 text-indigo-300 text-sm px-4 py-1.5 rounded-full font-medium">
              <Globe className="w-3.5 h-3.5" /> Marché international de l'art
            </span>
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            L'Art mondial<br />
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">à portée de clic</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Kucibok connecte artistes et collectionneurs du monde entier sur une plateforme de vente, d'enchères et de certification blockchain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById("explore")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Explorer les œuvres <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition"
            >
              Comment ça marche
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-4 border-y border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((s, i) => (
            <div key={i}>
              <p className="text-3xl font-bold text-indigo-400 mb-1">{s.value}</p>
              <p className="text-gray-400 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── EXPLORE ── */}
      <section id="explore" className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Galerie</span>
            <h2 className="font-playfair text-4xl text-white mt-2">Explorer le marché mondial</h2>
            <p className="text-gray-400 mt-2 max-w-lg">
              Des milliers d'œuvres certifiées — peintures, sculptures, photographies, art numérique et bien plus.
            </p>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition font-medium text-sm shrink-0"
          >
            Voir toute la galerie <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {artCategories.map((cat, idx) => (
            <Link
              key={idx}
              to="/explore"
              className="group bg-card border border-gray-800 hover:border-indigo-700/50 rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{cat.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{cat.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-indigo-400 ml-auto transition-colors" />
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/auction"
            className="inline-flex items-center gap-2 px-6 py-2.5 border border-indigo-700/50 rounded-md text-indigo-300 text-sm font-medium hover:bg-indigo-900/20 transition"
          >
            <Gavel className="w-4 h-4" /> Voir les enchères en cours
          </Link>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Services</span>
            <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Tout pour vendre et collectionner</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              De la publication à la livraison, Kucibok prend en charge toute la chaîne de valeur de votre œuvre.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {globalServices.map((s, idx) => (
              <div key={idx} className="bg-card border border-gray-800 rounded-xl p-6 hover:border-indigo-700/30 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${colorMap[s.color]}`}>
                  <s.icon className="w-5 h-5" />
                </div>
                <h3 className="text-white font-semibold mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient rounded-md text-white text-sm font-medium hover:opacity-90 transition"
            >
              Découvrir tous nos services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-20 px-4 md:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Processus</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Simple, rapide, sécurisé</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            En 4 étapes, achetez ou vendez votre œuvre d'art sur le marché mondial.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[2.25rem] top-12 bottom-12 w-px bg-gradient-to-b from-indigo-500/60 via-indigo-500/20 to-transparent" />
          <div className="flex flex-col gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-indigo-900/30 border border-indigo-700/50 flex items-center justify-center z-10">
                    <step.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                </div>
                <div className="bg-card border border-gray-800 rounded-xl p-5 flex-1 hover:border-indigo-700/30 transition-colors">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="text-white font-semibold">{step.title}</h3>
                    <span className="text-2xl font-black text-gray-700 leading-none">{step.number}</span>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-10">
          <Link
            to="/how-it-works"
            className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition text-sm font-medium"
          >
            Guide complet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Notre mission</span>
              <h2 className="font-playfair text-4xl text-white mt-2 mb-5">
                Démocratiser l'art,<br />
                <span className="text-indigo-400">partout dans le monde</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                Kucibok est né d'une conviction : l'art doit être accessible à tous, et les artistes doivent être rémunérés équitablement. Notre plateforme utilise la blockchain pour garantir transparence et authenticité sur chaque transaction.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Fondée en 2024, Kucibok connecte des artistes africains et internationaux à des collectionneurs du monde entier. Nous bâtissons le marché de l'art de demain — équitable, numérique et mondial.
              </p>
              <div className="space-y-2">
                {[
                  "Certification blockchain de chaque œuvre",
                  "Transactions 100% sécurisées",
                  "Artistes rémunérés équitablement",
                  "Support dédié 7j/7",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-indigo-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
                <img
                  src="/images/homepage/collector-hero.jpeg"
                  alt="Collection d'art"
                  className="w-full h-56 object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className="bg-card border border-gray-800 rounded-xl p-5 text-center">
                    <p className="text-3xl font-bold text-indigo-400 mb-1">{s.value}</p>
                    <p className="text-gray-400 text-xs">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Founders */}
          <div className="mt-16 text-center">
            <h3 className="font-playfair text-2xl text-white mb-8">Les fondateurs</h3>
            <div className="flex flex-wrap justify-center gap-10">
              {[
                { name: "Moctar Sidibé", role: "Co-Founder & CEO", image: "/images/team/MoctarSidibe.jpeg" },
                { name: "Curtis Zirignon", role: "Co-Founder & CFO", image: "/images/team/CurtisZirignon.jpeg" },
              ].map((m, i) => (
                <div key={i} className="flex flex-col items-center gap-3">
                  <img src={m.image} alt={m.name} className="w-24 h-24 object-cover rounded-full border-2 border-indigo-700/50" />
                  <div>
                    <p className="text-white font-semibold">{m.name}</p>
                    <p className="text-gray-400 text-sm">{m.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Prêt à rejoindre<br />
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">
              le marché mondial ?
            </span>
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez des milliers d'artistes et collectionneurs qui font confiance à Kucibok.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/sign-up" className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition flex items-center gap-2">
              Créer un compte <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition">
              Voir les œuvres
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-500 text-sm">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link to="/" className="hover:text-white transition">Site principal</Link>
          <Link to="/africa" className="hover:text-white transition">Portail Africa</Link>
          <Link to="/about" className="hover:text-white transition">À propos</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/privacy-policy" className="hover:text-white transition">Confidentialité</Link>
        </div>
        <p>© {new Date().getFullYear()} Kucibok — Marché mondial de l'art certifié blockchain</p>
      </footer>
    </div>
  )
}
