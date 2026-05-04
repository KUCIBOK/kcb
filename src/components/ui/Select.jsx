import React, { useState, useRef, useEffect, useId } from 'react'
import { ChevronDown, Check } from 'lucide-react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [focusedIndex, setFocusedIndex] = useState(-1)
  const selectRef = useRef(null)
  const listboxRef = useRef(null)
  const labelId = useId()
  const listboxId = useId()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Filter options based on search
  const filteredOptions = searchQuery
    ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options

  // Get selected option(s) label
  const getSelectedLabel = () => {
    if (multiple) {
      if (!value || value.length === 0) return placeholder
      const selectedOptions = options.filter((opt) => value.includes(opt.value))
      return selectedOptions.map((opt) => opt.label).join(', ')
    } else {
      const selectedOption = options.find((opt) => opt.value === value)
      return selectedOption ? selectedOption.label : placeholder
    }
  }

  // Handle option selection
  const handleSelect = (optionValue) => {
    if (multiple) {
      const newValue = value?.includes(optionValue)
        ? value.filter((v) => v !== optionValue)
        : [...(value || []), optionValue]
      onChange?.(newValue)
    } else {
      onChange?.(optionValue)
      setIsOpen(false)
    }
  }

  // Check if option is selected
  const isSelected = (optionValue) => {
    if (multiple) {
      return value?.includes(optionValue)
    }
    return value === optionValue
  }

  // Border colors based on state
  let borderStyles = 'border-white/[0.08] focus-within:border-kcb-or'
  if (error) {
    borderStyles = 'border-red-500'
  } else if (success) {
    borderStyles = 'border-green-500'
  }

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`} ref={selectRef}>
      {label && (
        <label id={labelId} className="block text-sm font-medium text-kcb-sable mb-2">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Select trigger */}
        <button
          type="button"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={(e) => {
            if (disabled) return
            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
              e.preventDefault()
              if (!isOpen) setIsOpen(true)
              setFocusedIndex(0)
            } else if (e.key === 'Escape' && isOpen) {
              setIsOpen(false)
            }
          }}
          disabled={disabled}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={listboxId}
          aria-labelledby={label ? labelId : undefined}
          className={`
            w-full flex items-center justify-between
            px-4 py-2.5 rounded-[4px]
            bg-kcb-noir border ${borderStyles}
            text-kcb-sable text-sm
            transition-all duration-200
            hover:bg-white/[0.03]
            focus:outline-none focus:ring-2 focus:ring-kcb-or focus:ring-offset-2 focus:ring-offset-kcb-noir
            disabled:opacity-50 disabled:cursor-not-allowed
            ${isOpen ? 'ring-2 ring-kcb-or' : ''}
          `}
          {...props}
        >
          <span className={value ? 'text-white' : 'text-kcb-sable'}>{getSelectedLabel()}</span>
          <ChevronDown
            className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault()
                setFocusedIndex((prev) => Math.min(prev + 1, filteredOptions.length - 1))
              } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                setFocusedIndex((prev) => Math.max(prev - 1, 0))
              } else if (e.key === 'Enter' && focusedIndex >= 0) {
                e.preventDefault()
                handleSelect(filteredOptions[focusedIndex].value)
              } else if (e.key === 'Escape') {
                setIsOpen(false)
              }
            }}
            className="absolute z-50 w-full mt-2 bg-kcb-ardoise border border-white/[0.08] rounded-[4px] shadow-xl max-h-60 overflow-hidden"
          >
            {/* Search input */}
            {searchable && (
              <div className="p-2 border-b border-white/[0.06]">
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 bg-kcb-noir-deep border border-white/[0.08] rounded-[4px] text-sm text-white focus:outline-none focus:border-kcb-or"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            )}

            {/* Options list */}
            <div className="overflow-y-auto max-h-48">
              {filteredOptions.length === 0 ? (
                <div className="px-4 py-3 text-sm text-kcb-pierre text-center">
                  Aucune option trouvée
                </div>
              ) : (
                filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={isSelected(option.value)}
                    onClick={() => handleSelect(option.value)}
                    className={`
                      w-full flex items-center justify-between px-4 py-2.5
                      text-sm text-left transition-colors
                      ${
                        isSelected(option.value)
                          ? 'bg-kcb-or/10 text-white'
                          : 'text-kcb-sable hover:bg-white/[0.06]'
                      }
                      ${filteredOptions.indexOf(option) === focusedIndex ? 'bg-white/[0.06]' : ''}
                    `}
                  >
                    <span>{option.label}</span>
                    {isSelected(option.value) && <Check className="w-4 h-4 text-kcb-or" />}
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Error/Success message */}
      {error && <p className="mt-1 text-sm text-red-400">{error}</p>}
      {success && <p className="mt-1 text-sm text-green-400">{success}</p>}
    </div>
  )
}

export default Select
