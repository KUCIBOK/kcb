/**
 * src/store/QueryProvider.jsx — React Query Provider
 *
 * Wraps the app with React Query. Replaces multiple Context providers progressively.
 */

import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from '../lib/queryClient'

/**
 * Provides React Query to the entire app
 * Replaces: ArtworksContextProvider, BlogContextProvider, PlanProvider, etc.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function QueryProvider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
