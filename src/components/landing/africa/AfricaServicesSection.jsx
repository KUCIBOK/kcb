import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"

const SERVICES = [
  { title: "Certification KCB", text: "Identifiant unique, certificat PDF, fiche de provenance. Le standard qui fait la difference.", icon: "M10 2L12.5 7.5L18 8.5L14 12.5L15 18L10 15.5L5 18L6 12.5L2 8.5L7.5 7.5L10 2Z" },
  { title: "Portfolio digital", text: "Vitrine professionnelle pour vos oeuvres, visible par les collectionneurs du monde entier.", icon: "M2 4h16v12H2zM2 8h16" },
  { title: "Logistique mondiale", text: "Emballage specialise, transport securise, dedouanement. De votre atelier a la galerie.", icon: "M4 16V7l6-5 6 5v9a1 1 0 01-1 1H5a1 1 0 01-1-1zM8 17v-5h4v5" },
  { title: "Tracking temps reel", text: "Suivez votre oeuvre a chaque etape. Notifications automatiques.", icon: "M10 10a8 8 0 100-16 8 8 0 000 16zM10 6v4l3 3" },
  { title: "Visibilite internationale", text: "Vos oeuvres certifiees sur le Portail Global, accessible aux collectionneurs d'Europe.", icon: "M10 2a8 8 0 100 16 8 8 0 000-16zM2 10h16M10 2c2 2.5 3 5 3 8s-1 5.5-3 8c-2-2.5-3-5-3-8s1-5.5 3-8z" },
  { title: "Paiements securises", text: "PayDunya local, Stripe international. Fonds proteges jusqu'a livraison.", icon: "M14 2H6a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2zM8 14h4M10 6v4" },
]

/**
 * 6-card services grid for Africa portal.
 */
export default function AfricaServicesSection() {
  return (
    <section id="services" className="py-36 bg-kcb-noir-deep">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="flex justify-between items-end mb-20 flex-wrap gap-6">
          <RevealOnScroll>
            <SectionLabel text="Services inclus" />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6">
              Tout ce dont un artiste a besoin
            </h2>
          </RevealOnScroll>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {SERVICES.map((s, i) => (
            <RevealOnScroll key={i} delay={Math.min(i, 3) * 0.1}>
              <div className="bg-kcb-noir p-9 lg:p-12 relative overflow-hidden group transition-transform duration-[400ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-1">
                {/* Top accent line on hover */}
                <div className="absolute top-0 left-0 w-full h-0.5 bg-[var(--accent)] scale-x-0 origin-left transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <div className="w-10 h-10 border border-kcb-or/15 flex items-center justify-center mb-7 text-[var(--accent)]">
                  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                    <path d={s.icon} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="font-playfair font-semibold text-lg text-white mb-3">{s.title}</h3>
                <p className="text-[13px] leading-[1.7] text-kcb-pierre">{s.text}</p>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
