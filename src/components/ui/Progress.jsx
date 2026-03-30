import React from 'react'
import { Check } from 'lucide-react'

/**
 * Design System - Progress Component
 *
 * Progress indicators for loading states and multi-step processes
 *
 * Features:
 * - Linear progress bar
 * - Circular progress
 * - Step indicator
 * - Different sizes and colors
 * - Animated
 */

// Linear Progress Bar
export function Progress({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  animated = false,
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3',
  }

  const variants = {
    primary: 'bg-kcb-or',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600',
    info: 'bg-blue-600',
  }

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-kcb-sable">Progress</span>
          <span className="text-sm font-medium text-white">{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div className={`w-full bg-white/[0.06] rounded-full overflow-hidden ${sizes[size]}`}>
        <div
          className={`${sizes[size]} ${variants[variant]} transition-all duration-300 ease-out ${
            animated ? 'animate-pulse' : ''
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

// Circular Progress
export function CircularProgress({
  value = 0,
  max = 100,
  size = 64,
  strokeWidth = 4,
  variant = 'primary',
  showLabel = true,
  className = '',
}) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100)
  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const offset = circumference - (percentage / 100) * circumference

  const variants = {
    primary: 'stroke-kcb-or',
    success: 'stroke-green-600',
    warning: 'stroke-yellow-600',
    danger: 'stroke-red-600',
    info: 'stroke-blue-600',
  }

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-white/[0.06]"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={variants[variant]}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />
      </svg>
      {showLabel && (
        <span className="absolute text-sm font-semibold text-white">{percentage.toFixed(0)}%</span>
      )}
    </div>
  )
}

// Step Indicator
export function StepProgress({ steps = [], currentStep = 0, className = '' }) {
  return (
    <div className={className}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep

          return (
            <React.Fragment key={index}>
              {/* Step */}
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center
                    border-2 transition-all duration-200
                    ${
                      isCompleted
                        ? 'bg-green-600 border-green-600'
                        : isCurrent
                          ? 'bg-kcb-or border-kcb-or'
                          : 'bg-kcb-ardoise border-white/[0.08]'
                    }
                  `}
                >
                  {isCompleted ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <span
                      className={`text-sm font-semibold ${
                        isCurrent || isCompleted ? 'text-white' : 'text-kcb-pierre'
                      }`}
                    >
                      {index + 1}
                    </span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={`text-xs font-medium ${
                      isCurrent || isCompleted ? 'text-white' : 'text-kcb-pierre'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.description && (
                    <p className="text-xs text-kcb-pierre mt-1">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-2 mb-8">
                  <div
                    className={`h-0.5 transition-all duration-200 ${
                      isCompleted ? 'bg-green-600' : 'bg-white/[0.08]'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default Progress
