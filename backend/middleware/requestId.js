const { randomUUID } = require('crypto');

/**
 * Middleware : injecte un identifiant unique dans chaque requête HTTP.
 *
 * Comportement :
 * - Utilise le header `X-Request-ID` entrant s'il est fourni (relais de l'appelant)
 * - Génère un UUID v4 sinon
 * - Expose l'ID dans `req.requestId` pour les controllers et services
 * - Renvoie l'ID dans le header `X-Request-ID` de la réponse pour la traçabilité côté client
 *
 * @param {import('express').Request}  req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 */
const requestId = (req, res, next) => {
  const id = (req.headers['x-request-id'] || randomUUID()).toString().slice(0, 36);
  req.requestId = id;
  res.setHeader('X-Request-ID', id);
  next();
};

module.exports = requestId;
