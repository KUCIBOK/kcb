import { Helmet } from "react-helmet"
import { Link } from "react-router-dom"
import { ShieldCheck, Globe, Lightbulb, Heart, ArrowRight, Check } from "lucide-react"
import PortalLayout from "../components/landing/PortalLayout"
import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"
import GeoLine from "../components/landing/GeoLine"

/** Static data — values, team, vision points. */
const VALUES = [
  {
    icon: ShieldCheck,
    title: "Authenticite",
    description:
      "Chaque oeuvre est verifiee par nos experts et certifiee sur la blockchain. L'authenticite n'est pas une option, c'est notre fondation.",
  },
  {
    icon: Heart,
    title: "Equite",
    description:
      "Nous construisons un marche transparent ou les artistes africains sont remuneres justement et les collectionneurs investissent en toute confiance.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    description:
      "La blockchain, le NFC et la numerisation haute resolution sont au service du patrimoine culturel — pas l'inverse.",
  },
  {
    icon: Globe,
    title: "Patrimoine",
    description:
      "L'art africain primitif et contemporain merite d'etre connu, preserve et valorise a l'echelle mondiale pour les generations futures.",
  },
]

const TEAM = [
  {
    name: "Moctar Sidibe",
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
  "Certification blockchain de provenance pour chaque oeuvre",
  "Artistes africains au coeur de la plateforme",
  "Preservation du patrimoine culturel africain",
  "Marche equitable, transparent et mondial",
]

/**
 * About page — mission, vision, values, team, CTA.
 * Standalone route using PortalLayout with Africa (gold) theme.
 *
 * @returns {JSX.Element}
 */
export default function About() {
  return (
    <>
    <Helmet>
      <title>À propos — Kucibok Bridge | Infrastructure de l'art africain</title>
      <meta name="description" content="Découvrez Kucibok Bridge — notre mission, nos valeurs et notre vision pour structurer et valoriser le marché de l'art africain à l'échelle mondiale." />
      <meta property="og:title" content="À propos de Kucibok — Infrastructure de l'art africain" />
      <meta property="og:description" content="Notre mission : structurer, certifier et faire circuler l'art africain en toute confiance." />
      <meta property="og:url" content="https://kucibok.com/about" />
      <link rel="canonical" href="https://kucibok.com/about" />
    </Helmet>
    <PortalLayout portal="africa">
      {/* ── HERO — Mission ── */}
      <section className="pt-40 pb-24 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-kcb-or/[0.02] pointer-events-none rotate-45" />

        <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <SectionLabel text="Notre mission" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] text-white mt-6 mb-5 leading-tight">
              Renforcer la creativite{" "}
              <em className="italic text-[var(--accent)]">africaine</em>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-[15px] text-kcb-pierre max-w-[540px] mx-auto leading-relaxed">
              Nous comblons le fosse entre les artistes africains et le marche mondial
              — grace a la blockchain, la certification et une infrastructure digitale
              de confiance.
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <GeoLine />

      {/* ── VISION — 2 colonnes ── */}
      <section className="py-36 bg-kcb-noir-deep">
        <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            {/* Text */}
            <RevealOnScroll>
              <div>
                <SectionLabel text="Notre vision" />
                <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-5">
                  Preserver l'ame de l'Afrique,{" "}
                  <em className="italic text-[var(--accent)]">une oeuvre a la fois</em>
                </h2>
                <p className="text-[13px] text-kcb-pierre leading-[1.8] mb-4">
                  KUCIBOK a ete fondee avec une vision claire : creer une plateforme
                  dediee ou les artistes africains peuvent presenter leur travail a un
                  public mondial tout en conservant la propriete et le controle de leurs
                  actifs creatifs.
                </p>
                <p className="text-[13px] text-kcb-pierre leading-[1.8] mb-8">
                  L'art africain primitif est l'un des patrimoines les plus riches et
                  les plus fragiles de l'humanite. Des masques Dogon du Mali aux
                  bronzes royaux du Benin, ces oeuvres portent des siecles de culture,
                  de spiritualite et d'histoire. Nous construisons le gardien numerique
                  de ce patrimoine.
                </p>
                <div className="space-y-3">
                  {VISION_POINTS.map((point, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 text-[13px] text-kcb-sable"
                    >
                      <Check className="w-4 h-4 text-[var(--accent)] shrink-0 mt-0.5" />
                      {point}
                    </div>
                  ))}
                </div>
              </div>
            </RevealOnScroll>

            {/* Image */}
            <RevealOnScroll delay={0.15}>
              <div className="overflow-hidden border border-white/[0.06] rotate-1 hover:rotate-0 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]">
                <img
                  loading="lazy"
                  src="/images/homepage/collector-hero.jpeg"
                  alt="Collection d'art africain — masques et sculptures traditionnelles"
                  className="w-full h-[420px] object-cover"
                />
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </section>

      {/* ── VALUES — Grille 2x2 ── */}
      <section className="py-36 bg-kcb-noir-deep">
        <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <div className="mb-20">
              <SectionLabel text="Nos valeurs" />
              <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6">
                Ce qui nous guide
              </h2>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {VALUES.map((v, i) => (
              <RevealOnScroll key={i} delay={Math.min(i, 3) * 0.1}>
                <div className="bg-kcb-noir p-9 lg:p-12 relative overflow-hidden group transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <div className="w-10 h-10 border border-kcb-or/15 flex items-center justify-center mb-7 text-[var(--accent)]">
                    <v.icon className="w-[18px] h-[18px]" />
                  </div>
                  <h3 className="font-playfair font-semibold text-lg text-white mb-3">
                    {v.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-kcb-pierre">
                    {v.description}
                  </p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <GeoLine />

      {/* ── TEAM — Fondateurs ── */}
      <section className="py-36 bg-kcb-noir-deep">
        <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <div className="mb-20">
              <SectionLabel text="L'equipe" />
              <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-3">
                Les fondateurs
              </h2>
              <p className="text-[13px] text-kcb-pierre max-w-[400px]">
                Rencontrez les personnes passionnees derriere Kucibok.
              </p>
            </div>
          </RevealOnScroll>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-0.5">
            {TEAM.map((member, i) => (
              <RevealOnScroll key={i} delay={i * 0.1}>
                <div className="bg-kcb-noir p-9 lg:p-12 relative overflow-hidden group transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                  <div className="flex items-center gap-6">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-24 h-24 object-cover rounded-full border-2 border-kcb-or/20"
                    />
                    <div>
                      <h3 className="font-playfair font-semibold text-lg text-white mb-1">
                        {member.name}
                      </h3>
                      <p className="font-jetbrains text-[10px] tracking-[0.15em] uppercase text-[var(--accent)]">
                        {member.role}
                      </p>
                    </div>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      <GeoLine />

      {/* ── CTA — Rejoindre ── */}
      <section className="py-40 text-center relative">
        {/* Decorative border */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-kcb-or/[0.03] pointer-events-none" />

        <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <h2 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] mb-5">
              Rejoindre la communaute
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-[15px] text-kcb-pierre mb-12 max-w-[460px] mx-auto">
              Que vous soyez artiste, collectionneur ou passionne d'art africain, nous
              vous invitons a faire partie de notre communaute grandissante.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline"
              >
                Creer un compte <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/artists"
                className="inline-flex items-center gap-2 bg-transparent text-[var(--accent)] font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 border border-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-kcb-noir no-underline"
              >
                Voir les artistes
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </PortalLayout>
    </>
  )
}
