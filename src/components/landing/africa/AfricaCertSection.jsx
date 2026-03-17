import { Link } from "react-router-dom"
import RevealOnScroll from "../RevealOnScroll"
import SectionLabel from "../SectionLabel"
import { useLang } from "../../../store/LangContext"
import { africaT } from "../../../i18n/africa"

const CERT_FIELDS = [
  { label: "Artiste", value: "Ibrahim Maïga" },
  { label: "Titre", value: "Harmattan Series #4" },
  { label: "Année", value: "2024" },
  { label: "Technique", value: "Acrylique sur toile" },
  { label: "Dimensions", value: "80 × 60 cm" },
  { label: "Provenance", value: "Dakar, Sénégal" },
]

export default function AfricaCertSection() {
  const { lang } = useLang()
  const t = africaT[lang].cert

  return (
    <section className="py-36 bg-kcb-noir-deep">
      <style>{`
        @keyframes kcb-cert-scan {
          0%   { top: 0%;   opacity: 0.6; }
          95%  { top: 100%; opacity: 0.4; }
          100% { top: 100%; opacity: 0;   }
        }
        @keyframes kcb-cert-pulse {
          0%, 100% { opacity: 1;   }
          50%       { opacity: 0.4; }
        }
      `}</style>

      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* ── Left column — text ─────────────────────────────────────── */}
          <RevealOnScroll>
            <div>
              <SectionLabel text={t.label} />

              <h2 className="font-playfair font-bold text-white text-[clamp(28px,3.5vw,44px)] leading-[1.15] mt-5 mb-5 whitespace-pre-line">
                {t.title}
              </h2>

              <p className="font-dm-sans text-kcb-pierre text-[15px] leading-relaxed mb-8">
                {t.desc}
              </p>

              {/* Bullet points */}
              <ul className="space-y-3 mb-10">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <span
                      className="mt-[3px] flex-shrink-0 font-jetbrains text-[10px] leading-none"
                      style={{ color: "var(--accent)" }}
                    >
                      ◆
                    </span>
                    <span className="font-dm-sans text-[14px] text-white/80 leading-snug">
                      {b}
                    </span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                to="/sign-up?role=artist"
                className="inline-flex items-center gap-2 font-jetbrains text-[11px] tracking-[0.15em] uppercase px-7 py-3.5 transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
                style={{
                  background: "var(--accent)",
                  color: "#000",
                  fontWeight: 600,
                }}
              >
                {t.cta}
              </Link>
            </div>
          </RevealOnScroll>

          {/* ── Right column — certificate mock ────────────────────────── */}
          <RevealOnScroll delay={0.15}>
            <div
              className="relative"
              style={{ animation: "kcb-float-1 4s ease-in-out infinite" }}
            >
              <div
                className="relative overflow-hidden border border-kcb-or/20 p-8"
                style={{
                  background: "linear-gradient(145deg, #0a0d14 0%, #0f1218 100%)",
                  boxShadow:
                    "0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.05), inset 0 1px 0 rgba(201,168,76,0.07)",
                }}
              >
                {/* Watermark */}
                <div
                  className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
                  aria-hidden="true"
                >
                  <span
                    className="font-playfair text-[120px] font-bold leading-none"
                    style={{
                      color: "rgba(201,168,76,0.03)",
                      transform: "rotate(-20deg)",
                      userSelect: "none",
                    }}
                  >
                    KCB
                  </span>
                </div>

                {/* Scan line */}
                <div
                  className="absolute left-0 w-full h-px pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(201,168,76,0.5) 40%, rgba(201,168,76,0.7) 50%, rgba(201,168,76,0.5) 60%, transparent 100%)",
                    animation: "kcb-cert-scan 3.5s linear infinite",
                  }}
                />

                {/* Header */}
                <div className="relative z-10 text-center mb-5">
                  <p
                    className="font-jetbrains text-[8px] tracking-[0.2em] uppercase"
                    style={{ color: "rgba(201,168,76,0.6)" }}
                  >
                    KUCIBOK BRIDGE
                  </p>
                  <p
                    className="font-jetbrains text-[7px] tracking-[0.18em] uppercase mt-0.5"
                    style={{ color: "rgba(201,168,76,0.4)" }}
                  >
                    CERTIFICAT D'AUTHENTICITÉ
                  </p>
                </div>

                {/* Gold separator */}
                <div
                  className="relative z-10 w-full h-px mb-5"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(201,168,76,0.3) 30%, rgba(201,168,76,0.5) 50%, rgba(201,168,76,0.3) 70%, transparent)",
                  }}
                />

                {/* Artwork preview */}
                <div
                  className="relative z-10 w-full mb-5 overflow-hidden"
                  style={{
                    height: "120px",
                    background: "#0d1018",
                    border: "1px solid rgba(201,168,76,0.08)",
                  }}
                >
                  {/* Abstract composition */}
                  <div
                    className="absolute"
                    style={{
                      width: "55%",
                      height: "85%",
                      top: "8%",
                      left: "5%",
                      background: "linear-gradient(135deg, #3d2b10 0%, #2a1c08 100%)",
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      width: "30%",
                      height: "60%",
                      top: "20%",
                      right: "10%",
                      background: "linear-gradient(135deg, #1a2030 0%, #121620 100%)",
                    }}
                  />
                  <div
                    className="absolute"
                    style={{
                      width: "18%",
                      height: "35%",
                      bottom: "12%",
                      left: "40%",
                      background: "rgba(201,168,76,0.12)",
                    }}
                  />
                  {/* Corner mark */}
                  <div
                    className="absolute bottom-2 right-2 font-jetbrains text-[7px]"
                    style={{ color: "rgba(201,168,76,0.3)" }}
                  >
                    KCB VERIFIED
                  </div>
                </div>

                {/* KCB ID */}
                <div className="relative z-10 text-center mb-5">
                  <p
                    className="font-jetbrains text-[7px] tracking-[0.18em] uppercase mb-1"
                    style={{ color: "rgba(201,168,76,0.4)" }}
                  >
                    IDENTIFIANT UNIQUE
                  </p>
                  <p
                    className="font-jetbrains text-xl font-bold tracking-[0.06em]"
                    style={{ color: "var(--accent, #C9A84C)" }}
                  >
                    KCB-8B4F2A1C
                  </p>
                </div>

                {/* Gold separator */}
                <div
                  className="relative z-10 w-full h-px mb-5"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent, rgba(201,168,76,0.15) 30%, rgba(201,168,76,0.25) 50%, rgba(201,168,76,0.15) 70%, transparent)",
                  }}
                />

                {/* Fields grid */}
                <div className="relative z-10 grid grid-cols-2 gap-x-6 gap-y-4 mb-6">
                  {CERT_FIELDS.map((field) => (
                    <div key={field.label}>
                      <p
                        className="font-jetbrains text-[7px] uppercase tracking-[0.12em] mb-0.5"
                        style={{ color: "rgba(201,168,76,0.4)" }}
                      >
                        {field.label}
                      </p>
                      <p className="font-dm-sans text-[11px] text-white/80 leading-tight">
                        {field.value}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Bottom bar */}
                <div
                  className="relative z-10 flex items-center justify-between pt-4"
                  style={{ borderTop: "1px solid rgba(201,168,76,0.08)" }}
                >
                  <div className="flex items-center gap-1.5">
                    <span
                      className="block w-1.5 h-1.5 rounded-full"
                      style={{
                        background: "#34d399",
                        animation: "kcb-cert-pulse 2s ease-in-out infinite",
                      }}
                    />
                    <span className="font-jetbrains text-[8px] tracking-[0.12em] text-emerald-400">
                      AUTHENTIFIÉ
                    </span>
                  </div>
                  <span
                    className="font-jetbrains text-[8px] tracking-[0.08em]"
                    style={{ color: "rgba(201,168,76,0.35)" }}
                  >
                    14.03.2026
                  </span>
                </div>
              </div>

              {/* Outer glow */}
              <div
                className="absolute -inset-px rounded-[1px] pointer-events-none"
                style={{
                  boxShadow: "0 0 60px rgba(201,168,76,0.06)",
                }}
              />
            </div>
          </RevealOnScroll>

        </div>
      </div>
    </section>
  )
}
