import React, { forwardRef, useId } from 'react'
import { AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react'
import { Tooltip } from './Tooltip'

/**
 * Design System - Input Component
 *
 * Features:
 * - Label and helper text
 * - Error and success states
 * - Icons (left/right)
 * - Full width option
 * - Disabled state
 * - Different sizes
 * - KCB variant for migrated pages
 *
 * @param {object} props
 * @param {string} [props.variant='kcb'] - Visual variant ('kcb')
 * @param {string} [props.label] - Label text
 * @param {string} [props.tooltip] - Tooltip content
 * @param {string} [props.tooltipPlacement='top'] - Tooltip placement
 * @param {string} [props.id] - Input id
 * @param {string} [props.type='text'] - Input type
 * @param {string} [props.placeholder] - Placeholder text
 * @param {string} [props.helperText] - Helper text below input
 * @param {string|boolean} [props.error] - Error message or flag
 * @param {boolean} [props.success] - Success state
 * @param {boolean} [props.disabled=false] - Disabled state
 * @param {boolean} [props.required=false] - Required flag
 * @param {boolean} [props.fullWidth=true] - Full width
 * @param {string} [props.size='md'] - Size ('sm' | 'md' | 'lg')
 * @param {React.ElementType} [props.leftIcon] - Left icon component
 * @param {React.ElementType} [props.rightIcon] - Right icon component
 * @param {string} [props.className=''] - Additional CSS classes
 */

const sizes = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-5 text-lg',
}

/** @type {Record<string, {base: string, border: string, label: string, helper: string, icon: string, placeholder: string}>} */
const VARIANT_STYLES = {
  kcb: {
    base: 'bg-kcb-noir rounded-[4px] text-white placeholder-kcb-pierre',
    border: 'border-white/[0.08] focus:border-kcb-or focus:ring-kcb-or',
    label: 'text-kcb-sable',
    helper: 'text-kcb-pierre',
    icon: 'text-kcb-pierre',
    placeholder: 'placeholder-kcb-pierre',
  },
}

export const Input = forwardRef(
  (
    {
      variant = 'kcb',
      label,
      tooltip,
      tooltipPlacement = 'top',
      id,
      type = 'text',
      placeholder,
      helperText,
      error,
      success,
      disabled = false,
      required = false,
      fullWidth = true,
      size = 'md',
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      className = '',
      ...props
    },
    ref
  ) => {
    const reactId = useId()
    const inputId = id || reactId
    const v = VARIANT_STYLES[variant] || VARIANT_STYLES.kcb

    const baseStyles = `${v.base} border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-kcb-noir disabled:opacity-50 disabled:cursor-not-allowed`

    const widthStyles = fullWidth ? 'w-full' : ''
    const sizeStyles = sizes[size] || sizes.md

    // Border colors based on state
    let borderStyles = v.border
    if (error) {
      borderStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500'
    } else if (success) {
      borderStyles = 'border-green-500 focus:border-green-500 focus:ring-green-500'
    }

    // Padding adjustments for icons
    const leftPadding = LeftIcon ? 'pl-10' : ''
    const rightPadding = RightIcon || error || success ? 'pr-10' : ''

    return (
      <div className={`${fullWidth ? 'w-full' : ''}`}>
        {label && (
          <div className="flex items-center gap-2">
            <label htmlFor={inputId} className={`block text-sm font-medium ${v.label}`}>
              {label}
              {required && <span className="text-red-400 ml-1">*</span>}
            </label>
            {tooltip && (
              <Tooltip content={tooltip} placement={tooltipPlacement}>
                <HelpCircle className={`w-4 h-4 ${v.icon} hover:text-white/60 cursor-help`} />
              </Tooltip>
            )}
          </div>
        )}

        <div className={`relative ${label || tooltip ? 'mt-2' : ''}`}>
          {LeftIcon && (
            <div className={`absolute left-3 top-1/2 -translate-y-1/2 ${v.icon}`}>
              <LeftIcon className="w-5 h-5" />
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={`${baseStyles} ${borderStyles} ${sizeStyles} ${widthStyles} ${leftPadding} ${rightPadding} ${className}`}
            {...props}
          />

          {/* Right icon or status icon */}
          {(RightIcon || error || success) && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {error && <AlertCircle className="w-5 h-5 text-red-400" />}
              {success && !error && <CheckCircle className="w-5 h-5 text-green-400" />}
              {RightIcon && !error && !success && <RightIcon className={`w-5 h-5 ${v.icon}`} />}
            </div>
          )}
        </div>

        {/* Helper text or error message */}
        {(helperText || error) && (
          <p className={`mt-1.5 text-xs ${error ? 'text-red-400' : v.helper}`}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
