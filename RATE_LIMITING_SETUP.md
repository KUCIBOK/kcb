# Rate Limiting Implementation — Setup Checklist

## ✅ What Was Implemented

### Files Created
- **`api/_lib/rateLimit.js`** — Core rate limiting module
  - `checkRateLimit(identifier, path, isAuthenticated)` function
  - `addRateLimitHeaders(response, result)` function
  - Sliding window counter algorithm using Upstash Redis
  - Configuration matrix for route-specific limits

### Files Modified
- **`api/[...path].js`** — Main API handler
  - Added import: `import { checkRateLimit, addRateLimitHeaders } from './_lib/rateLimit.js'`
  - Added environment vars: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
  - Removed old in-memory rate limiting code
  - Added centralized rate limit check in handler (right after CORS)
  - Exempts public routes (health, cron, artworks/verify, delivery/track)

- **`package.json`** — Dependencies
  - Added: `"@upstash/redis": "^1.35.0"`

### Documentation Created
- **`docs/RATE_LIMITING.md`** — Complete setup & troubleshooting guide

---

## 🔧 Next Steps (To Go Live)

### 1. Create Upstash Redis Instance
```
1. Go to https://upstash.com
2. Sign in (or create free account)
3. Create new Redis database
4. Copy REST URL and REST TOKEN
```

### 2. Add to Vercel Environment
```
Vercel Dashboard → Settings → Environment Variables

UPSTASH_REDIS_REST_URL=https://...upstash.io
UPSTASH_REDIS_REST_TOKEN=AaaaaBbbbb...

Apply to: Production, Preview, Development
```

### 3. Redeploy
```
vercel deploy --prod
```

### 4. Test
```bash
# Make 51 unauthenticated requests to any endpoint
# Request 51 should get 429 Too Many Requests
curl -v https://api.kucibok.com/api/artworks

# Verify response headers
# X-RateLimit-Limit: 50
# X-RateLimit-Remaining: 0
# X-RateLimit-Reset: <unix-timestamp>
# Retry-After: <seconds>
```

---

## 📋 Configuration Matrix

| Route Pattern | Unauth Limit | Auth Limit | Window |
|---------------|-------------|-----------|--------|
| `/api/auth/*` | 20/15min | 100/15min | 15 min |
| `/api/payments/*` | 10/hour | 50/hour | 1 hour |
| `/api/artworks/verify` | 100/hour | 1000/hour | 1 hour |
| `/api/delivery/track` | 100/hour | 1000/hour | 1 hour |
| **Default (all other)** | **50/15min** | **500/15min** | **15 min** |

---

## 🔒 Rate Limit Behavior

### Success Response (200)
```
HTTP/1.1 200 OK
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 487
X-RateLimit-Reset: 1692734200
```

### Rate Limited Response (429)
```
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 500
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1692734200
Retry-After: 45

{
  "error": "Trop de requêtes. Veuillez réessayer plus tard."
}
```

### Identifier Logic
- **Unauthenticated:** IP address (from `X-Forwarded-For` header)
- **Authenticated:** User ID prefixed as `user:{id}` (parsed from Bearer token)

---

## 🧪 Local Testing

1. Create `.env.local` with Upstash credentials
2. Run `vercel dev` (not `yarn dev` — need actual Vercel Functions)
3. Make requests and monitor `X-RateLimit-*` headers

---

## 📊 Monitoring

### Upstash Dashboard
- Real-time request counts
- Key usage statistics
- Error monitoring

### Sentry Integration
- Automatic error logging if Redis fails
- Rate limit failures logged (fail-open, but tracked)

### Client Monitoring
- Check 429 responses in browser DevTools
- Verify frontend toast shows "Too many requests"

---

## ⚠️ Failover Behavior

If Upstash Redis is unavailable:
1. Rate limit check **fails open** (allows request)
2. Error logged to console: "Rate limit check failed"
3. Error sent to Sentry for debugging
4. Service continues uninterrupted
5. Automatic recovery when Redis is back online

This ensures the API remains available even during brief outages.

---

## 📈 Cost Estimate

At typical usage (10k DAU × 50 req/day):
- **Monthly cost:** ~$6-8
- **Included:** 100 concurrent connections, auto-backup

---

## 🎯 Success Criteria

- [ ] Upstash Redis instance created
- [ ] Environment variables set in Vercel
- [ ] Production deployment succeeds
- [ ] 429 response received after 50 unauthenticated requests
- [ ] X-RateLimit headers present in all responses
- [ ] Retry-After header present in 429 responses
- [ ] Frontend shows toast on rate limit
- [ ] Sentry shows no rate limiting errors

---

## 📞 Support

See `docs/RATE_LIMITING.md` for:
- Detailed architecture
- Troubleshooting guide
- Customization instructions
- Performance optimization

---

**Implementation Date:** August 17, 2026  
**Status:** ✅ Code ready for deployment (awaiting Upstash + Vercel config)
