import SectionLabel from '../landing/SectionLabel'

/**
 * Uniform page header for KCB Layout-hosted pages.
 * Displays a monospace gold label, Playfair title, and optional subtitle.
 *
 * @param {object} props
 * @param {string} props.label - Monospace label text (e.g. "FAQ", "CONTACT")
 * @param {string} props.title - Main heading
 * @param {string} [props.subtitle] - Optional description below the title
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {React.ReactNode} [props.children] - Optional extra content below subtitle
 * @returns {JSX.Element}
 */
export default function PageHeader({ label, title, subtitle, className = '', children }) {
  return (
    <header className={`px-[clamp(24px,5vw,80px)] py-16 border-b border-white/[0.03] ${className}`}>
      <div className="max-w-6xl mx-auto">
        <SectionLabel text={label} />
        <h1 className="mt-5 font-playfair font-bold text-[clamp(28px,3vw,40px)] leading-tight text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-3 text-kcb-sable text-base max-w-2xl leading-relaxed">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </header>
  )
}
