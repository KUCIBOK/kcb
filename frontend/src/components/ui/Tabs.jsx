import React, { useState } from 'react';

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
    container: 'border-b border-gray-800',
    tab: 'px-4 py-2 font-medium transition relative',
    active: 'text-indigo-400 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-indigo-400',
    inactive: 'text-gray-400 hover:text-white'
  },
  pills: {
    container: 'flex gap-2 p-1 bg-gray-800/50 rounded-lg',
    tab: 'px-4 py-2 rounded-md font-medium transition',
    active: 'bg-indigo-600 text-white',
    inactive: 'text-gray-400 hover:text-white hover:bg-gray-700'
  },
  enclosed: {
    container: 'flex gap-1 border-b border-gray-800',
    tab: 'px-4 py-2 rounded-t-lg font-medium transition border-t border-x',
    active: 'bg-card border-gray-700 text-white',
    inactive: 'border-transparent text-gray-400 hover:text-white'
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
      <div className={`flex ${fullWidth ? 'w-full' : ''} ${variantStyles.container}`}>
        {tabs.map((tab) => {
          const isActive = tab.value === activeValue;
          
          return (
            <button
              key={tab.value}
              onClick={() => !tab.disabled && handleTabChange(tab.value)}
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
                  ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'}
                `}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div className="mt-4">
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
          ${isActive ? 'bg-indigo-500 text-white' : 'bg-gray-700 text-gray-300'}
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
