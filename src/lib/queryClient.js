/**
 * src/lib/queryClient.js — React Query Configuration
 *
 * Centralized QueryClient setup with defaults for Kucibok
 */

import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
      retry: 1, // Retry once on failure
      refetchOnWindowFocus: true, // Refetch when window regains focus
      refetchOnReconnect: true, // Refetch when reconnected
    },
    mutations: {
      retry: 1, // Retry mutations once
    },
  },
})
