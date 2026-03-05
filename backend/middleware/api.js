const { config } = require('../config/environnement');

/**
 * Middleware de protection par clé API.
 * Toutes les requêtes /api/ doivent inclure le header : kcb-api-key: <API_KEY>
 * La clé est lue depuis config.apiKey (variable d'env API_KEY).
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
const protect = (req, res, next) => {
  const key = req.headers['kcb-api-key'];

  if (key && key === config.apiKey) {
    return next();
  }

  return res.status(401).json({
    error: 'Not authorized, no API key',
  });
};

module.exports = protect;
