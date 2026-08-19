/**
 * Rate Limiting via Upstash Redis
 * Sliding window counter: tracks requests per IP (unauthenticated) or user ID (authenticated)
 */

import { Redis } from '@upstash/redis'

// Initialize Redis only if Upstash is configured
let redis = null
let useRedis = false

if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  try {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    useRedis = true
    console.log('[rateLimit] Upstash Redis initialized')
  } catch (error) {
    console.warn('[rateLimit] Failed to initialize Upstash Redis:', error.message)
    useRedis = false
  }
} else {
  console.warn('[rateLimit] Upstash not configured — using in-memory fallback')
}

// In-memory fallback for rate limiting (not distributed, for dev/single instance)
const inMemoryStore = new Map()

/**
 * Rate limit configuration by endpoint pattern
 * { pattern: string, limits: { authenticated: number, unauthenticated: number }, windowSeconds: number }
 */
const RATE_LIMIT_CONFIG = [
  // Public, read-only — permissive
  {
    pattern: /^\/api\/artworks\/verify\//,
    limits: { authenticated: 1000, unauthenticated: 100 },
    windowSeconds: 60 * 60, // 1 hour
  },
  {
    pattern: /^\/api\/delivery\/track\//,
    limits: { authenticated: 1000, unauthenticated: 100 },
    windowSeconds: 60 * 60,
  },
  // Auth endpoints
  {
    pattern: /^\/api\/auth\//,
    limits: { authenticated: 100, unauthenticated: 20 },
    windowSeconds: 15 * 60, // 15 min (strict for login spam)
  },
  // Payment endpoints (critical)
  {
    pattern: /^\/api\/payments\//,
    limits: { authenticated: 50, unauthenticated: 10 },
    windowSeconds: 60 * 60,
  },
  // Default for all other routes
  {
    pattern: /.*/,
    limits: { authenticated: 500, unauthenticated: 50 },
    windowSeconds: 15 * 60, // 15 min
  },
]

/**
 * Get rate limit config for a given path
 * @param {string} path - Request path
 * @returns {object} Rate limit config
 */
function getConfig(path) {
  return RATE_LIMIT_CONFIG.find((cfg) => cfg.pattern.test(path)) || RATE_LIMIT_CONFIG[RATE_LIMIT_CONFIG.length - 1]
}

/**
 * Check rate limit for request
 * @param {string} identifier - IP or user ID (key in Redis)
 * @param {string} path - Request path for config lookup
 * @param {boolean} isAuthenticated - Whether user is authenticated
 * @returns {Promise<{ allowed: boolean, limit: number, remaining: number, resetAt: number }>}
 */
export async function checkRateLimit(identifier, path, isAuthenticated = false) {
  try {
    const config = getConfig(path)
    const limit = isAuthenticated ? config.limits.authenticated : config.limits.unauthenticated
    const windowSeconds = config.windowSeconds
    const now = Date.now()
    const windowKey = Math.floor(now / (windowSeconds * 1000))
    const key = `ratelimit:${identifier}:${windowKey}`
    const ttl = windowSeconds + 10 // Keep 10s extra to avoid race conditions

    let count
    const allowed = true // Fail open by default

    if (useRedis && redis) {
      try {
        // Use Upstash Redis if available
        const pipeline = redis.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, ttl)
        const results = await pipeline.exec()
        count = results[0]
      } catch (redisError) {
        console.error('[rateLimit] Redis error, using fallback:', redisError.message)
        count = getInMemoryCount(key)
      }
    } else {
      // Use in-memory fallback
      count = getInMemoryCount(key)
    }

    const resetAt = Math.floor((windowKey + 1) * windowSeconds * 1000)

    return {
      allowed: count <= limit,
      limit,
      remaining: Math.max(0, limit - count),
      resetAt,
    }
  } catch (error) {
    // On any error, fail open (allow request) but log
    console.error('[rateLimit] Rate limit check failed:', error.message)
    return {
      allowed: true, // Fail open
      limit: -1,
      remaining: -1,
      resetAt: Date.now(),
    }
  }
}

/**
 * Get and increment counter in in-memory store (fallback)
 */
function getInMemoryCount(key) {
  const now = Date.now()
  let entry = inMemoryStore.get(key)

  if (!entry || entry.expiresAt < now) {
    entry = { count: 0, expiresAt: now + 60 * 60 * 1000 } // 1 hour TTL
  }

  entry.count++
  inMemoryStore.set(key, entry)

  return entry.count
}

/**
 * Add rate limit headers to response
 * @param {Response} response
 * @param {object} rateLimitResult - Result from checkRateLimit
 * @returns {Response} Response with rate limit headers
 */
export function addRateLimitHeaders(response, rateLimitResult) {
  const { limit, remaining, resetAt } = rateLimitResult

  if (limit > 0) {
    response.headers.set('X-RateLimit-Limit', limit.toString())
    response.headers.set('X-RateLimit-Remaining', remaining.toString())
    response.headers.set('X-RateLimit-Reset', Math.ceil(resetAt / 1000).toString()) // Unix timestamp
  }

  return response
}
