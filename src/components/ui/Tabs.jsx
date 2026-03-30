import React, { useState, useId } from 'react';

/**
 * Design System - Tabs Component
 * 
 * Tabbed navigation for content organization
 * 
 * Features:
 * - Controlled or uncontrolled mode
 * - Different variants (line, pills, enclosed)
 * - Icon support
 * - Badge/count support
 * - Full width option
 */

const variants = {
  line: {
    container: 'border-b border-white/[0.06]',
    tab: 'px-4 py-2 font-medium transition relative',
    active: 'text-kcb-or after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-kcb-or',
    inactive: 'text-kcb-pierre hover:text-white'
  },
  pills: {
    container: 'flex gap-2 p-1 bg-white/[0.03] rounded-[4px]',
    tab: 'px-4 py-2 rounded-[4px] font-medium transition',
    active: 'bg-kcb-or text-kcb-noir',
    inactive: 'text-kcb-pierre hover:text-white hover:bg-white/[0.06]'
  },
  enclosed: {
    container: 'flex gap-1 border-b border-white/[0.06]',
    tab: 'px-4 py-2 rounded-t-[4px] font-medium transition border-t border-x',
    active: 'bg-kcb-ardoise border-white/[0.08] text-white',
    inactive: 'border-transparent text-kcb-pierre hover:text-white'
  }
};

export function Tabs({
  tabs = [],
  defaultValue,
  value: controlledValue,
  onChange,
  variant = 'line',
  fullWidth = false,
  className = ''
}) {
  const [internalValue, setInternalValue] = useState(defaultValue || tabs[0]?.value);
  const baseId = useId();

  const isControlled = controlledValue !== undefined;
  const activeValue = isControlled ? controlledValue : internalValue;

  const handleTabChange = (tabValue) => {
    if (!isControlled) {
      setInternalValue(tabValue);
    }
    onChange?.(tabValue);
  };

  const activeTab = tabs.find(tab => tab.value === activeValue);
  const variantStyles = variants[variant];

  return (
    <div className={className}>
      {/* Tab list */}
      <div role="tablist" className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles.container}`}>
        {tabs.map((tab, index) => {
          const isActive = tab.value === activeValue;
          const tabId = `${baseId}-tab-${tab.value}`;
          const panelId = `${baseId}-panel-${tab.value}`;

          return (
            <button
              key={tab.value}
              id={tabId}
              role="tab"
              aria-selected={isActive}
              aria-controls={panelId}
              tabIndex={isActive ? 0 : -1}
              onClick={() => !tab.disabled && handleTabChange(tab.value)}
              onKeyDown={(e) => {
                let nextIndex;
                if (e.key === 'ArrowRight') {
                  nextIndex = (index + 1) % tabs.length;
                } else if (e.key === 'ArrowLeft') {
                  nextIndex = (index - 1 + tabs.length) % tabs.length;
                } else if (e.key === 'Home') {
                  nextIndex = 0;
                } else if (e.key === 'End') {
                  nextIndex = tabs.length - 1;
                }
                if (nextIndex !== undefined) {
                  e.preventDefault();
                  handleTabChange(tabs[nextIndex].value);
                  e.currentTarget.parentElement.children[nextIndex]?.focus();
                }
              }}
              disabled={tab.disabled}
              className={`
                ${variantStyles.tab}
                ${isActive ? variantStyles.active : variantStyles.inactive}
                ${fullWidth ? 'flex-1' : ''}
                ${tab.disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                flex items-center justify-center gap-2
              `}
            >
              {tab.icon && <span>{tab.icon}</span>}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`
                  px-2 py-0.5 text-xs rounded-full
                  ${isActive ? 'bg-kcb-or text-kcb-noir' : 'bg-white/[0.06] text-kcb-sable'}
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div role="tabpanel" id={`${baseId}-panel-${activeValue}`} aria-labelledby={`${baseId}-tab-${activeValue}`} className="mt-4">
        {activeTab?.content}
      </div>
    </div>
  );
}

/**
 * Alternative API: TabGroup + Tab + TabPanel
 * For more explicit control
 */

export function TabGroup({ children, defaultValue, value, onChange, variant = 'line', className = '' }) {
  const [internalValue, setInternalValue] = useState(defaultValue);
  
  const isControlled = value !== undefined;
  const activeValue = isControlled ? value : internalValue;

  const handleChange = (newValue) => {
    if (!isControlled) {
      setInternalValue(newValue);
    }
    onChange?.(newValue);
  };

  return (
    <div className={className}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            activeValue,
            onValueChange: handleChange,
            variant
          });
        }
        return child;
      })}
    </div>
  );
}

export function TabList({ children, activeValue, onValueChange, variant = 'line', fullWidth = false }) {
  const variantStyles = variants[variant];

  return (
    <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles.container}`}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            activeValue,
            onValueChange,
            variant,
            fullWidth
          });
        }
        return child;
      })}
    </div>
  );
}

export function Tab({ value, children, icon, badge, disabled, activeValue, onValueChange, variant, fullWidth }) {
  const isActive = value === activeValue;
  const variantStyles = variants[variant];

  return (
    <button
      onClick={() => !disabled && onValueChange?.(value)}
      disabled={disabled}
      className={`
        ${variantStyles.tab}
        ${isActive ? variantStyles.active : variantStyles.inactive}
        ${fullWidth ? 'flex-1' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        flex items-center justify-center gap-2
      `}
    >
      {icon && <span>{icon}</span>}
      <span>{children}</span>
      {badge !== undefined && (
        <span className={`
          px-2 py-0.5 text-xs rounded-full
          ${isActive ? 'bg-kcb-or text-kcb-noir' : 'bg-white/[0.06] text-kcb-sable'}
        `}>
          {badge}
        </span>
      )}
    </button>
  );
}

export function TabPanels({ children, activeValue }) {
  return (
    <div className="mt-4">
      {React.Children.map(children, child => {
        if (React.isValidElement(child) && child.props.value === activeValue) {
          return child;
        }
        return null;
      })}
    </div>
  );
}

export function TabPanel({ value, children }) {
  return <div>{children}</div>;
}

export default Tabs;
