import { Loader2 } from 'lucide-react'

/**
 * Design System - Button Component
 *
 * Variants:
 * - primary: Main actions (kcb-or gold)
 * - secondary: Secondary actions (kcb-ardoise)
 * - danger: Destructive actions (red)
 * - ghost: Minimal actions
 * - outline: Border only
 * - kcb_outline: KCB gold outline
 * - kcb_ghost: KCB ghost (subtle hover)
 *
 * Sizes:
 * - sm: Small (py-1.5 px-3 text-sm)
 * - md: Medium (py-2 px-4 text-base) [default]
 * - lg: Large (py-3 px-6 text-lg)
 * - icon: Square icon button
 */

const variants = {
  primary:
    'bg-kcb-or hover:bg-kcb-or/90 text-kcb-noir border border-transparent shadow-sm font-semibold',
  secondary: 'bg-kcb-ardoise hover:bg-white/[0.08] text-white border border-white/[0.08]',
  danger: 'bg-red-600 hover:bg-red-500 text-white border border-transparent shadow-sm',
  ghost:
    'bg-transparent hover:bg-white/[0.03] text-kcb-sable hover:text-white border border-transparent',
  outline:
    'bg-transparent hover:bg-white/[0.03] text-kcb-sable hover:text-white border border-white/[0.08] hover:border-white/[0.12]',
  success: 'bg-green-600 hover:bg-green-500 text-white border border-transparent shadow-sm',
  kcb_outline: 'bg-transparent hover:bg-kcb-or/10 text-kcb-or border border-kcb-or',
  kcb_ghost: 'bg-transparent hover:bg-white/[0.03] text-kcb-sable border border-transparent',
}

const sizes = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-6 text-lg',
  icon: 'p-2',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  iconPosition = 'left',
  className = '',
  onClick,
  type = 'button',
  ...props
}) {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-[4px] font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-kcb-or focus:ring-offset-2 focus:ring-offset-kcb-noir disabled:opacity-50 disabled:cursor-not-allowed'

  const widthStyles = fullWidth ? 'w-full' : ''

  const variantStyles = variants[variant] || variants.primary
  const sizeStyles = sizes[size] || sizes.md

  const isDisabled = disabled || loading

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`${baseStyles} ${variantStyles} ${sizeStyles} ${widthStyles} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {!loading && Icon && iconPosition === 'left' && <Icon className="w-4 h-4" />}
      {children}
      {!loading && Icon && iconPosition === 'right' && <Icon className="w-4 h-4" />}
    </button>
  )
}

export default Button
