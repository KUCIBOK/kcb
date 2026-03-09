import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Camera, ShieldCheck, Truck, Smartphone,
  Award, UserPlus, Upload, ShoppingCart, Check, ChevronDown,
  MapPin, Globe, Layers
} from "lucide-react"

// ─── Africa Header ────────────────────────────────────────────────
function AfricaHeader() {
  const [open, setOpen] = useState(false)

  const scrollTo = (id) => {
    setOpen(false)
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    }, 100)
  }

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-gray-900/85 border-b border-amber-900/30 px-4 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/images/kucibok-white-logo.svg" alt="Kucibok" className="w-7" />
          <span className="font-playfair text-white font-bold text-lg">Kucibok <span className="text-amber-400 text-sm font-normal">Africa</span></span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-5 text-sm">
          {[
            { label: "Parcourir les œuvres", id: "browse-art" },
            { label: "Services", id: "services" },
            { label: "Comment ça marche", id: "how-it-works" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-gray-300 hover:text-amber-400 transition-colors font-medium"
            >
              {item.label}
            </button>
          ))}
          <Link to="/africa/features" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
            Fonctionnalités
          </Link>
          <Link to="/africa/pricing" className="text-gray-300 hover:text-amber-400 transition-colors font-medium">
            Tarifs
          </Link>
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
            { label: "Parcourir les œuvres", id: "browse-art" },
            { label: "Services", id: "services" },
            { label: "Comment ça marche", id: "how-it-works" },
            { label: "À propos", id: "about" },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left text-gray-300 hover:text-amber-400 transition-colors font-medium text-sm"
            >
              {item.label}
            </button>
          ))}
          <Link to="/africa/features" onClick={() => setOpen(false)} className="text-left text-gray-300 hover:text-amber-400 transition-colors font-medium text-sm">
            Fonctionnalités
          </Link>
          <Link to="/africa/pricing" onClick={() => setOpen(false)} className="text-left text-gray-300 hover:text-amber-400 transition-colors font-medium text-sm">
            Tarifs
          </Link>
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
  { label: "Masques", icon: "🎭", description: "Masques rituels et cérémoniaux" },
  { label: "Statuettes", icon: "🗿", description: "Figures ancestrales et fétiches" },
  { label: "Bronzes", icon: "🏺", description: "Bronzes du Bénin et du Cameroun" },
  { label: "Textiles", icon: "🧵", description: "Kente, Bogolan, Kanga" },
  { label: "Bijoux", icon: "💍", description: "Parures et ornements traditionnels" },
  { label: "Peintures", icon: "🖼️", description: "Art contemporain africain" },
]

const africaServices = [
  {
    icon: Camera,
    title: "Numérisation patrimoniale",
    description: "Scan 3D et photographie haute résolution de vos œuvres physiques. Préservez le patrimoine, rendez-le accessible au monde entier.",
    color: "amber"
  },
  {
    icon: ShieldCheck,
    title: "Certification de provenance",
    description: "Chaque œuvre reçoit un certificat blockchain immuable attestant de son origine, ses matériaux, son artiste et son historique.",
    color: "green"
  },
  {
    icon: Smartphone,
    title: "Passeport culturel NFC",
    description: "Un tag NFC intégré à l'œuvre. Scannez et accédez instantanément à toute l'histoire de la pièce depuis votre téléphone.",
    color: "blue"
  },
  {
    icon: Truck,
    title: "Logistique internationale",
    description: "Transport muséal sécurisé depuis toutes les capitales africaines. Emballage sur mesure, assurance et suivi GPS inclus.",
    color: "purple"
  },
  {
    icon: Award,
    title: "Expertise certifiée",
    description: "Nos experts évaluent et authentifient chaque pièce. Rapports reconnus par les maisons de vente et les assureurs internationaux.",
    color: "red"
  },
  {
    icon: Globe,
    title: "Marché mondial",
    description: "Connectez vos œuvres africaines à des collectionneurs du monde entier via notre plateforme de vente et d'enchères.",
    color: "indigo"
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
    title: "Apportez ou soumettez votre œuvre",
    description: "Déposez votre œuvre dans l'un de nos points partenaires ou soumettez directement des photos sur la plateforme.",
  },
  {
    number: "02",
    icon: Camera,
    title: "Numérisation & authentification",
    description: "Notre équipe réalise un scan haute résolution et nos experts vérifient l'authenticité et estiment la valeur.",
  },
  {
    number: "03",
    icon: ShieldCheck,
    title: "Certification blockchain",
    description: "Un NFT de provenance unique est créé sur la blockchain. L'œuvre reçoit son passeport culturel numérique permanent.",
  },
  {
    number: "04",
    icon: ShoppingCart,
    title: "Vente, enchère ou conservation",
    description: "Mettez en vente, organisez une enchère ou conservez simplement votre œuvre dans votre collection digitale.",
  },
]

