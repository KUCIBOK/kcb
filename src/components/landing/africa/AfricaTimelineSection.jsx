import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"

const STEPS = [
  { num: "ETAPE 01", title: "Creez votre profil artiste", desc: "Bio, parcours artistique, photos d'atelier. Votre identite professionnelle.", duration: "~10 minutes" },
  { num: "ETAPE 02", title: "Enregistrez vos oeuvres", desc: "Photos HD, dimensions, medium. Chaque oeuvre recoit un identifiant KCB.", duration: "~5 min par oeuvre" },
  { num: "ETAPE 03", title: "Certification et validation", desc: "Verification, certificat d'authenticite, fiche de provenance.", duration: "24-48h" },
  { num: "ETAPE 04", title: "Publication et visibilite", desc: "Vos oeuvres certifiees sur le Portail Global. Demandes de collectionneurs.", duration: "Immediat" },
]

/**
 * 4-step onboarding timeline for Africa portal.
 */
export default function AfricaTimelineSection() {
  return (
    <section id="timeline" className="py-36">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 lg:gap-32 items-center">
          <RevealOnScroll>
            <SectionLabel text="Onboarding" />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6 mb-6">
              De l'inscription a la vente en 4 etapes
            </h2>
            <p className="text-[15px] leading-[1.8] text-kcb-pierre mb-10">
              Un parcours simple et structure. Chaque etape vous rapproche de la visibilite internationale.
            </p>
            <Link to="/sign-up" className="inline-flex items-center gap-2 bg-[var(--accent)] text-kcb-noir font-dm-sans font-semibold text-xs tracking-[0.08em] uppercase px-9 py-3.5 transition-all hover:bg-[var(--accent-dark)] hover:-translate-y-px no-underline">
              Commencer maintenant <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col">
              {STEPS.map((step, i) => (
                <div
                  key={i}
                  className="py-6 px-7 flex items-start gap-6 border-l border-kcb-or/[0.08] transition-all hover:border-l-[var(--accent)] hover:bg-kcb-or/[0.02]"
                >
                  <div className="font-jetbrains text-[10px] text-[var(--accent)] tracking-[0.15em] w-14 shrink-0 pt-0.5">
                    {step.num}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-white">{step.title}</div>
                    <div className="text-[13px] text-kcb-pierre mt-1">{step.desc}</div>
                    <div className="font-jetbrains text-[10px] text-kcb-sable mt-1.5 tracking-[0.06em]">{step.duration}</div>
                  </div>
                </div>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  )
}
