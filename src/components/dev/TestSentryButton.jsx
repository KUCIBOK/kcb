import React from 'react'
import * as Sentry from '@sentry/react'

// Small helper to trigger Sentry events for verification in staging/dev.
export default function TestSentryButton() {
  return (
    <button
      className="px-4 py-2 bg-kcb-or text-kcb-noir rounded-[4px]"
      onClick={() => {
        // Add a breadcrumb and send an info message before throwing
        Sentry.addBreadcrumb({ category: 'test', message: 'User clicked test error button' })
        Sentry.captureMessage('User triggered test error button', 'info')
        // Throw an error so ErrorBoundary / Sentry captures the exception and (optionally) session replay
        throw new Error('Sentry test — intentional error triggered by TestSentryButton')
      }}
    >
      Break the world (Sentry test)
    </button>
  )
}
