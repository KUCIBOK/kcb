# Rate Limiting — Upstash Redis Implementation

## Overview

Kucibok API implements **distributed rate limiting** via **Upstash Redis**, preventing API abuse while maintaining fair service for all users.

- **Unauthenticated users:** 50 requests per 15 minutes per IP
- **Authenticated users:** 500 requests per 15 minutes per user ID
- **Authentication endpoints:** 20 requests per 15 minutes per IP (stricter)
- **Payment endpoints:** 50 requests per hour per authenticated user (critical)
- **Public endpoints** (verify, track): 100 requests per hour per IP (permissive)

## Setup

### 1. Create Upstash Redis Database

1. Go to [upstash.com](https://upstash.com)
2. Sign in with GitHub or create account
3. Create new Redis database:
   - **Region:** Frankfurt or closest to Kucibok
   - **Type:** Pay-as-you-go (sufficient for rate limiting)
4. Copy connection details:
   - `UPSTASH_REDIS_REST_URL` (https://...)
   - `UPSTASH_REDIS_REST_TOKEN` (long token)

### 2. Add Environment Variables to Vercel

In [Vercel Dashboard](https://vercel.com/dashboard):

1. Select project: `kucibok` 
2. Settings → Environment Variables
3. Add two new variables:
   ```
   UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
   UPSTASH_REDIS_REST_TOKEN=AaaaaBbbbbCccccDddddEeeeeFfffff
   ```
4. Apply to: **Production, Preview, Development**
5. Redeploy: `vercel deploy --prod`

### 3. Install Dependency

The `@upstash/redis` package is already in `package.json`:

```bash
yarn install
```

If not present, add manually:
```bash
yarn add @upstash/redis
```

## Architecture

### Files

- **`api/_lib/rateLimit.js`** — Core rate limiting logic
  - `checkRateLimit(identifier, path, isAuthenticated)` → Returns `{allowed, limit, remaining, resetAt}`
  - `addRateLimitHeaders(response, result)` → Adds `X-RateLimit-*` headers
  - Configuration per route pattern (auth, payments, public, default)

- **`api/[...path].js`** — Main API handler
  - Imports `checkRateLimit` and `addRateLimitHeaders`
  - Exempts public routes: `/health`, `/cron`, `/artworks/verify`, `/delivery/track`
  - Extracts identifier (IP for anonymous, `user:{id}` for authenticated)
  - Enforces rate limit before routing to handler

### Flow

```
Request
  ↓
CORS preflight? → Return 204
  ↓
Is public route? → Skip rate limit, continue
  ↓
Extract identifier (IP or user ID)
  ↓
Call checkRateLimit(identifier, path, isAuthenticated)
  ↓
Add X-RateLimit-* headers
  ↓
Allowed? → Continue to handler
  ↓
Denied → Return 429 Too Many Requests + Retry-After header
```

## Response Headers

Every response includes rate limit metadata:

```
X-RateLimit-Limit: 500           # Max requests in window
X-RateLimit-Remaining: 487        # Requests left
X-RateLimit-Reset: 1692734200     # Unix timestamp when limit resets
Retry-After: 45                   # Seconds to wait (on 429 only)
```

Example (429 response):
```json
{
  "error": "Trop de requêtes. Veuillez réessayer plus tard."
}
```

## Configuration

### Route-Specific Limits

Edit `api/_lib/rateLimit.js` → `RATE_LIMIT_CONFIG` array to customize:

```javascript
{
  pattern: /^\/api\/payments\//,
  limits: {
    authenticated: 50,    // Per hour for logged-in users
    unauthenticated: 10   // Per hour for anonymous
  },
  windowSeconds: 60 * 60, // 1 hour
}
```

### Sliding Window Algorithm

Uses **Redis counter with TTL**:

1. Each request increments a counter keyed by `ratelimit:{identifier}:{timeWindow}`
2. Counter expires after window duration + 10s buffer
3. Atomic increment guarantees race-condition safety
4. Works across multiple Vercel instances (distributed)

### Fail-Open Behavior

If Redis is unavailable:
- Rate limit check **fails open** (allows request)
- Error logged to console
- Service continues uninterrupted
- Recovery automatic when Redis is back

## Testing

### Local Development

Rate limiting works with local Upstash Redis (requires active Upstash account).

1. Set env vars locally: `.env.local`
   ```
   UPSTASH_REDIS_REST_URL=...
   UPSTASH_REDIS_REST_TOKEN=...
   ```

2. Run dev server:
   ```bash
   yarn dev
   # OR for API functions locally:
   vercel dev
   ```

3. Test with curl (replace with your identifier):
   ```bash
   # Hit rate limit by making 51 requests
   for i in {1..51}; do
     curl -v http://localhost:3000/api/artworks \
       -H "Authorization: Bearer your-token" 2>&1 | grep "X-RateLimit"
   done
   ```

### Staging → Production

Deployed to production automatically via:
1. Push to `main` branch
2. Vercel webhook triggers build
3. API functions deploy with updated code
4. Environment variables already set on Vercel

## Monitoring

### Upstash Dashboard

1. Log into [upstash.com](https://upstash.com) → Select database
2. **Stats tab:**
   - Request count
   - Success/error rates
   - Latency metrics
3. **Commands tab:**
   - View key usage
   - Monitor `ratelimit:*` keys

### Sentry Integration

Errors during rate limit check logged to Sentry:
- Error: "Rate limit check failed"
- Context: IP, user ID, path
- Action: Check Upstash Redis status + network connectivity

### Rate Limit Events

Monitor client-side 429 responses:
- **Frontend:** Toast notification shown
- **Backend:** Sentry captures if retry logic triggers
- **Metrics:** X-RateLimit headers provide transparency

## Troubleshooting

| Issue | Cause | Solution |
|-------|-------|----------|
| Requests always denied (429) | Wrong identifier | Check IP/user ID extraction in `api/[...path].js` |
| Rate limit not enforced | Public route exempted | Verify route pattern in `isPublicRoute` check |
| Redis connection timeout | Network/firewall issue | Check Upstash URL/token, firewall whitelist |
| "Rate limit check failed" error | Redis unavailable | Check Upstash status page, restart if needed |
| Limits too strict/loose | Config mismatch | Adjust `RATE_LIMIT_CONFIG` in `api/_lib/rateLimit.js` |

## Cost Estimates

Upstash Redis pricing (as of 2026):
- **Reads:** $0.20 per 100k
- **Writes:** $0.20 per 100k  
- **Storage:** $0.25 per GB per month

At 10k DAU with 50 req/day each:
- ~500k req/day = 1M read/write ops/day
- **Cost:** ~$6/month + storage

## References

- [Upstash Redis Docs](https://upstash.com/docs/redis)
- [Upstash REST API](https://upstash.com/docs/redis/features/restapi)
- [Rate Limiting Patterns](https://en.wikipedia.org/wiki/Rate_limiting)

---

**Last updated:** August 2026  
**Maintained by:** Kucibok DevOps
