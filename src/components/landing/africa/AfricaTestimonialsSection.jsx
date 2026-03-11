import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"

const TESTIMONIALS = [
  { quote: "Avant Kucibok, envoyer une oeuvre a Paris etait un cauchemar administratif. Aujourd'hui, je certifie, j'expedie, je suis livre. En confiance.", author: "Moussa Diallo", role: "Sculpteur, Dakar", featured: true },
  { quote: "Le certificat KCB a change la perception de mes oeuvres aupres des galeries europeennes.", author: "Aisha Traore", role: "Peintre, Abidjan" },
  { quote: "Mon installation de 120kg est arrivee intacte a Bruxelles. Logistique impeccable.", author: "Koffi Mensah", role: "Artiste multimedia, Accra" },
]

/**
 * Testimonials section with ivory background for Africa portal.
 */
export default function AfricaTestimonialsSection() {
  return (
    <section id="testimonials" className="py-36 bg-kcb-ivoire text-kcb-noir">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <RevealOnScroll>
          <div className="mb-20">
            <div className="font-jetbrains text-[10px] tracking-[0.25em] uppercase text-kcb-bronze inline-flex items-center gap-4">
              <span className="block w-12 h-px bg-kcb-bronze" />
              Temoignages
            </div>
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-kcb-noir mt-6">
              Ils font confiance au standard
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-[1.3fr_1fr] gap-0.5">
          {TESTIMONIALS.map((t, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <div className={`bg-white p-10 lg:p-12 ${t.featured ? "lg:row-span-2 flex flex-col justify-center" : ""}`}>
                <blockquote className={`font-playfair italic leading-snug text-kcb-noir mb-7 ${t.featured ? "text-2xl" : "text-lg"}`}>
                  <span className="block font-playfair text-5xl text-kcb-or leading-[0.6] mb-4 not-italic">&ldquo;</span>
                  {t.quote}
                </blockquote>
                <div className="font-semibold text-[13px]">{t.author}</div>
                <div className="text-xs text-kcb-pierre mt-0.5">{t.role}</div>
              </div>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
