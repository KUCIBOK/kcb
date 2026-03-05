const redis = require('../config/redis');
const logger = require('../utils/logger');

/**
 * Middleware de cache Redis générique pour les routes GET.
 * Fallback transparent si Redis n'est pas configuré.
 *
 * @param {number} ttlSeconds - Durée du cache en secondes (défaut : 300 = 5 min)
 * @param {string} keyPrefix  - Préfixe de la clé Redis (défaut : 'cache')
 */
const cache = (ttlSeconds = 300, keyPrefix = 'cache') => async (req, res, next) => {
  if (!redis) return next();

  const key = `${keyPrefix}:${req.originalUrl}`;

  try {
    const cached = await redis.get(key);
    if (cached) {
      return res.status(200).json(JSON.parse(cached));
    }

    // Intercepter res.json pour mettre en cache la réponse
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      if (res.statusCode === 200) {
        redis.setex(key, ttlSeconds, JSON.stringify(data)).catch((err) =>
          logger.error('Cache set error', { err: err.message, key })
        );
      }
      return originalJson(data);
    };

    next();
  } catch (err) {
    logger.error('Cache middleware error', { err: err.message, key });
    next();
  }
};

/**
 * Invalide toutes les clés correspondant à un préfixe donné.
 * Utilisé après une mutation (create/update/delete).
 */
const invalidateCache = async (keyPrefix) => {
  if (!redis) return;
  try {
    const keys = await redis.keys(`${keyPrefix}:*`);
    if (keys.length > 0) {
      await redis.del(...keys);
      logger.info(`Cache invalidé : ${keys.length} clé(s) supprimée(s) [${keyPrefix}]`);
    }
  } catch (err) {
    logger.error('Cache invalidation error', { err: err.message, keyPrefix });
  }
};

module.exports = { cache, invalidateCache };
