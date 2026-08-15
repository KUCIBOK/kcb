import './index.css'
import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import * as Sentry from '@sentry/react'
import Error500 from './components/fallback/Error500'

// Initialize Sentry for error tracking in production
if (import.meta.env.PROD) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1, // 10% performance sampling in prod
    beforeSend(event) {
      // Filter out SecurityError (common noise from browser extensions)
      if (
        event.exception?.values?.[0]?.type === 'SecurityError' &&
        event.exception.values[0].value?.includes('access to localStorage')
      ) {
        return null
      }
      return event
    },
  })
}

const App = lazy(() => import('./App'))

// Sentry ErrorBoundary wrapper
const AppWithSentry = Sentry.withProfiler(App)

function AppFallback({ error }) {
  return (
    <BrowserRouter>
      <Error500 error={error} />
    </BrowserRouter>
  )
}

// Sentry ErrorBoundary captures React errors
const SentryErrorBoundary = Sentry.ErrorBoundary

createRoot(document.getElementById('root')).render(
  <SentryErrorBoundary
    fallback={<AppFallback />}
    showDialog={{
      title: 'Erreur inattendue',
      subtitle: 'Nous avons été notifiés. Merci de recharger la page.',
      labelComments: 'Décrivez ce qui s\'est passé',
      labelClose: 'Fermer',
      onClose: () => window.location.reload(),
    }}
  >
    <ErrorBoundary FallbackComponent={AppFallback}>
      <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f0f0f' }} />}>
        <AppWithSentry />
      </Suspense>
    </ErrorBoundary>
  </SentryErrorBoundary>
)
