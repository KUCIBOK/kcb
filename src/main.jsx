import './index.css'
import { lazy, Suspense } from 'react'
import { createRoot } from 'react-dom/client'
import { ErrorBoundary } from 'react-error-boundary'
import { BrowserRouter } from 'react-router-dom'
import Error500 from './components/fallback/Error500'

const App = lazy(() => import('./App'))

function AppFallback({ error }) {
  return (
    <BrowserRouter>
      <Error500 error={error} />
    </BrowserRouter>
  )
}

createRoot(document.getElementById('root')).render(
  <ErrorBoundary FallbackComponent={AppFallback}>
    <Suspense fallback={<div style={{ minHeight: '100vh', background: '#0f0f0f' }} />}>
      <App />
    </Suspense>
  </ErrorBoundary>
)
