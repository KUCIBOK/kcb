import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Design System - Accordion Component
 * 
 * Collapsible content sections
 * 
 * Features:
 * - Single or multiple items open at once
 * - Smooth animations
 * - Icon support
 * - Badge support
 * - Controlled or uncontrolled mode
 */

export function Accordion({
  items = [],
  defaultOpenItems = [],
  openItems: controlledOpenItems,
  onChange,
  allowMultiple = false,
  className = ''
}) {
  const [internalOpenItems, setInternalOpenItems] = useState(defaultOpenItems);
  
  const isControlled = controlledOpenItems !== undefined;
  const openItems = isControlled ? controlledOpenItems : internalOpenItems;

  const toggleItem = (itemValue) => {
    let newOpenItems;
    
    if (allowMultiple) {
      // Multiple items can be open
      newOpenItems = openItems.includes(itemValue)
        ? openItems.filter(v => v !== itemValue)
        : [...openItems, itemValue];
    } else {
      // Only one item can be open
      newOpenItems = openItems.includes(itemValue) ? [] : [itemValue];
    }

    if (!isControlled) {
      setInternalOpenItems(newOpenItems);
    }
    onChange?.(newOpenItems);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {items.map((item) => {
        const isOpen = openItems.includes(item.value);

        return (
          <div
            key={item.value}
            className="bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden"
          >
            {/* Accordion header */}
            <button
              onClick={() => !item.disabled && toggleItem(item.value)}
              disabled={item.disabled}
              aria-expanded={isOpen}
              aria-controls={`accordion-content-${item.value}`}
              className={`
                w-full flex items-center justify-between p-4
                text-left transition-colors
                ${item.disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/[0.03]'}
              `}
            >
              <div className="flex items-center gap-3 flex-1">
                {item.icon && (
                  <span className="text-kcb-pierre">{item.icon}</span>
                )}
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-white">
                    {item.title}
                  </h3>
                  {item.subtitle && (
                    <p className="text-xs text-kcb-pierre mt-1">{item.subtitle}</p>
                  )}
                </div>
                {item.badge !== undefined && (
                  <span className="px-2 py-1 text-xs rounded-full bg-white/[0.06] text-kcb-sable">
                    {item.badge}
                  </span>
                )}
              </div>
              <ChevronDown
                className={`w-5 h-5 text-kcb-pierre transition-transform duration-200 ${
                  isOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Accordion content */}
            <div
              id={`accordion-content-${item.value}`}
              role="region"
              aria-labelledby={`accordion-header-${item.value}`}
              className={`
                transition-all duration-200 ease-in-out overflow-hidden
                ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
              `}
            >
              <div className="p-4 pt-0 border-t border-white/[0.06]">
                {item.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/**
 * Alternative API: AccordionGroup + AccordionItem
 * For more explicit control and nested content
 */

export function AccordionGroup({ 
  children, 
  defaultOpenItems = [],
  openItems: controlledOpenItems,
  onChange,
  allowMultiple = false,
  className = '' 
}) {
  const [internalOpenItems, setInternalOpenItems] = useState(defaultOpenItems);
  
  const isControlled = controlledOpenItems !== undefined;
  const openItems = isControlled ? controlledOpenItems : internalOpenItems;

  const toggleItem = (itemValue) => {
    let newOpenItems;
    
    if (allowMultiple) {
      newOpenItems = openItems.includes(itemValue)
        ? openItems.filter(v => v !== itemValue)
        : [...openItems, itemValue];
    } else {
      newOpenItems = openItems.includes(itemValue) ? [] : [itemValue];
    }

    if (!isControlled) {
      setInternalOpenItems(newOpenItems);
    }
    onChange?.(newOpenItems);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            isOpen: openItems.includes(child.props.value),
            onToggle: () => toggleItem(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
}

export function AccordionItem({ 
  value,
  title,
  subtitle,
  icon,
  badge,
  children,
  disabled,
  isOpen,
  onToggle,
  className = ''
}) {
  return (
    <div className={`bg-kcb-ardoise border border-white/[0.06] rounded-[4px] overflow-hidden ${className}`}>
      {/* Accordion header */}
      <button
        onClick={() => !disabled && onToggle?.()}
        disabled={disabled}
        className={`
          w-full flex items-center justify-between p-4
          text-left transition-colors
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/[0.03]'}
        `}
      >
        <div className="flex items-center gap-3 flex-1">
          {icon && (
            <span className="text-kcb-pierre">{icon}</span>
          )}
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">
              {title}
            </h3>
            {subtitle && (
              <p className="text-xs text-kcb-pierre mt-1">{subtitle}</p>
            )}
          </div>
          {badge !== undefined && (
            <span className="px-2 py-1 text-xs rounded-full bg-white/[0.06] text-kcb-sable">
              {badge}
            </span>
          )}
        </div>
        <ChevronDown
          className={`w-5 h-5 text-kcb-pierre transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Accordion content */}
      <div
        className={`
          transition-all duration-200 ease-in-out overflow-hidden
          ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-4 pt-0 border-t border-white/[0.06]">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Accordion;
