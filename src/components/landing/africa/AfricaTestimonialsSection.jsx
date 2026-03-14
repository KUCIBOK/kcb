import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { africaT } from "../../../i18n/africa"

const TESTIMONIALS = [
  {
    quote: "Avant Kucibok, envoyer une œuvre à Paris, c'était un cauchemar administratif. Aujourd'hui, en 2 clics j'expédie, en 72h le client est livré. En toute confiance. Quel bonheur !",
    author: "Moussa Diallo",
    role: "Sculpteur, Dakar",
    featured: true,
  },
  {
    quote: "Avant, je n'avais aucune visibilité sur mes acheteurs. Avec Kucibok, je gère mon portefeuille client comme un vrai pro : historique des acquisitions, valeur par collectionneur, relances automatiques. Je recommande à chaque artiste qui veut structurer son activité.",
    author: "Aisha Traoré",
    role: "Peintre, Abidjan",
  },
  {
    quote: "J'expédie des sculptures de 80 kg vers l'Europe et le Golfe. Kucibok gère l'emballage sur mesure, les douanes, le tracking. Mes œuvres arrivent intactes — et mes clients le voient en temps réel.",
    author: "Koffi Mensah",
    role: "Sculpteur, Accra",
  },
  {
    quote: "Mon portfolio digital KCB m'a ouvert des portes que je n'imaginais pas. Un collectionneur genevois a scanné le QR code d'une de mes toiles en galerie — le lendemain, il m'écrivait. Le certificat imprimable, c'est ma carte de visite internationale.",
    author: "Gaëtan Rappacioli",
    role: "Artiste peintre, Cotonou",
  },
]

/**
 * Testimonials section with ivory background for Africa portal.
 */
export default function AfricaTestimonialsSection() {
  const { lang } = useLang()
  const t = africaT[lang].testimonials

  return (
    <section id="testimonials" className="py-36 bg-kcb-ivoire text-kcb-noir">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <RevealOnScroll>
          <div className="mb-20">
            <div className="font-jetbrains text-[10px] tracking-[0.25em] uppercase text-kcb-bronze inline-flex items-center gap-4">
              <span className="block w-12 h-px bg-kcb-bronze" />
              {t.sectionLabel}
            </div>
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-kcb-noir mt-6">
              {t.heading}
            </h2>
          </div>
        </RevealOnScroll>

        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-0.5">
          {/* Featured — Moussa, spans 3 rows on the right */}
          <RevealOnScroll delay={0}>
            <div className="bg-white p-10 lg:p-14 flex flex-col justify-center h-full">
              <span className="block font-playfair text-6xl text-kcb-or leading-[0.6] mb-5 not-italic">&ldquo;</span>
              <blockquote className="font-playfair italic text-2xl leading-snug text-kcb-noir mb-8">
                {TESTIMONIALS[0].quote}
              </blockquote>
              <div className="font-semibold text-[13px]">{TESTIMONIALS[0].author}</div>
              <div className="text-xs text-kcb-pierre mt-0.5">{TESTIMONIALS[0].role}</div>
            </div>
          </RevealOnScroll>

          {/* Right column — 3 stacked cards */}
          <div className="flex flex-col gap-0.5">
            {TESTIMONIALS.slice(1).map((t, i) => (
              <RevealOnScroll key={t.author} delay={(i + 1) * 0.1}>
                <div className="bg-white p-8 flex flex-col justify-center h-full">
                  <span className="block font-playfair text-4xl text-kcb-or leading-[0.6] mb-3 not-italic">&ldquo;</span>
                  <blockquote className="font-playfair italic text-[15px] leading-snug text-kcb-noir mb-5">
                    {t.quote}
                  </blockquote>
                  <div className="font-semibold text-[12px]">{t.author}</div>
                  <div className="text-[11px] text-kcb-pierre mt-0.5">{t.role}</div>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
