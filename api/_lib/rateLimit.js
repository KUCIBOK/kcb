/**
 * Rate Limiting via Upstash Redis (with in-memory fallback)
 * Sliding window counter: tracks requests per IP (unauthenticated) or user ID (authenticated)
 *
 * ULTRA-SAFE: Never crashes, always has fallback
 */

let Redis = null
let redis = null
let useRedis = false

// Lazy-load Redis only when actually needed
async function initRedis() {
  if (useRedis === true) return redis // Already initialized successfully
  if (useRedis === false && redis !== null) return null // Already tried and failed

  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null // Redis not configured
  }

  try {
    if (!Redis) {
      const mod = await import('@upstash/redis')
      Redis = mod.Redis
    }
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    })
    useRedis = true
    return redis
  } catch (error) {
    console.warn('[rateLimit] Redis init failed:', error.message)
    useRedis = false
    return null
  }
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
    const ttl = windowSeconds + 10

    let count

    // Try Redis if available, fallback to in-memory
    try {
      const redisClient = await initRedis()
      if (redisClient) {
        const pipeline = redisClient.pipeline()
        pipeline.incr(key)
        pipeline.expire(key, ttl)
        const results = await pipeline.exec()
        count = results[0]
      } else {
        count = getInMemoryCount(key)
      }
    } catch (redisError) {
      // Redis failed, use in-memory
      console.warn('[rateLimit] Using in-memory fallback:', redisError.message)
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
    // On any error, fail open
    console.error('[rateLimit] Rate limit check failed:', error.message)
    return {
      allowed: true,
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
