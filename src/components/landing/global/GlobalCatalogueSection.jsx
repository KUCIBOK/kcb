import { Link } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { globalT } from "../../../i18n/global"

const ITEMS = [
  { title: "Memoires du Sahel", artist: "Ousmane Ndiaye", id: "KCB-20260087", bgStyle: "repeating-linear-gradient(45deg, var(--kcb-silver-dark) 0px, var(--kcb-silver-dark) 1px, transparent 1px, transparent 16px), var(--kcb-ardoise)" },
  { title: "L'Architecte Invisible", artist: "Yao Kouame", id: "KCB-20260201", bgStyle: "radial-gradient(circle at 40% 40%, var(--kcb-silver-dark) 0%, transparent 60%), var(--kcb-ardoise)" },
  { title: "Terre Rouge III", artist: "Fatoumata Keita", id: "KCB-20260134", bgStyle: "repeating-conic-gradient(var(--kcb-silver-dark) 0% 25%, transparent 0% 50%) 0 0 / 32px 32px, var(--kcb-ardoise)" },
  { title: "Passage Nocturne", artist: "Amina Bah", id: "KCB-20260178", bgStyle: "linear-gradient(160deg, var(--kcb-silver-dark) 0%, var(--kcb-noir) 100%)" },
]

/**
 * Catalogue grid for Global portal showing 4 certified artworks.
 */
export default function GlobalCatalogueSection() {
  const { lang } = useLang()
  const t = globalT[lang].catalogue

  return (
    <section id="catalogue" className="py-36 bg-kcb-noir-deep">
      <div className="max-w-[1280px] mx-auto px-[clamp(24px,5vw,80px)]">
        <div className="flex justify-between items-end mb-20 flex-wrap gap-6">
          <RevealOnScroll>
            <SectionLabel text={t.label} />
            <h2 className="font-playfair font-bold text-[clamp(28px,3vw,40px)] text-white mt-6">
              {t.title}
            </h2>
          </RevealOnScroll>
          <RevealOnScroll>
            <Link to="/explore" className="inline-flex items-center gap-1.5 text-kcb-pierre font-dm-sans font-medium text-xs tracking-[0.05em] uppercase transition-colors hover:text-[var(--accent)] no-underline">
              {t.linkLabel} <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </RevealOnScroll>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1.4fr_1fr_1fr] gap-0.5" style={{ gridAutoRows: "340px" }}>
          {ITEMS.map((item, i) => (
            <RevealOnScroll key={i} delay={i * 0.1}>
              <Link to="/explore" className="block relative overflow-hidden cursor-pointer bg-kcb-noir h-full group no-underline">
                {/* Pattern background */}
                <div
                  className="absolute inset-0 opacity-15 transition-all duration-[800ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06] group-hover:opacity-25"
                  style={{ background: item.bgStyle }}
                />
                {/* Info overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-7 transition-all duration-400 group-hover:[background:linear-gradient(to_top,rgba(5,5,5,0.96)_0%,rgba(5,5,5,0.2)_60%)]"
                  style={{ background: "linear-gradient(to top, rgba(5,5,5,0.92) 0%, transparent 50%)" }}
                >
                  <span className="inline-block w-fit bg-[var(--accent)] text-kcb-noir-deep font-dm-sans font-semibold text-[9px] tracking-[0.1em] uppercase px-2 py-0.5 mb-2.5">Certified</span>
                  <div className="font-playfair font-semibold text-[17px] text-white mb-1">{item.title}</div>
                  <div className="text-xs text-kcb-sable">{item.artist}</div>
                  <div className="font-jetbrains text-[10px] text-[var(--accent)] mt-2 tracking-[0.06em]">{item.id}</div>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
