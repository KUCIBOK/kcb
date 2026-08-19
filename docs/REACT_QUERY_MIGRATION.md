# React Query Migration Strategy

## Overview

**Goal:** Replace 12 nested Context providers with React Query for better caching, performance, and UX.

**Status:** Infrastructure in place (Phase 1 complete). Progressive migration starting.

**Timeline:** Sprint-based (3-4 sprints, ~40 hours total)

---

## Why React Query?

### Before (Context):
```javascript
const { artworks, loading } = useArtworks()
// ❌ Duplicate calls if multiple components use this
// ❌ No background sync
// ❌ Manual error handling
// ❌ Complex state management
```

### After (React Query):
```javascript
const { data: artworks, isLoading } = useArtworksQuery()
// ✅ Intelligent cache (same query = zero API call)
// ✅ Auto background sync every 5 min
// ✅ Auto retry on error
// ✅ Automatic state management (loading, error, success)
```

---

## Architecture

### Files
- `src/lib/queryClient.js` — QueryClient config (stale time, cache, retry)
- `src/store/QueryProvider.jsx` — Wrapper component
- `src/api/queries.js` — Custom React Query hooks

### Integration Point
`src/routes/Router.jsx` — Wrap routes with `<QueryProvider>`

---

## Progressive Migration Plan

### Phase 1: Infrastructure ✅
- [x] QueryClient setup
- [x] QueryProvider component
- [x] First custom hooks (Artworks, Blog, Plans)

### Phase 2: Blog Context → React Query (Next Sprint)
```javascript
// OLD: src/store/BlogContext.jsx
const { posts } = useBlog()

// NEW: src/api/queries.js
const { data: posts } = useBlogPostsQuery()
```

**Files to update:** 8-12 components using `useBlog()`

### Phase 3: Artworks Context → React Query
Files to update: 30+ components

### Phase 4: Plans, Subscriptions
Files to update: 15+ components

### Phase 5: Remaining Contexts
- UserContext (5-10 components)
- ClientContext (3-5 components)
- Others (gradual)

---

## Migration Pattern

### Step 1: Create React Query hook

```javascript
// src/api/queries.js
export function useBlogPostsQuery() {
  return useQuery({
    queryKey: ['blog', 'posts'],
    queryFn: () => getBlogs(),
    staleTime: 1000 * 60 * 5,
  })
}
```

### Step 2: Update component

```javascript
// BEFORE
import { useBlog } from '../store/BlogContext'
export function BlogList() {
  const { posts, loading } = useBlog()
  if (loading) return <Loader />
  return posts.map(post => <Post key={post.id} post={post} />)
}

// AFTER
import { useBlogPostsQuery } from '../api/queries'
export function BlogList() {
  const { data: posts, isLoading } = useBlogPostsQuery()
  if (isLoading) return <Loader />
  return posts?.map(post => <Post key={post.id} post={post} />)
}
```

### Step 3: Handle mutations

```javascript
// OLD: useBlog() had createPost() method
const { createPost } = useBlog()
await createPost({ title, body })

// NEW: Separate mutation hook
const { mutate: createPost } = useMutation(
  (newPost) => createBlogPost(newPost),
  {
    onSuccess: () => {
      queryClient.invalidateQueries(['blog', 'posts'])
    },
  }
)
createPost({ title, body })
```

---

## Expected Impact

### Before Migration
```
User navigates to /articles
  → 3 articles components render
  → Each calls useArtworks()
  → Total: 3 API calls (identical)
  → Network: 3 requests
```

### After Migration
```
User navigates to /articles
  → 3 articles components render
  → Each calls useArtworksQuery()
  → Total: 3 hook calls, 1 actual API request
  → Network: 1 request (cache hits for others)
  → Savings: 66% fewer API calls
```

---

## Rollout Checklist

- [ ] QueryProvider integrated into Router
- [ ] Blog context fully migrated
- [ ] Artworks context fully migrated
- [ ] Payments/Subscriptions context migrated
- [ ] UserContext migrated
- [ ] All old Context providers removed
- [ ] Tests updated
- [ ] Performance benchmarked

---

## Backwards Compatibility Notes

### Temporary Dual Mode
During migration, both old Contexts and React Query hooks will coexist:

```javascript
// Router.jsx
<QueryProvider>
  <ArtworksContextProvider>  {/* OLD — to be removed */}
    <BlogContextProvider>     {/* OLD — to be removed */}
      <Router />
    </BlogContextProvider>
  </ArtworksContextProvider>
</QueryProvider>
```

This allows component-by-component migration without breaking the app.

### Deprecation Timeline
- **Sprint 2:** Mark old Context as `@deprecated`
- **Sprint 3:** Stop using deprecated Contexts in new code
- **Sprint 4:** Remove deprecated Context providers

---

## Common Patterns

### Fallback when data is undefined
```javascript
const { data: posts = [] } = useBlogPostsQuery()
return posts.map(post => <Post post={post} />)
```

### Conditional queries (only fetch if condition)
```javascript
const { data: user } = useUserQuery({ enabled: !!userId })
// Won't fetch if userId is null
```

### Invalidate after mutation
```javascript
const { mutate: deletePost } = useMutation(deletePostApi, {
  onSuccess: () => {
    // Refetch blog posts after delete
    queryClient.invalidateQueries(['blog', 'posts'])
  },
})
```

---

## Resources

- [React Query Docs](https://tanstack.com/query/latest)
- [React Query DevTools](https://tanstack.com/query/latest/docs/devtools)
- Kucibok API hooks: `src/api/useArtworks.js`, `src/api/useBlog.js`, etc.

---

**Maintained by:** DevOps  
**Last Updated:** August 2026  
**Status:** Infrastructure complete, Phase 2 starting
