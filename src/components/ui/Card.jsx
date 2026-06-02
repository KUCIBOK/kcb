
/**
 * Design System - Card Component
 *
 * A versatile card component for grouping content
 *
 * Features:
 * - Header with title and actions
 * - Footer for additional actions
 * - Hover effects
 * - Different variants
 */

const variants = {
  default: 'bg-kcb-ardoise border border-white/[0.06]',
  elevated: 'bg-kcb-ardoise border border-white/[0.06] shadow-lg hover:shadow-xl transition-shadow',
  outline: 'bg-transparent border-2 border-white/[0.08]',
  glass: 'bg-kcb-noir/40 backdrop-blur-sm border border-white/[0.06]',
}

export function Card({
  children,
  variant = 'default',
  padding = true,
  hover = false,
  className = '',
  onClick,
}) {
  const baseStyles = 'rounded-[4px] transition-all duration-200'
  const variantStyles = variants[variant] || variants.default
  const paddingStyles = padding ? 'p-6' : ''
  const hoverStyles = hover ? 'hover:border-white/[0.08] cursor-pointer' : ''
  const clickableStyles = onClick ? 'cursor-pointer' : ''

  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? (e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onClick(e)
              }
            }
          : undefined
      }
      className={`${baseStyles} ${variantStyles} ${paddingStyles} ${hoverStyles} ${clickableStyles} ${onClick ? 'focus-visible:ring-2 focus-visible:ring-kcb-or focus-visible:ring-offset-2 focus-visible:ring-offset-kcb-noir outline-none' : ''} ${className}`}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, actions, className = '' }) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
        {subtitle && <p className="text-sm text-kcb-pierre mt-1">{subtitle}</p>}
      </div>
      {actions && <div className="ml-4">{actions}</div>}
    </div>
  )
}

export function CardContent({ children, className = '' }) {
  return <div className={`text-kcb-sable ${className}`}>{children}</div>
}

export function CardFooter({
  children,
  className = '',
  justify = 'end', // 'start', 'center', 'end', 'between'
}) {
  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  }

  return (
    <div
      className={`flex items-center gap-3 mt-6 pt-4 border-t border-white/[0.06] ${justifyMap[justify]} ${className}`}
    >
      {children}
    </div>
  )
}

export default Card
