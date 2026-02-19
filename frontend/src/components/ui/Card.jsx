import React from 'react';

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
  default: 'bg-card border border-gray-800',
  elevated: 'bg-card border border-gray-800 shadow-lg hover:shadow-xl transition-shadow',
  outline: 'bg-transparent border-2 border-gray-700',
  glass: 'bg-gray-900/40 backdrop-blur-sm border border-gray-700/50'
};

export function Card({
  children,
  variant = 'default',
  padding = true,
  hover = false,
  className = '',
  onClick
}) {
  const baseStyles = 'rounded-lg transition-all duration-200';
  const variantStyles = variants[variant] || variants.default;
  const paddingStyles = padding ? 'p-6' : '';
  const hoverStyles = hover ? 'hover:border-gray-700 cursor-pointer' : '';
  const clickableStyles = onClick ? 'cursor-pointer' : '';

  return (
    <div
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${paddingStyles} ${hoverStyles} ${clickableStyles} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ 
  title, 
  subtitle, 
  actions, 
  className = '' 
}) {
  return (
    <div className={`flex items-start justify-between mb-4 ${className}`}>
      <div className="flex-1">
        {title && (
          <h3 className="text-lg font-semibold text-white">{title}</h3>
        )}
        {subtitle && (
          <p className="text-sm text-gray-400 mt-1">{subtitle}</p>
        )}
      </div>
      {actions && (
        <div className="ml-4">
          {actions}
        </div>
      )}
    </div>
  );
}

export function CardContent({ children, className = '' }) {
  return (
    <div className={`text-gray-300 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ 
  children, 
  className = '',
  justify = 'end' // 'start', 'center', 'end', 'between'
}) {
  const justifyMap = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between'
  };

  return (
    <div className={`flex items-center gap-3 mt-6 pt-4 border-t border-gray-800 ${justifyMap[justify]} ${className}`}>
      {children}
    </div>
  );
}

export default Card;
