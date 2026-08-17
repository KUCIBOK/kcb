# API Modules — Progressive Refactoring

## Status: Phase 1 (Structure Only)

This directory will eventually contain modularized API handlers extracted from `api/[...path].js`.

Currently, `api/[...path].js` is a monolithic 6117-line file. This structure is being implemented progressively to:
1. **Improve maintainability** — Find code quickly
2. **Enable testing** — Test handlers in isolation
3. **Reduce deployment risk** — Smaller, focused changes
4. **Prepare React Query migration** — Cleaner architecture

## Planned Modules

```
api/_modules/
  auth.js              # /api/auth/*
  artworks.js          # /api/artworks/*
  payments.js          # /api/payments/*
  delivery.js          # /api/delivery/*
  subscriptions.js     # /api/subscription/*
  blog.js              # /api/blog/*
  artist.js            # /api/artist/*
  admin.js             # Admin endpoints (users, logs, etc.)
  profile.js           # /api/profile/*
  sourcing.js          # /api/sourcing/*
```

## Extraction Strategy

Each module exports:
```javascript
export async function handle(req, res, segment, context) {
  // Handles specific routes for this domain
  // Returns: void (handles response) or false (not handled)
}
```

### Extraction Timeline

- **Sprint 1 (Done):** Structure + React Query migration
- **Sprint 2:** Extract Auth + Artworks (highest traffic)
- **Sprint 3:** Extract Payments + Subscriptions (critical)
- **Sprint 4:** Extract remaining modules

## Current State

⚠️ **All handlers still in `api/[...path].js`**

Modules exist as placeholders/stubs. No code has been moved yet to avoid risk.

## Next Steps

1. ✅ Structure created
2. ⏭️ React Query migration (takes priority)
3. ⏳ Gradual handler extraction (low risk, high impact)

---

**Maintainer:** Claude Code  
**Last Updated:** August 2026
