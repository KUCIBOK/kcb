import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import RevealOnScroll from './RevealOnScroll'
import SectionLabel from './SectionLabel'

/**
 * Shared hero layout for portal landing pages.
 * Left side: label, title, subtitle, CTAs. Right side: children (Kuzi or Showcase).
 * @param {object} props
 * @param {string} props.label - Section label text
 * @param {React.ReactNode} props.title - Hero title JSX
 * @param {string} props.subtitle - Subtitle text
 * @param {{text: string, to?: string, onClick?: Function, primary?: boolean}[]} props.actions - CTA buttons
 * @param {React.ReactNode} props.children - Right-side content
 */
export default function PortalHero({ label, title, subtitle, actions = [], children }) {
  return (
    <section className="relative overflow-visible pt-20 lg:pt-36 pb-0">
      {/* Subtle vertical lines */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, var(--accent) 0px, var(--accent) 1px, transparent 1px, transparent 120px)',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 40% 40% at 75% 25%, color-mix(in srgb, var(--accent) 3%, transparent), transparent 60%)',
        }}
      />

      <div className="relative z-[1] max-w-[1280px] mx-auto px-[clamp(16px,5vw,80px)]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-start">
          <div>
            <RevealOnScroll>
              <SectionLabel text={label} />
            </RevealOnScroll>
            <RevealOnScroll delay={0.1}>
              <h1 className="font-playfair font-black text-[clamp(32px,5.5vw,72px)] leading-none tracking-tight mb-5 lg:mb-7 mt-4">
                {title}
              </h1>
            </RevealOnScroll>
            <RevealOnScroll delay={0.2}>
              <p className="text-sm lg:text-base font-light leading-[1.8] text-kcb-pierre max-w-[460px] mb-8 lg:mb-12">
                {subtitle}
              </p>
            </RevealOnScroll>
            <RevealOnScroll delay={0.3}>
              <div className="flex gap-3 lg:gap-4 flex-wrap pb-8 lg:pb-24">
                {actions.map((a, i) => {
                  let cls = 'inline-flex items-center gap-2 font-dm-sans font-bold text-xs tracking-[0.1em] uppercase px-7 lg:px-11 py-4 transition-all hover:-translate-y-1 rounded-[4px] border-2'

                  if (a.variant === 'curator') {
                    cls += ' bg-indigo-600 text-white hover:bg-indigo-700 border-indigo-600 hover:border-indigo-700 shadow-lg hover:shadow-indigo-600/40'
                  } else if (a.variant === 'advisor') {
                    cls += ' bg-slate-600 text-white hover:bg-slate-700 border-slate-600 hover:border-slate-700 shadow-lg hover:shadow-slate-600/40'
                  } else if (a.primary) {
                    cls += ' bg-[var(--accent)] text-kcb-noir hover:bg-[var(--accent-dark)] border-[var(--accent)] hover:border-[var(--accent-dark)] shadow-lg hover:shadow-[var(--accent)]/40'
                  } else {
                    cls = 'inline-flex items-center gap-1.5 text-kcb-pierre font-dm-sans font-medium text-xs tracking-[0.05em] uppercase py-2.5 transition-colors hover:text-[var(--accent)]'
                  }

                  const content = (
                    <>
                      {a.text}
                      {(a.primary || a.variant) && <ArrowRight className="w-4 h-4 ml-1" />}
                    </>
                  )
                  if (a.to) {
                    return (
                      <Link key={i} to={a.to} className={cls}>
                        {content}
                      </Link>
                    )
                  }
                  return (
                    <button key={i} onClick={a.onClick} className={cls}>
                      {content}
                    </button>
                  )
                })}
              </div>
            </RevealOnScroll>
          </div>
          <div className="flex justify-center items-end">{children}</div>
        </div>
      </div>
    </section>
  )
}
