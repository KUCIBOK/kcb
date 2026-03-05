const Redis = require('ioredis');
const { config } = require('./environnement');
const logger = require('../utils/logger');

let client = null;

if (config.redis.url) {
  client = new Redis(config.redis.url, {
    lazyConnect: true,
    enableOfflineQueue: false,
    maxRetriesPerRequest: 1,
  });

  client.on('connect', () => logger.info('Redis connecté'));
  client.on('error', (err) => logger.error('Redis erreur', { err: err.message }));
  client.on('close', () => logger.warn('Redis déconnecté'));
} else {
  logger.warn('REDIS_URL non configuré — cache Redis désactivé (mode dégradé)');
}

module.exports = client;
