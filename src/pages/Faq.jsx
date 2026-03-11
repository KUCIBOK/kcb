import { useState } from "react"
import { Link } from "react-router-dom"
import { Palette, Users, ShieldCheck, ShoppingBag, ArrowRight } from "lucide-react"
import PortalLayout from "../components/landing/PortalLayout"
import RevealOnScroll from "../components/landing/RevealOnScroll"
import SectionLabel from "../components/landing/SectionLabel"
import GeoLine from "../components/landing/GeoLine"
import FaqTabs from "../components/faq/FaqTabs"
import Accordions from "../components/faq/Accordions"
import { faqs } from "../components/faq/FaqTabs"

/** Steps for the "How it works" section. */
const STEPS = [
  {
    icon: "M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4-4v2M13 7a4 4 0 11-8 0 4 4 0 018 0zM20 8v6M23 11h-6",
    title: "Inscription",
    description:
      "Creez votre compte et choisissez votre role : artiste, collectionneur ou professionnel.",
    footer:
      "L'inscription est gratuite et vous permet d'acceder a toutes les fonctionnalites de base de la plateforme.",
  },
  {
    icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
    title: "Creation et soumission",
    description:
      "Les artistes creent et soumettent leurs oeuvres d'art pour validation.",
    footer:
      "Chaque oeuvre est examinee par notre equipe pour garantir la qualite et l'authenticite.",
  },
  {
    icon: "M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0",
    title: "Achat et collection",
    description:
      "Decouvrez et achetez des oeuvres d'art africaines uniques.",
    footer:
      "Tous les achats sont securises et vous recevez un certificat d'authenticite numerique.",
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",
    title: "Certification",
    description:
      "Chaque oeuvre est certifiee et vous recevez un certificat d'authenticite blockchain.",
    footer:
      "Vos oeuvres sont protegees par la technologie blockchain pour garantir leur provenance.",
  },
]

/**
 * FAQ page — how it works + tabbed Q&A.
 * Standalone route using PortalLayout with Africa (gold) theme.
 *
 * @returns {JSX.Element}
 */
export default function Faq() {
  const [currentTab, setCurrentTab] = useState("general")

  return (
    <PortalLayout portal="africa">
      {/* ── HERO ── */}
      <section className="pt-40 pb-20 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] border border-kcb-or/[0.02] pointer-events-none rotate-45" />

        <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <SectionLabel text="FAQ" />
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <h1 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] text-white mt-6 mb-5 leading-tight">
              Questions{" "}
              <em className="italic text-[var(--accent)]">frequentes</em>
            </h1>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <p className="text-[15px] text-kcb-pierre max-w-[540px] mx-auto leading-relaxed">
              Trouvez toutes les reponses a vos questions sur Kucibok
            </p>
          </RevealOnScroll>
        </div>
      </section>

      <GeoLine />

      {/* ── HOW IT WORKS ── */}
      <section className="py-36 bg-kcb-noir-deep">
        <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <div className="mb-20">
            <RevealOnScroll>
              <SectionLabel text="Comment ca marche" />
              <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-3">
                Quatre etapes simples
              </h2>
              <p className="text-[13px] text-kcb-pierre max-w-[460px]">
                Decouvrez comment Kucibok revolutionne le marche de l'art africain
              </p>
            </RevealOnScroll>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0.5">
            {STEPS.map((step, i) => (
              <RevealOnScroll key={i} delay={Math.min(i, 3) * 0.1}>
                <div className="bg-kcb-noir p-9 relative overflow-hidden group transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1 h-full flex flex-col">
                  {/* Top accent line on hover */}
                  <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />

                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-10 h-10 border border-kcb-or/15 flex items-center justify-center text-[var(--accent)]">
                      <svg
                        width="18"
                        height="18"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <path
                          d={step.icon}
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <span className="font-jetbrains text-[10px] text-[var(--accent)] tracking-[0.2em]">
                      0{i + 1}
                    </span>
                  </div>

                  <h3 className="font-playfair font-semibold text-lg text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-[13px] leading-[1.7] text-kcb-pierre mb-6">
                    {step.description}
                  </p>

                  <div className="mt-auto pt-6 border-t border-white/[0.04]">
                    <p className="text-[11px] leading-[1.6] text-kcb-pierre/70">
                      {step.footer}
                    </p>
                  </div>
                </div>
              </RevealOnScroll>
            ))}
          </div>

          <RevealOnScroll delay={0.3}>
            <div className="flex justify-center mt-16">
              <Link
                to="/sign-up"
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline"
              >
                Commencer maintenant <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <GeoLine />

      {/* ── FAQ TABS + ACCORDIONS ── */}
      <section className="py-36 bg-kcb-noir-deep">
        <div className="max-w-[900px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <div className="text-center mb-16">
              <SectionLabel text="Reponses" />
              <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6">
                Trouvez votre reponse
              </h2>
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="mb-10">
              <FaqTabs onChange={setCurrentTab} />
            </div>
          </RevealOnScroll>

          <RevealOnScroll delay={0.2}>
            <div className="bg-kcb-noir border border-white/[0.06] p-8 md:p-10">
              <Accordions faqs={faqs[currentTab]} />
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <GeoLine />

      {/* ── CTA ── */}
      <section className="py-40 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] border border-kcb-or/[0.03] pointer-events-none" />

        <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
          <RevealOnScroll>
            <h2 className="font-playfair font-bold text-[clamp(32px,4vw,52px)] mb-5">
              Encore des questions ?
            </h2>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <p className="text-[15px] text-kcb-pierre mb-12 max-w-[460px] mx-auto">
              Notre equipe est disponible pour vous accompagner. N'hesitez pas a
              nous contacter directement.
            </p>
          </RevealOnScroll>
          <RevealOnScroll delay={0.2}>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline"
              >
                Nous contacter <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 bg-transparent text-[var(--accent)] font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 border border-[var(--accent)] transition-all hover:bg-[var(--accent)] hover:text-kcb-noir no-underline"
              >
                A propos de Kucibok
              </Link>
            </div>
          </RevealOnScroll>
        </div>
      </section>
    </PortalLayout>
  )
}
