const redis = require('../config/redis');
const logger = require('./logger');

const PREFIX = 'bl:';

/**
 * Ajoute un token JWT à la blacklist Redis.
 * Le TTL est calé sur le temps restant avant expiration du token.
 *
 * @param {string} token          - Le token JWT brut
 * @param {number} remainingTTL   - Secondes avant expiration du token
 */
exports.blacklistToken = async (token, remainingTTL) => {
  if (!redis || remainingTTL <= 0) return;
  try {
    await redis.setex(`${PREFIX}${token}`, remainingTTL, '1');
  } catch (err) {
    logger.error('JWT blacklist set error', { err: err.message });
  }
};

/**
 * Vérifie si un token est dans la blacklist.
 * Retourne false si Redis n'est pas disponible (fail open — sécurité réduite mais service disponible).
 *
 * @param {string} token - Le token JWT brut
 * @returns {Promise<boolean>}
 */
exports.isBlacklisted = async (token) => {
  if (!redis) return false;
  try {
    const result = await redis.get(`${PREFIX}${token}`);
    return result !== null;
  } catch (err) {
    logger.error('JWT blacklist check error', { err: err.message });
    return false;
  }
};