const regions = [
  { name: "Afrique de l'Ouest", countries: "Sénégal, Mali, Côte d'Ivoire, Ghana, Bénin", highlight: true },
  { name: "Afrique Centrale", countries: "Congo, Cameroun, Gabon, RDC" },
  { name: "Afrique de l'Est", countries: "Éthiopie, Kenya, Tanzanie" },
  { name: "Afrique du Nord", countries: "Maroc, Égypte, Tunisie" },
]

// ─── Main Page ────────────────────────────────────────────────────
export default function AfricaLanding() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AfricaHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-900 to-indigo-950/30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium">
              <MapPin className="w-3.5 h-3.5" /> Art africain primitif & contemporain
            </span>
          </div>
          <h1 className="font-playfair text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            L'Art Africain<br />
            <span className="text-amber-400">à l'ère du numérique</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Kucibok préserve, certifie et valorise le patrimoine artistique africain grâce à la blockchain. Des masques Dogon aux bronzes du Bénin — chaque œuvre mérite d'être connue.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => document.getElementById("browse-art")?.scrollIntoView({ behavior: "smooth" })}
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
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

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>

      {/* ── BROWSE ART ── */}
      <section id="browse-art" className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Galerie</span>
            <h2 className="font-playfair text-4xl text-white mt-2">Parcourir les œuvres africaines</h2>
            <p className="text-gray-400 mt-2 max-w-lg">
              Des milliers d'œuvres d'art africain authentifiées et certifiées — masques, bronzes, textiles, peintures et bien plus.
            </p>
          </div>
          <Link
            to="/explore"
            className="flex items-center gap-2 text-amber-400 hover:text-amber-300 transition font-medium text-sm shrink-0"
          >
            Voir toute la galerie <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10">
          {artCategories.map((cat, idx) => (
            <Link
              key={idx}
              to={`/explore`}
              className="group bg-card border border-gray-800 hover:border-amber-700/50 rounded-xl p-5 flex items-center gap-4 transition-all hover:-translate-y-0.5"
            >
              <span className="text-3xl">{cat.icon}</span>
              <div>
                <p className="text-white font-semibold text-sm">{cat.label}</p>
                <p className="text-gray-500 text-xs mt-0.5">{cat.description}</p>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-amber-400 ml-auto transition-colors" />
            </Link>
          ))}
        </div>

        {/* Regions */}
        <div className="bg-gray-800/40 border border-gray-700 rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Layers className="w-4 h-4 text-amber-400" />
            <h3 className="text-white font-medium text-sm">Œuvres disponibles par région</h3>
          </div>
          <div className="grid md:grid-cols-2 gap-3">
            {regions.map((r, i) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg ${r.highlight ? "bg-amber-900/20 border border-amber-800/40" : ""}`}>
                <MapPin className={`w-4 h-4 mt-0.5 shrink-0 ${r.highlight ? "text-amber-400" : "text-gray-500"}`} />
                <div>
                  <p className={`text-sm font-medium ${r.highlight ? "text-amber-300" : "text-gray-300"}`}>{r.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{r.countries}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section id="services" className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Services</span>
            <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Nous protégeons votre patrimoine</h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              De la numérisation à la vente internationale, Kucibok prend en charge toute la chaîne de valeur de votre œuvre africaine.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {africaServices.map((s, idx) => (
              <div key={idx} className="bg-card border border-gray-800 rounded-xl p-6 hover:border-amber-700/30 transition-colors">
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
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Processus</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-3">Votre œuvre sur la blockchain</h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            En 4 étapes, transformez votre art africain en actif numérique certifié et accessible au marché mondial.
          </p>
        </div>

        <div className="relative">
          <div className="hidden md:block absolute left-[2.25rem] top-12 bottom-12 w-px bg-gradient-to-b from-amber-500/60 via-amber-500/20 to-transparent" />
          <div className="flex flex-col gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="flex gap-6">
                <div className="shrink-0">
                  <div className="w-12 h-12 rounded-full bg-amber-900/30 border border-amber-700/50 flex items-center justify-center z-10">
                    <step.icon className="w-5 h-5 text-amber-400" />
                  </div>
                </div>
                <div className="bg-card border border-gray-800 rounded-xl p-5 flex-1 hover:border-amber-700/30 transition-colors">
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
            className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 transition text-sm font-medium"
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
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Notre mission</span>
              <h2 className="font-playfair text-4xl text-white mt-2 mb-5">
                Préserver l'âme de l'Afrique,<br />
                <span className="text-amber-400">une œuvre à la fois</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-4">
                L'art africain primitif est l'un des patrimoines les plus riches et les plus fragiles de l'humanité. Des masques Dogon du Mali aux bronzes royaux du Bénin, ces œuvres portent des siècles de culture, de spiritualité et d'histoire.
              </p>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Kucibok a été fondé avec une conviction : la blockchain peut devenir le gardien numérique de ce patrimoine. En certifiant l'authenticité et la provenance de chaque pièce, nous construisons un marché de l'art africain transparent, équitable et mondial.
              </p>
              <div className="space-y-2">
                {[
                  "Certification blockchain de provenance",
                  "Artistes africains au cœur de la plateforme",
                  "Préservation du patrimoine culturel",
                  "Marché équitable et transparent",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-6">
              <div className="bg-card border border-gray-800 rounded-xl overflow-hidden">
                <img
                  src="/images/homepage/collector-hero.jpeg"
                  alt="Art africain"
                  className="w-full h-56 object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-gray-800 rounded-xl p-5 text-center">
                  <p className="text-3xl font-bold text-amber-400 mb-1">500+</p>
                  <p className="text-gray-400 text-xs">Artistes africains</p>
                </div>
                <div className="bg-card border border-gray-800 rounded-xl p-5 text-center">
                  <p className="text-3xl font-bold text-amber-400 mb-1">2000+</p>
                  <p className="text-gray-400 text-xs">Œuvres certifiées</p>
                </div>
                <div className="bg-card border border-gray-800 rounded-xl p-5 text-center">
                  <p className="text-3xl font-bold text-amber-400 mb-1">12</p>
                  <p className="text-gray-400 text-xs">Pays d'Afrique</p>
                </div>
                <div className="bg-card border border-gray-800 rounded-xl p-5 text-center">
                  <p className="text-3xl font-bold text-amber-400 mb-1">50+</p>
                  <p className="text-gray-400 text-xs">Collectionneurs actifs</p>
                </div>
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
                  <img src={m.image} alt={m.name} className="w-24 h-24 object-cover rounded-full border-2 border-amber-700/50" />
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

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Prêt à rejoindre le marché<br />
            <span className="text-amber-400">de l'art africain ?</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Rejoignez des centaines d'artistes et collectionneurs qui font confiance à Kucibok pour valoriser l'art africain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/sign-up" className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2">
              Créer un compte <ArrowRight className="w-4 h-4" />
            </Link>
            <Link to="/explore" className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition">
              Voir les œuvres
            </Link>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="border-t border-gray-800 py-8 px-4 text-center text-gray-500 text-sm">
        <div className="flex flex-wrap justify-center gap-6 mb-4">
          <Link to="/" className="hover:text-white transition">Site principal</Link>
          <Link to="/about" className="hover:text-white transition">À propos</Link>
          <Link to="/contact" className="hover:text-white transition">Contact</Link>
          <Link to="/privacy-policy" className="hover:text-white transition">Confidentialité</Link>
        </div>
        <p>© {new Date().getFullYear()} Kucibok — Art africain certifié blockchain</p>
      </footer>
    </div>
  )
}
