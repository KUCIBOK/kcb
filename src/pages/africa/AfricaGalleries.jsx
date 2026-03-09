import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Globe, ShieldCheck, Check,
  Building2, BookOpen, FileDown, Code2, BarChart3,
  Headphones, Search, Bell, FileText, Network,
  LayoutDashboard, Users, ChevronRight, ExternalLink
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
            to="/contact"
            className="text-sm font-medium bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold px-4 py-2 rounded-md transition"
          >
            Demander une démo
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
              to="/contact"
              onClick={() => setOpen(false)}
              className="text-sm font-medium bg-amber-500 text-gray-900 font-semibold px-4 py-2 rounded-md text-center"
            >
              Demander une démo
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

// ─── Features data ─────────────────────────────────────────────────
const galleryFeatures = [
  {
    icon: BookOpen,
    title: "Catalogue B2B certifié",
    description: "Toutes vos œuvres avec provenance vérifiée, certificats KCB et historique complet. Un catalogue qui convainc acheteurs, assureurs et douanes.",
    color: "amber",
  },
  {
    icon: Users,
    title: "Gestion multi-artistes",
    description: "Dashboard centralisé pour gérer l'ensemble de vos artistes représentés. Validez les soumissions, suivez les ventes, gérez les profils.",
    color: "blue",
  },
  {
    icon: FileDown,
    title: "Export PDF/CSV",
    description: "Générez des rapports complets pour vos ventes, vos déclarations douanières, vos assureurs. Tous les formats acceptés.",
    color: "green",
  },
  {
    icon: Code2,
    title: "Intégration site web",
    description: "Intégrez votre catalogue Kucibok directement sur votre site via notre widget JavaScript ou notre API REST. En ligne en quelques heures.",
    color: "purple",
  },
  {
    icon: BarChart3,
    title: "Analytics marché",
    description: "Prix moyens par catégorie, tendances des cotes, artistes émergents, segmentation par région. Prenez des décisions éclairées.",
    color: "indigo",
  },
  {
    icon: Headphones,
    title: "Support expert dédié",
    description: "Un manager de compte dédié, joignable par téléphone, email et visio. SLA personnalisé selon votre volume d'activité.",
    color: "orange",
  },
]

const curatorFeatures = [
  {
    icon: Search,
    title: "Recherche avancée",
    description: "Filtrez par origine géographique, période, artiste, technique, matériaux, dimensions et état de conservation. Trouvez exactement ce que vous cherchez.",
    color: "amber",
  },
  {
    icon: Bell,
    title: "Alertes personnalisées",
    description: "Configurez des alertes automatiques pour être notifié immédiatement lorsque de nouvelles œuvres correspondant à vos critères sont publiées.",
    color: "blue",
  },
  {
    icon: FileText,
    title: "Accès aux certificats",
    description: "Consultez l'intégralité des certificats de provenance, rapports d'expertise et historiques de transactions pour chaque œuvre.",
    color: "green",
  },
  {
    icon: BookOpen,
    title: "Outils de documentation",
    description: "Créez et exportez des rapports de recherche. Annotez les œuvres, organisez des listes thématiques, collaborez avec votre équipe.",
    color: "purple",
  },
  {
    icon: Network,
    title: "Réseau de galeries partenaires",
    description: "Accédez aux catalogues privés de notre réseau de galeries partenaires à Dakar, Abidjan, Accra, Lagos et Paris.",
    color: "indigo",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboard de veille",
    description: "Vue consolidée de votre marché de spécialité : nouvelles œuvres, évolutions de prix, artistes à surveiller. Votre veille automatisée.",
    color: "teal",
  },
]

const colorMap = {
  amber: { bg: "bg-amber-500/10", text: "text-amber-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400" },
  green: { bg: "bg-green-500/10", text: "text-green-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400" },
  indigo: { bg: "bg-indigo-500/10", text: "text-indigo-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400" },
  teal: { bg: "bg-teal-500/10", text: "text-teal-400" },
}

