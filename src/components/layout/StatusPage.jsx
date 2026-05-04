import { Link } from 'react-router-dom'
import { CheckCircle, XCircle, AlertCircle, Info } from 'lucide-react'
import PageWrapper from './PageWrapper'

/** @type {Record<string, {icon: React.ElementType, colorClass: string, bgClass: string}>} */
const VARIANT_MAP = {
  success: { icon: CheckCircle, colorClass: 'text-emerald-400', bgClass: 'bg-emerald-400/10' },
  error: { icon: XCircle, colorClass: 'text-red-400', bgClass: 'bg-red-400/10' },
  warning: { icon: AlertCircle, colorClass: 'text-kcb-or', bgClass: 'bg-kcb-or/10' },
  info: { icon: Info, colorClass: 'text-kcb-or', bgClass: 'bg-kcb-or/10' },
}

/**
 * Template for status/confirmation pages (success, error, info, warning).
 * Centers a card with icon, title, message, optional detail rows, and action buttons.
 *
 * @param {object} props
 * @param {'success'|'error'|'warning'|'info'} [props.variant='info'] - Visual variant
 * @param {React.ElementType} [props.icon] - Override icon component
 * @param {string} props.title - Page heading
 * @param {string|React.ReactNode} props.message - Description text
 * @param {Array<{label: string, value: string}>} [props.details] - Key-value detail rows
 * @param {Array<{label: string, to?: string, href?: string, onClick?: Function, variant?: 'primary'|'secondary'}>} [props.actions] - Action buttons
 * @param {React.ReactNode} [props.children] - Extra content below actions
 * @returns {JSX.Element}
 */
export default function StatusPage({
  variant = 'info',
  icon: IconOverride,
  title,
  message,
  details,
  actions,
  children,
}) {
  const config = VARIANT_MAP[variant] || VARIANT_MAP.info
  const Icon = IconOverride || config.icon

  return (
    <PageWrapper className="flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        <div className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] p-8 text-center">
          {/* Icon */}
          <div
            className={`mx-auto w-16 h-16 rounded-full ${config.bgClass} flex items-center justify-center mb-6`}
          >
            <Icon className={`w-8 h-8 ${config.colorClass}`} />
          </div>

          {/* Title */}
          <h1 className="font-playfair text-xl font-bold text-white mb-3">{title}</h1>

          {/* Message */}
          <p className="text-kcb-sable text-sm leading-relaxed mb-6">{message}</p>

          {/* Detail rows */}
          {details && details.length > 0 && (
            <div className="bg-kcb-noir border border-white/[0.06] rounded-[4px] p-4 mb-6 text-left space-y-2">
              {details.map((d, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-kcb-pierre">{d.label}</span>
                  <span className="text-white font-medium">{d.value}</span>
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          {actions && actions.length > 0 && (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {actions.map((action, i) => {
                const isPrimary = action.variant !== 'secondary'
                const cls = isPrimary
                  ? 'bg-kcb-or text-kcb-noir hover:bg-kcb-bronze font-semibold'
                  : 'border border-white/[0.06] text-kcb-sable hover:bg-white/[0.03]'
                const base = `inline-flex items-center justify-center px-6 py-2.5 rounded-[4px] text-sm transition-colors ${cls}`

                if (action.to) {
                  return (
                    <Link key={i} to={action.to} className={base}>
                      {action.label}
                    </Link>
                  )
                }
                if (action.href) {
                  return (
                    <a key={i} href={action.href} className={base}>
                      {action.label}
                    </a>
                  )
                }
                return (
                  <button key={i} onClick={action.onClick} className={base}>
                    {action.label}
                  </button>
                )
              })}
            </div>
          )}

          {children}
        </div>
      </div>
    </PageWrapper>
  )
}
