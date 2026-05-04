import PageWrapper from './PageWrapper'
import PageHeader from './PageHeader'

/**
 * Shared wrapper for legal pages (Privacy, Terms, Sales, Ethics).
 * Provides consistent header, content container, and section styling.
 *
 * @param {object} props
 * @param {string} props.label - Monospace label (e.g. "CONFIDENTIALITE")
 * @param {string} props.title - Page heading
 * @param {string} [props.subtitle] - Optional subtitle
 * @param {React.ReactNode} props.children - Legal content sections
 * @returns {JSX.Element}
 */
export default function LegalPage({ label, title, subtitle, children }) {
  return (
    <PageWrapper>
      <PageHeader label={label} title={title} subtitle={subtitle} />
      <main className="px-[clamp(24px,5vw,80px)] py-12">
        <div className="max-w-4xl mx-auto space-y-8">{children}</div>
      </main>
    </PageWrapper>
  )
}

/**
 * Section card for legal content.
 * Provides the standard ardoise card with border and heading.
 *
 * @param {object} props
 * @param {string} [props.title] - Section heading
 * @param {React.ReactNode} props.children - Section content
 * @param {string} [props.className=''] - Additional CSS classes
 * @returns {JSX.Element}
 */
export function LegalSection({ title, children, className = '' }) {
  return (
    <section className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-6 ${className}`}>
      {title && <h2 className="font-playfair text-xl font-semibold text-white mb-4">{title}</h2>}
      <div className="text-kcb-sable text-sm leading-relaxed space-y-3">{children}</div>
    </section>
  )
}

/**
 * Highlight box inside a legal section (e.g. important notices).
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Content
 * @returns {JSX.Element}
 */
export function LegalHighlight({ children }) {
  return (
    <div className="border-l-2 border-kcb-or bg-kcb-noir/50 rounded-r-[4px] p-4 text-kcb-sable text-sm leading-relaxed">
      {children}
    </div>
  )
}
