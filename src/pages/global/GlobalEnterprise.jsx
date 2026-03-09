import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import {
  Menu, X, ArrowRight, Building2, Users, FileText, Shield,
  Globe, TrendingUp, Briefcase, Award, Check, ChevronRight,
  BarChart2, Zap, Server, Clock
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

const targetProfiles = [
  {
    icon: Building2,
    name: "Hôtels & hospitalité",
    desc: "Valorisez vos espaces avec de l'art africain et international certifié. Kucibok Enterprise vous permet de gérer votre collection décorative, d'organiser des rotations d'œuvres et de fournir des certificats pour vos assureurs.",
    features: [
      "Gestion de collection décorative multi-espaces",
      "Rotation des œuvres planifiée automatiquement",
      "Certificats blockchain pour les compagnies d'assurance",
      "Visites virtuelles 360° des espaces",
      "Rapport de valeur annuel pour les actifs artistiques",
    ],
    color: "border-indigo-700/60",
    iconBg: "bg-indigo-900/30",
    iconColor: "text-indigo-400",
  },
  {
    icon: Briefcase,
    name: "Entreprises & corporate art",
    desc: "L'art en entreprise est un levier RSE mesurable et un outil de motivation. Kucibok gère votre programme d'art interne, de la sélection des œuvres à la rotation dans vos bureaux, avec un reporting complet pour vos équipes RSE.",
    features: [
      "Programme d'art interne clé en main",
      "Rotation d'œuvres entre sites de l'entreprise",
      "Valorisation RSE avec indicateurs d'impact mesurables",
      "Accès à un catalogue cuité d'artistes africains émergents",
      "Dashboard multi-sites pour les équipes RH",
    ],
    color: "border-purple-700/60",
    iconBg: "bg-purple-900/20",
    iconColor: "text-purple-400",
  },
  {
    icon: Award,
    name: "Fondations & institutions",
    desc: "Pour les musées, centres culturels et fondations, Kucibok offre une solution de catalogage institutionnel certifié, avec accès chercheurs, conservation numérique haute résolution et connexion directe aux galeries partenaires.",
    features: [
      "Catalogue institutionnel certifié accessible en ligne",
      "Accès chercheurs avec droits granulaires",
      "Conservation numérique haute résolution (300 DPI+)",
      "Accès B2B aux galeries et marchands partenaires",
      "Conformité UNESCO et conventions culturelles internationales",
    ],
    color: "border-amber-700/40",
    iconBg: "bg-amber-900/20",
    iconColor: "text-amber-400",
  },
]

const enterpriseFeatures = [
  {
    icon: Globe,
    title: "White-label",
    desc: "Votre marque, notre infrastructure. Interface 100% personnalisable aux couleurs de votre organisation.",
    tag: "Branding",
  },
  {
    icon: Zap,
    title: "API complète",
    desc: "REST API documentée + webhooks pour synchroniser vos systèmes existants en temps réel.",
    tag: "Intégration",
  },
  {
    icon: Users,
    title: "Multi-utilisateurs",
    desc: "Rôles granulaires : administrateur, conservateur, visualisateur, acheteur. Jusqu'à 500 comptes.",
    tag: "Gouvernance",
  },
  {
    icon: FileText,
    title: "Rapports PDF auto",
    desc: "Bilans annuels, états de collection, expertises : générés automatiquement, téléchargeables en PDF.",
    tag: "Reporting",
  },
  {
    icon: Server,
    title: "Intégration ERP/CRM",
    desc: "Connecteurs natifs pour SAP, Salesforce, HubSpot, Oracle NetSuite. Synchronisation bidirectionnelle.",
    tag: "Connectivité",
  },
  {
    icon: Shield,
    title: "SLA garanti",
    desc: "99,9% d'uptime contractuel. Support dédié 24/7 avec temps de réponse garanti sous 2h.",
    tag: "Fiabilité",
  },
  {
    icon: Award,
    title: "Formation équipes",
    desc: "Programme de certification Kucibok pour vos équipes : gestion de collection, logistique, certification.",
    tag: "Formation",
  },
  {
    icon: Briefcase,
    title: "Manager dédié",
    desc: "Un expert Kucibok attitré à votre organisation. Point de contact unique, disponible 5j/7.",
    tag: "Support",
  },
]

const roiPoints = [
  {
    stat: "+20–40%",
    label: "Valeur assurée augmentée",
    desc: "La certification blockchain augmente la valeur assurable de votre collection auprès des compagnies d'assurance, qui reconnaissent le certificat Kucibok.",
    icon: TrendingUp,
    color: "text-green-400",
    bg: "bg-green-900/20",
  },
  {
    stat: "RSE mesurable",
    label: "Valorisation de marque",
    desc: "Un programme d'art d'entreprise certifié génère des indicateurs d'impact culturel tangibles pour vos rapports extra-financiers (CSRD, GRI).",
    icon: Award,
    color: "text-indigo-400",
    bg: "bg-indigo-900/20",
  },
  {
    stat: "–60%",
    label: "Économies sur les expertises",
    desc: "La certification automatique par blockchain réduit drastiquement le coût des expertises manuelles répétées, notamment lors des changements de propriétaire ou de renouvellement d'assurance.",
    icon: BarChart2,
    color: "text-purple-400",
    bg: "bg-purple-900/20",
  },
  {
    stat: "100% auto",
    label: "Conformité douanière",
    desc: "Les documents d'export et d'import sont générés automatiquement selon la réglementation de chaque pays, éliminant les erreurs et les retards administratifs.",
    icon: FileText,
    color: "text-amber-400",
    bg: "bg-amber-900/20",
  },
]

const caseStudies = [
  {
    client: "Hôtel Pullman Dakar",
    sector: "Hospitalité",
    icon: Building2,
    highlight: "200+ œuvres gérées",
    story: "Le Pullman Dakar a confié à Kucibok Enterprise la gestion de sa collection d'art africain contemporain répartie dans 14 espaces — lobby, restaurant, suites présidentielles. Grâce à notre plateforme, l'hôtel organise désormais 3 rotations d'œuvres par an, offrant une expérience renouvelée à ses clients et renforçant sa position de lieu culturel de référence à Dakar.",
    results: ["200+ œuvres cataloguées et certifiées", "3 rotations annuelles planifiées", "Valeur assurée augmentée de 35%", "Partenariats avec 12 artistes sénégalais"],
    color: "border-indigo-700/40",
  },
  {
    client: "TotalEnergies Foundation",
    sector: "Corporate Art",
    icon: Briefcase,
    highlight: "5 000 employés concernés",
    story: "TotalEnergies Foundation a déployé Kucibok Enterprise pour son programme d'art corporate couvrant 5 sites africains (Dakar, Abidjan, Lagos, Libreville, Douala). Le programme génère des rapports d'impact RSE trimestriels automatiques et permet à chaque site de gérer localement ses acquisitions dans un cadre global certifié.",
    results: ["5 sites connectés sur 3 pays", "Rapport RSE automatisé chaque trimestre", "120+ artistes africains soutenus", "Économie de 65% sur les expertises manuelles"],
    color: "border-purple-700/40",
  },
  {
    client: "Musée de l'IFAN",
    sector: "Institution culturelle",
    icon: Award,
    highlight: "3 000 pièces cataloguées",
    story: "L'Institut Fondamental d'Afrique Noire a digitalisé 3 000 pièces ethnographiques de sa collection permanente via Kucibok Enterprise. Le catalogue numérique, accessible aux chercheurs du monde entier avec des droits d'accès granulaires, a multiplié par 8 les demandes de consultation académique et généré de nouvelles collaborations avec des musées européens.",
    results: ["3 000 pièces cataloguées haute résolution", "× 8 consultations académiques", "Accès chercheurs depuis 23 pays", "4 nouvelles collaborations internationales"],
    color: "border-amber-700/40",
  },
]

// ─── Main Page ─────────────────────────────────────────────────────────────────

/**
 * Page Enterprise & Institutions du portail Global.
 * Route : /global/enterprise
 * Standalone — header et footer inclus.
 * Absorbe également le contenu de /global/for-institutions.
 *
 * @returns {JSX.Element}
 */
export default function GlobalEnterprise() {
  useEffect(() => { window.scrollTo(0, 0) }, [])

  return (
    <div className="min-h-screen bg-[#0d0f14] text-white">
      <GlobalHeader />

      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-24 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/30 via-[#0d0f14] to-indigo-950/30 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <span className="flex items-center gap-2 bg-purple-900/30 border border-purple-700/40 text-purple-300 text-sm px-4 py-1.5 rounded-full font-medium">
              <Building2 className="w-3.5 h-3.5" /> Enterprise
            </span>
          </div>

          <h1 className="font-playfair text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            L'art d'entreprise,{" "}
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">
              géré à l'échelle
            </span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Kucibok Enterprise offre aux hôtels, fondations et entreprises une solution clé en main
            pour gérer, certifier et renouveler leurs collections d'art.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/contact"
              className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Demander une démo <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact#brochure"
              className="px-7 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white font-medium rounded-md transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Télécharger la brochure
            </Link>
          </div>

          {/* Social proof mini-bar */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-center">
            {[
              { value: "120+", label: "Organisations clientes" },
              { value: "15 000+", label: "Œuvres gérées" },
              { value: "35 pays", label: "Présence internationale" },
            ].map((item, idx) => (
              <div key={idx}>
                <p className="text-2xl font-bold text-indigo-400">{item.value}</p>
                <p className="text-gray-400 text-sm">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0d0f14] to-transparent pointer-events-none" />
      </section>

      {/* ── TARGET PROFILES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Nos clients</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
            Une solution pour chaque organisation
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            Kucibok Enterprise s'adapte aux besoins spécifiques de votre secteur —
            hospitalité, corporate ou institutionnel.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {targetProfiles.map((profile, idx) => (
            <div
              key={idx}
              className={`bg-[#13161e] border-2 ${profile.color} rounded-xl p-7 flex flex-col`}
            >
              <div className={`w-12 h-12 rounded-xl ${profile.iconBg} flex items-center justify-center mb-5`}>
                <profile.icon className={`w-6 h-6 ${profile.iconColor}`} />
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{profile.name}</h3>
              <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{profile.desc}</p>
              <ul className="space-y-2.5">
                {profile.features.map((feat, fi) => (
                  <li key={fi} className="flex items-start gap-2 text-sm text-gray-300">
                    <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 ${profile.iconColor}`} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── ENTERPRISE FEATURES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-purple-400 text-sm font-medium uppercase tracking-wider">Fonctionnalités Enterprise</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
              Une infrastructure à la hauteur de vos ambitions
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Toutes les fonctionnalités dont les grandes organisations ont besoin pour gérer l'art à l'échelle.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {enterpriseFeatures.map((feat, idx) => (
              <div
                key={idx}
                className="bg-[#13161e] border border-gray-800 hover:border-indigo-700/40 rounded-xl p-5 transition-colors group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-lg bg-indigo-900/30 flex items-center justify-center">
                    <feat.icon className="w-4 h-4 text-indigo-400" />
                  </div>
                  <span className="text-xs text-indigo-400 bg-indigo-900/20 border border-indigo-800/40 px-2 py-0.5 rounded-full font-medium">
                    {feat.tag}
                  </span>
                </div>
                <h3 className="text-white font-semibold text-sm mb-2">{feat.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{feat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Retour sur investissement</span>
          <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
            Pourquoi investir dans la gestion d'art certifiée ?
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto">
            La certification blockchain n'est pas seulement un outil d'authenticité.
            C'est un levier financier, juridique et stratégique pour votre organisation.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {roiPoints.map((point, idx) => (
            <div key={idx} className="bg-[#13161e] border border-gray-800 rounded-xl p-7 flex gap-5">
              <div className={`w-12 h-12 rounded-xl ${point.bg} flex items-center justify-center shrink-0`}>
                <point.icon className={`w-6 h-6 ${point.color}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold mb-1 ${point.color}`}>{point.stat}</p>
                <h3 className="text-white font-semibold mb-2">{point.label}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{point.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CASE STUDIES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-900/40">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">Cas d'usage</span>
            <h2 className="font-playfair text-3xl md:text-4xl text-white mt-2 mb-3">
              Ils ont fait confiance à Kucibok Enterprise
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Des organisations de premier plan utilisent Kucibok pour gérer, certifier et valoriser
              leurs collections artistiques à l'échelle africaine et internationale.
            </p>
          </div>

          <div className="space-y-6">
            {caseStudies.map((cs, idx) => (
              <div key={idx} className={`bg-[#13161e] border-l-4 ${cs.color} border-t border-r border-b border-gray-800 rounded-xl overflow-hidden`}>
                <div className="p-7">
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div className="shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center">
                        <cs.icon className="w-6 h-6 text-indigo-400" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <h3 className="text-white font-bold text-lg">{cs.client}</h3>
                        <span className="text-xs text-gray-400 bg-gray-800 border border-gray-700 px-3 py-0.5 rounded-full">
                          {cs.sector}
                        </span>
                        <span className="text-xs text-indigo-300 bg-indigo-900/30 border border-indigo-800/40 px-3 py-0.5 rounded-full font-medium">
                          {cs.highlight}
                        </span>
                      </div>
                      <p className="text-gray-400 text-sm leading-relaxed mb-5">{cs.story}</p>
                      <div className="grid sm:grid-cols-2 gap-2">
                        {cs.results.map((result, ri) => (
                          <div key={ri} className="flex items-center gap-2 text-sm text-gray-300">
                            <Check className="w-4 h-4 text-green-400 shrink-0" />
                            {result}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            * Les cas d'usage présentés sont représentatifs du type de projets gérés par Kucibok Enterprise.
          </p>
        </div>
      </section>

      {/* ── CTA FINAL ── */}
      <section className="py-24 px-4 bg-gradient-to-br from-purple-950/30 via-[#0d0f14] to-indigo-950/40">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-900/50 to-purple-900/50 border border-indigo-700/40 flex items-center justify-center mx-auto mb-8">
            <Building2 className="w-8 h-8 text-indigo-400" />
          </div>

          <h2 className="font-playfair text-3xl md:text-5xl text-white mb-4 leading-tight">
            Planifier une{" "}
            <span className="bg-gradient-to-tr from-indigo-400 via-fuchsia-400 to-yellow-400 bg-clip-text text-transparent">
              démonstration
            </span>
          </h2>

          <p className="text-gray-400 mb-8 text-lg leading-relaxed max-w-xl mx-auto">
            Notre équipe Enterprise vous présente une démonstration personnalisée de la plateforme,
            adaptée à la taille et aux besoins spécifiques de votre organisation.
            Réponse garantie sous 24h ouvrables.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-8">
            <Link
              to="/contact"
              className="px-8 py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 text-white font-semibold rounded-md transition flex items-center gap-2"
            >
              Planifier une démonstration <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/contact#brochure"
              className="px-8 py-3.5 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Brochure Enterprise (PDF)
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-sm text-gray-500">
            {[
              "Démo 100% gratuite et sans engagement",
              "Réponse sous 24h ouvrables",
              "Manager dédié dès le premier contact",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-green-400" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      <GlobalFooter />
    </div>
  )
}
