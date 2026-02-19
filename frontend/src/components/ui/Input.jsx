import React, { forwardRef } from 'react';
import { AlertCircle, CheckCircle, Info, HelpCircle } from 'lucide-react';
import { Tooltip } from './Tooltip';

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
 */

const sizes = {
  sm: 'py-1.5 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  lg: 'py-3 px-5 text-lg'
};

export const Input = forwardRef(({
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
}, ref) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  
  const baseStyles = 'bg-gray-800 border rounded-lg text-white placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const widthStyles = fullWidth ? 'w-full' : '';
  const sizeStyles = sizes[size] || sizes.md;
  
  // Border colors based on state
  let borderStyles = 'border-gray-700 focus:border-indigo-500 focus:ring-indigo-500';
  if (error) {
    borderStyles = 'border-red-500 focus:border-red-500 focus:ring-red-500';
  } else if (success) {
    borderStyles = 'border-green-500 focus:border-green-500 focus:ring-green-500';
  }
  
  // Padding adjustments for icons
  const leftPadding = LeftIcon ? 'pl-10' : '';
  const rightPadding = RightIcon || error || success ? 'pr-10' : '';

  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <div className="flex items-center gap-2">
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-gray-300"
          >
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </label>
          {tooltip && (
            <Tooltip content={tooltip} placement={tooltipPlacement}>
              <HelpCircle className="w-4 h-4 text-gray-500 hover:text-gray-400 cursor-help" />
            </Tooltip>
          )}
        </div>
      )}
      
      <div className={`relative ${label || tooltip ? 'mt-2' : ''}`}>
        {LeftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
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
            {RightIcon && !error && !success && <RightIcon className="w-5 h-5 text-gray-400" />}
          </div>
        )}
      </div>
      
      {/* Helper text or error message */}
      {(helperText || error) && (
        <p className={`mt-1.5 text-xs ${error ? 'text-red-400' : 'text-gray-400'}`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
