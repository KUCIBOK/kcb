/**
 * Common wrapper for all KCB Layout-hosted pages.
 * Provides consistent background, typography, and optional grain texture.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children - Page content
 * @param {string} [props.className=''] - Additional CSS classes
 * @param {boolean} [props.grain=false] - Enable subtle grain texture overlay
 * @returns {JSX.Element}
 */
export default function PageWrapper({ children, className = '', grain = false }) {
  return (
    <div className={`bg-kcb-noir-deep min-h-screen text-white font-dm-sans ${className}`}>
      {grain && <div className="grain-overlay pointer-events-none fixed inset-0 z-0" />}
      <div className={grain ? 'relative z-10' : ''}>
        {children}
      </div>
    </div>
  )
}