// Partenaires placeholder
const partners = [
  "Galerie Arts d'Afrique",
  "Institut Culturel Africain",
  "Maison Senghor",
  "West Africa Art Hub",
  "Galerie Contemporaine Lagos",
  "Arts & Heritage Foundation",
]

// ─── Tab Toggle component ─────────────────────────────────────────
function ProfileTab({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className={`px-5 py-2.5 rounded-lg text-sm font-semibold transition-all ${
        active
          ? "bg-amber-500 text-gray-900"
          : "bg-gray-800 border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600"
      }`}
    >
      {children}
    </button>
  )
}

// ─── Page principale ──────────────────────────────────────────────
/**
 * Page Kucibok pour les galeries et curateurs africains.
 * Route : /africa/galleries
 *
 * @returns {JSX.Element}
 */
export default function AfricaGalleries() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  const [activeTab, setActiveTab] = useState("gallery")

  const currentFeatures = activeTab === "gallery" ? galleryFeatures : curatorFeatures

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <AfricaHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-gray-900 to-gray-950 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <span className="inline-flex items-center gap-2 bg-amber-900/30 border border-amber-700/40 text-amber-300 text-sm px-4 py-1.5 rounded-full font-medium mb-6">
            <Building2 className="w-3.5 h-3.5" />
            Galeries & Curateurs
          </span>
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Gérez et valorisez votre catalogue<br />
            <span className="text-amber-400">au standard mondial</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            De la galerie de Lagos à Paris — Kucibok équipe les professionnels de l'art africain avec des outils B2B pensés pour votre réalité.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              Demander une démo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/africa/pricing"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition"
            >
              Voir les tarifs
            </Link>
          </div>

          {/* Key numbers */}
          <div className="mt-14 flex flex-wrap justify-center gap-10">
            {[
              { value: "120+", label: "Galeries partenaires" },
              { value: "35", label: "Curateurs actifs" },
              { value: "2 000+", label: "Œuvres cataloguées" },
              { value: "18", label: "Pays couverts" },
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

      {/* ── PROFILE TOGGLE + FEATURES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Votre profil</span>
          <h2 className="font-playfair text-4xl text-white mt-2 mb-6">Des outils adaptés à votre rôle</h2>
          {/* Tab toggle */}
          <div className="inline-flex items-center gap-2 bg-gray-900 border border-gray-800 p-1.5 rounded-xl">
            <ProfileTab active={activeTab === "gallery"} onClick={() => setActiveTab("gallery")}>
              Je suis une Galerie
            </ProfileTab>
            <ProfileTab active={activeTab === "curator"} onClick={() => setActiveTab("curator")}>
              Je suis un Curateur
            </ProfileTab>
          </div>
        </div>

        {/* Context description */}
        <div className="max-w-2xl mx-auto text-center mb-12">
          {activeTab === "gallery" ? (
            <p className="text-gray-400">
              Kucibok transforme votre galerie en catalogue B2B certifié, visible par des acheteurs et institutions dans le monde entier. Gérez vos artistes, vos stocks et vos ventes depuis un seul dashboard.
            </p>
          ) : (
            <p className="text-gray-400">
              Accédez à la base de données la plus complète de l'art africain certifié. Outils de recherche avancée, alertes personnalisées et accès aux certificats de provenance pour vos missions d'expertise.
            </p>
          )}
        </div>

        {/* Features grid — animated tab switch */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {currentFeatures.map((feature, idx) => {
            const colors = colorMap[feature.color]
            return (
              <div
                key={`${activeTab}-${idx}`}
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
      </section>

      {/* ── AVANTAGES B2B ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Pourquoi Kucibok</span>
              <h2 className="font-playfair text-4xl text-white mt-2 mb-5">
                L'infrastructure B2B<br />
                <span className="text-amber-400">que vous attendiez</span>
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed mb-6">
                Les galeries africaines ont longtemps manqué d'outils adaptés à leurs besoins spécifiques — provenance culturelle complexe, réglementations douanières, acheteurs internationaux méfiants. Kucibok est la première plateforme pensée pour vous.
              </p>
              <div className="space-y-3">
                {[
                  "Catalogue certifié reconnu par 50+ maisons de vente",
                  "Exportations douane simplifiées avec documentation complète",
                  "Intégration directe dans votre site ou CRM",
                  "Manager de compte dédié parlant votre langue",
                  "Facturation en FCFA, euros ou USD",
                  "SLA garanti (99.9% uptime) — vos ventes ne s'arrêtent jamais",
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                    <Check className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    {item}
                  </div>
                ))}
              </div>
              <div className="mt-8">
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition text-sm"
                >
                  Discuter de votre projet <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Process */}
            <div className="space-y-4">
              {[
                {
                  step: "1",
                  title: "Audit de votre catalogue",
                  description: "Notre équipe analyse votre catalogue existant et définit un plan de certification adapté à votre volume et vos délais.",
                },
                {
                  step: "2",
                  title: "Migration et certification",
                  description: "Vos œuvres existantes sont migrées, photographiées et certifiées selon le standard KCB. Délai selon volume.",
                },
                {
                  step: "3",
                  title: "Intégration technique",
                  description: "Notre équipe déploie le widget ou l'API sur votre site. Formation de vos équipes incluse.",
                },
                {
                  step: "4",
                  title: "Activation et suivi",
                  description: "Votre catalogue est en ligne. Votre manager de compte assure un suivi mensuel avec rapport de performance.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-[#13161e] border border-gray-800 rounded-xl p-4">
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-700/30 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-amber-400 text-xs font-bold">{item.step}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                    <p className="text-gray-500 text-xs leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-amber-400 text-sm font-medium uppercase tracking-wider">Ils nous font confiance</span>
          <h2 className="font-playfair text-3xl text-white mt-2 mb-3">
            Galeries et institutions partenaires
          </h2>
          <p className="text-gray-500 text-sm">
            Des structures de référence à travers l'Afrique et en diaspora
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-12">
          {partners.map((partner, idx) => (
            <div
              key={idx}
              className="bg-[#13161e] border border-gray-800 rounded-xl p-5 flex items-center justify-center text-center min-h-[80px] hover:border-amber-700/30 transition-colors"
            >
              <p className="text-gray-500 text-sm font-medium">{partner}</p>
            </div>
          ))}
        </div>

        {/* Testimonial galerie */}
        <div className="bg-[#13161e] border border-amber-700/20 rounded-2xl p-8 md:p-10 max-w-3xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-amber-500/10 border border-amber-700/30 flex items-center justify-center mx-auto mb-5 text-amber-400 font-bold">
            NK
          </div>
          <blockquote className="font-playfair text-xl text-white mb-5 leading-relaxed">
            "Kucibok nous a permis d'ouvrir notre catalogue à des acheteurs en Europe et aux États-Unis sans effort logistique supplémentaire. Notre chiffre d'affaires international a augmenté de 60% en un an."
          </blockquote>
          <p className="text-amber-400 font-semibold text-sm">Nadia Kamara</p>
          <p className="text-gray-500 text-xs mt-0.5">Directrice — Galerie Contemporaine Abidjan</p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-20 px-4 bg-gray-800/20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Prêt à digitaliser votre<br />
            <span className="text-amber-400">catalogue B2B ?</span>
          </h2>
          <p className="text-gray-400 mb-8">
            Planifiez une démo personnalisée de 30 minutes avec notre équipe. Sans engagement — nous adaptons la solution à votre réalité.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3 bg-amber-500 hover:bg-amber-400 text-gray-900 font-semibold rounded-md transition flex items-center gap-2"
            >
              Demander une démo B2B <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/africa/pricing"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition flex items-center gap-2"
            >
              Tarifs Galerie <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <p className="text-gray-600 text-xs mt-6 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-gray-600" />
            Vos données sont protégées — aucun partage avec des tiers
          </p>
        </div>
      </section>

      <AfricaFooter />
    </div>
  )
}
