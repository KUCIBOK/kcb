/**
 * src/api/queries.js — React Query Custom Hooks
 *
 * Progressive migration from Context providers to React Query
 * Each hook replaces one Context gradually.
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getApprovedArtworks, getArtworks, getArtworkById } from './useArtworks'
import { getBlogs, getBlogById } from './useBlog'
import { getPlans } from './usePlans'

// ─── ARTWORKS ───────────────────────────────────────────────────────────────

/**
 * Fetch approved artworks (used in landing pages, galleries)
 * Replaces: useArtworks() → { approved: [...] }
 */
export function useArtworksQuery(options = {}) {
  return useQuery({
    queryKey: ['artworks', 'approved'],
    queryFn: () => getApprovedArtworks({ limit: 100 }),
    select: (data) => ({
      approved: data || [],
      loading: false, // For backwards compat
    }),
    ...options,
  })
}

/**
 * Fetch all artworks (admin/artist dashboards)
 * Replaces: useArtworks() → { artworks: [...] }
 */
export function useAllArtworksQuery(options = {}) {
  return useQuery({
    queryKey: ['artworks', 'all'],
    queryFn: () => getArtworks(),
    select: (data) => ({
      artworks: data || [],
      loading: false,
    }),
    ...options,
  })
}

/**
 * Fetch single artwork by ID
 */
export function useArtworkByIdQuery(id, options = {}) {
  return useQuery({
    queryKey: ['artworks', id],
    queryFn: () => getArtworkById(id),
    enabled: !!id, // Don't query if no ID
    ...options,
  })
}

// ─── BLOG ───────────────────────────────────────────────────────────────────

/**
 * Fetch all blog posts
 * Replaces: useBlog() → { posts: [...] }
 */
export function useBlogPostsQuery(options = {}) {
  return useQuery({
    queryKey: ['blog', 'posts'],
    queryFn: () => getBlogs(),
    select: (data) => ({
      posts: data || [],
      loading: false,
    }),
    ...options,
  })
}

/**
 * Fetch single blog post by ID
 */
export function useBlogPostByIdQuery(id, options = {}) {
  return useQuery({
    queryKey: ['blog', 'posts', id],
    queryFn: () => getBlogById(id),
    enabled: !!id,
    ...options,
  })
}

// ─── PLANS ──────────────────────────────────────────────────────────────────

/**
 * Fetch subscription plans
 * Replaces: usePlan() → { plans: [...] }
 */
export function usePlansQuery(options = {}) {
  return useQuery({
    queryKey: ['plans'],
    queryFn: () => getPlans(),
    select: (data) => ({
      plans: data || [],
      loading: false,
    }),
    staleTime: 1000 * 60 * 30, // Plans change rarely
    ...options,
  })
}

// ─── QUERY INVALIDATION HELPERS ──────────────────────────────────────────────

/**
 * Hook to invalidate query caches (call after mutations)
 * Usage: const queryClient = useInvalidateQueries()
 *        queryClient.invalidateQueries(['artworks'])
 */
export function useInvalidateQueries() {
  return useQueryClient()
}

/**
 * Helper to invalidate multiple related queries
 */
export function useInvalidateAll() {
  const queryClient = useQueryClient()
  return {
    artworks: () => queryClient.invalidateQueries({ queryKey: ['artworks'] }),
    blog: () => queryClient.invalidateQueries({ queryKey: ['blog'] }),
    plans: () => queryClient.invalidateQueries({ queryKey: ['plans'] }),
    all: () => queryClient.invalidateQueries(),
  }
}
