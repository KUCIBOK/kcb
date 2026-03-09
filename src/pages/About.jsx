import { useEffect } from "react"
import { Link } from "react-router-dom"
import { ShieldCheck, Globe, Lightbulb, Heart, ArrowRight, Check } from "lucide-react"

/** Mission badge shown in the hero. */
function MissionBadge() {
  return (
    <div className="inline-flex items-center gap-2 bg-indigo-900/40 border border-indigo-700/40 text-indigo-300 text-sm px-4 py-1.5 rounded-full font-medium mb-6">
      <div className="w-2 h-2 rounded-full bg-indigo-400" />
      Notre mission
    </div>
  )
}

/**
 * Stat card displayed in the stats row.
 *
 * @param {{ value: string, label: string }} props
 */
function StatCard({ value, label }) {
  return (
    <div className="bg-gray-800/60 border border-gray-700 rounded-xl p-5 text-center">
      <p className="text-3xl font-bold text-indigo-400 mb-1">{value}</p>
      <p className="text-gray-400 text-xs">{label}</p>
    </div>
  )
}

/** Static data — values, stats, team. */
const VALUES = [
  {
    icon: ShieldCheck,
    color: "bg-indigo-500/10 text-indigo-400",
    title: "Authenticité",
    description:
      "Chaque œuvre est vérifiée par nos experts et certifiée sur la blockchain. L'authenticité n'est pas une option, c'est notre fondation.",
  },
  {
    icon: Heart,
    color: "bg-amber-500/10 text-amber-400",
    title: "Équité",
    description:
      "Nous construisons un marché transparent où les artistes africains sont rémunérés justement et les collectionneurs investissent en toute confiance.",
  },
  {
    icon: Lightbulb,
    color: "bg-purple-500/10 text-purple-400",
    title: "Innovation",
    description:
      "La blockchain, le NFC et la numérisation haute résolution sont au service du patrimoine culturel — pas l'inverse.",
  },
  {
    icon: Globe,
    color: "bg-green-500/10 text-green-400",
    title: "Patrimoine",
    description:
      "L'art africain primitif et contemporain mérite d'être connu, préservé et valorisé à l'échelle mondiale pour les générations futures.",
  },
]

const STATS = [
  { value: "500+", label: "Artistes africains" },
  { value: "2 000+", label: "Œuvres certifiées" },
  { value: "12", label: "Pays d'Afrique" },
  { value: "50+", label: "Collectionneurs actifs" },
]

const TEAM = [
  {
    name: "Moctar Sidibé",
    role: "Co-Founder & CEO",
    image: "/images/team/MoctarSidibe.jpeg",
  },
  {
    name: "Curtis Zirignon",
    role: "Co-Founder & CFO",
    image: "/images/team/CurtisZirignon.jpeg",
  },
]

const VISION_POINTS = [
  "Certification blockchain de provenance pour chaque œuvre",
  "Artistes africains au cœur de la plateforme",
  "Préservation du patrimoine culturel africain",
  "Marché équitable, transparent et mondial",
]

/**
 * About page — mission, vision, values, team, CTA.
 * Wrapped in Layout (main nav + footer provided by parent).
 *
 * @returns {JSX.Element}
 */
