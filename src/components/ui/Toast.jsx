import React from 'react'

/**
 * Design System - Toast Notification System
 *
 * Simple toast notifications for user feedback
 * Usage: Import and use the toast functions
 *
 * Example:
 * import { toast } from './components/ui/Toast'
 * toast.success('Saved successfully!')
 * toast.error('Something went wrong')
 */

import { Toaster, toast as sonnerToast } from 'sonner'
import { CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'

export function ToastProvider({ children }) {
  return (
    <>
      {children}
      <Toaster
        position="top-right"
        theme="dark"
        toastOptions={{
          style: {
            background: 'var(--kcb-ardoise)',
            border: '1px solid var(--kcb-pierre)',
            color: 'var(--kcb-ivoire)',
          },
          className: 'custom-toast',
        }}
        icons={{
          success: <CheckCircle className="w-5 h-5 text-green-400" />,
          error: <AlertCircle className="w-5 h-5 text-red-400" />,
          warning: <AlertTriangle className="w-5 h-5 text-yellow-400" />,
          info: <Info className="w-5 h-5 text-blue-400" />,
        }}
      />
    </>
  )
}

export const toast = {
  success: (message, options) => {
    sonnerToast.success(message, {
      duration: 3000,
      ...options,
    })
  },

  error: (message, options) => {
    sonnerToast.error(message, {
      duration: 4000,
      ...options,
    })
  },

  warning: (message, options) => {
    sonnerToast.warning(message, {
      duration: 3500,
      ...options,
    })
  },

  info: (message, options) => {
    sonnerToast.info(message, {
      duration: 3000,
      ...options,
    })
  },

  promise: (promise, messages) => {
    return sonnerToast.promise(promise, {
      loading: messages.loading || 'Chargement...',
      success: messages.success || 'Succès!',
      error: messages.error || 'Erreur',
    })
  },

  custom: (component, options) => {
    sonnerToast.custom(component, options)
  },
}

export default toast
