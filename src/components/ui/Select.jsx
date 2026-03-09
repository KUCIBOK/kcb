import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/**
 * Design System - Select Component
 * 
 * Custom dropdown select with search and multi-select support
 * 
 * Features:
 * - Single or multi-select mode
 * - Search/filter options
 * - Disabled state
 * - Error/success states
 * - Custom option rendering
 * - Keyboard navigation
 */

export function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Sélectionner...',
  error,
  success,
  disabled = false,
  required = false,
  searchable = false,
  multiple = false,
  fullWidth = true,
  className = '',
  ...props
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selectRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter options based on search
  const filteredOptions = searchQuery
    ? options.filter(opt =>
        opt.label.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : options;

  // Get selected option(s) label
  const getSelectedLabel = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder;
      const selectedOptions = options.filter(opt => value.includes(opt.value));
      return selectedOptions.map(opt => opt.label).join(', ');
    } else {
      const selectedOption = options.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };

  // Handle option selection
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter(v => v !== optionValue)
        : [...(value || []), optionValue];
      onChange?.(newValue);
    } else {
      onChange?.(optionValue);
      setIsOpen(false);
    }
  };

  // Check if option is selected
  const isSelected = (optionValue) => {
    if (multiple) {
      return value?.includes(optionValue);
    }
    return value === optionValue;
  };

  // Border colors based on state
  let borderStyles = 'border-gray-700 focus-within:border-indigo-500';
  if (error) {
    borderStyles = 'border-red-500';
  } else if (success) {
    borderStyles = 'border-green-500';
  }

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`} ref={selectRef}>
      {label && (
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Select trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          disabled={disabled}
          className={`
            w-full flex items-center justify-between
            px-4 py-2.5 rounded-lg
            bg-gray-800 border ${borderStyles}
            text-gray-300 text-sm
            transition-all duration-200
            hover:bg-gray-750
            focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isOpen ? 'ring-2 ring-indigo-500' : ''}
          `}
          {...props}
        >
          <span className={value ? 'text-white' : 'text-gray-500'}>
            {getSelectedLabel()}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-xl max-h-60 overflow-hidden">
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-gray-700">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded text-sm text-white focus:outline-none focus:border-indigo-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options list */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500 text-center">
                  Aucune option trouvée
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5
                      text-sm text-left transition-colors
                      ${
                        isSelected(option.value)
                          ? 'bg-indigo-900/40 text-white'
                          : 'text-gray-300 hover:bg-gray-700'
                      }
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected(option.value) && (
                      <Check className="w-4 h-4 text-indigo-400" />
                    )}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error/Success message */}
      {error && (
        <p className="mt-1 text-sm text-red-400">{error}</p>
      )}
      {success && (
        <p className="mt-1 text-sm text-green-400">{success}</p>
      )}
    </div>
  );
}

export default Select;
