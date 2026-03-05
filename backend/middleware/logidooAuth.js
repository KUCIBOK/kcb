const { config } = require('../config/environnement');

/**
 * Middleware d'authentification pour les webhooks entrants Logidoo.
 * Vérifie que la requête porte le token JWT Logidoo attendu
 * (lu depuis config.logidoo.apiKey → variable d'env LOGIDOO_API_KEY).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
exports.logidooAuth = (req, res, next) => {
  const expectedApiKey = config.logidoo.apiKey;

  if (!expectedApiKey) {
    return res.status(503).json({ error: 'Logidoo integration not configured' });
  }

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.substring(7);

  if (token !== expectedApiKey) {
    return res.status(401).json({ error: 'Invalid API key' });
  }

  next();
};