export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden py-20 px-4 md:px-6 lg:px-8">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/40 via-gray-900 to-purple-950/20 pointer-events-none" />
        <div className="relative max-w-4xl mx-auto text-center">
          <MissionBadge />
          <h1 className="font-playfair text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Renforcer la créativité<br />
            <span className="text-indigo-400">africaine</span>
          </h1>
          <p className="text-gray-300 text-xl max-w-2xl mx-auto leading-relaxed">
            Nous comblons le fossé entre les artistes africains et le marché mondial — grâce à la blockchain, la certification et une infrastructure digitale de confiance.
          </p>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-gray-900 to-transparent pointer-events-none" />
      </section>

      {/* ── VISION ── */}
      <section className="py-16 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text */}
          <div>
            <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
              Notre vision
            </span>
            <h2 className="font-playfair text-4xl text-white mt-3 mb-5">
              Préserver l'âme de l'Afrique,<br />
              <span className="text-indigo-400">une œuvre à la fois</span>
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              KUCIBOK a été fondée avec une vision claire : créer une plateforme dédiée où les artistes africains peuvent présenter leur travail à un public mondial tout en conservant la propriété et le contrôle de leurs actifs créatifs.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              L'art africain primitif est l'un des patrimoines les plus riches et les plus fragiles de l'humanité. Des masques Dogon du Mali aux bronzes royaux du Bénin, ces œuvres portent des siècles de culture, de spiritualité et d'histoire. Nous construisons le gardien numérique de ce patrimoine.
            </p>
            <div className="space-y-2.5">
              {VISION_POINTS.map((point, i) => (
                <div key={i} className="flex items-start gap-2.5 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                  {point}
                </div>
              ))}
            </div>
          </div>

          {/* Image */}
          <div className="rounded-2xl overflow-hidden border border-gray-800 rotate-1 hover:rotate-0 transition-transform duration-300">
            <img
              loading="lazy"
              src="/images/homepage/collector-hero.jpeg"
              alt="Collection d'art africain"
              className="w-full h-80 object-cover"
            />
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-10 px-4 md:px-6 lg:px-8 bg-gray-800/20 border-y border-gray-800">
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATS.map((s, i) => (
            <StatCard key={i} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── VALUES ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-14">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
            Nos valeurs
          </span>
          <h2 className="font-playfair text-4xl text-white mt-3 mb-3">
            Ce qui nous guide
          </h2>
          <p className="text-gray-400 text-sm">
            Ces principes fondamentaux guident chaque décision que nous prenons chez Kucibok.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <div
              key={i}
              className="bg-gray-800/50 border border-gray-700 hover:border-indigo-700/40 rounded-xl p-6 text-center transition-colors"
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4 ${v.color}`}>
                <v.icon className="w-6 h-6" />
              </div>
              <h3 className="text-white font-semibold text-lg mb-2">{v.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{v.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-gray-800/20 border-t border-gray-800">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-indigo-400 text-sm font-medium uppercase tracking-wider">
            L'équipe
          </span>
          <h2 className="font-playfair text-4xl text-white mt-3 mb-3">
            Les fondateurs
          </h2>
          <p className="text-gray-400 text-sm mb-12">
            Rencontrez les personnes passionnées derrière Kucibok.
          </p>

          <div className="grid md:grid-cols-2 gap-10">
            {TEAM.map((member, i) => (
              <div
                key={i}
                className="bg-gray-800/60 border border-gray-700 rounded-2xl p-8 flex flex-col items-center gap-4"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-28 h-28 object-cover rounded-full border-2 border-indigo-700/50"
                />
                <div>
                  <h3 className="text-white font-semibold text-lg">{member.name}</h3>
                  <p className="text-indigo-400 text-sm mt-0.5">{member.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-20 px-4 md:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto bg-gradient-to-br from-indigo-950/60 to-purple-950/40 border border-indigo-800/40 rounded-2xl p-10 md:p-14 text-center">
          <h2 className="font-playfair text-4xl text-white mb-4">
            Rejoindre la communauté
          </h2>
          <p className="text-gray-300 text-sm mb-8 max-w-md mx-auto leading-relaxed">
            Que vous soyez artiste, collectionneur ou passionné d'art africain, nous vous invitons à faire partie de notre communauté grandissante.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/sign-up"
              className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold rounded-md transition"
            >
              Créer un compte <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/artists"
              className="px-6 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition"
            >
              Voir les artistes
            </Link>
            <Link
              to="/contact"
              className="px-6 py-3 bg-gray-800 border border-gray-700 hover:bg-gray-700 text-white rounded-md transition"
            >
              Contactez-nous
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
