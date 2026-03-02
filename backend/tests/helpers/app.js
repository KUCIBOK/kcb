/**
 * P5-TEST-001 — Factory d'application Express minimale pour les tests.
 * Inclut : parsing JSON + middleware API key + routes injectées + error handler.
 * Ne connecte PAS à la base de données (modèles mockés dans chaque test).
 */
const express = require('express');
const protect = require('../../middleware/api');
const { errorHandler } = require('../../middleware/errorHandler');

/**
 * Crée une application Express de test.
 * @param {...[string, Router]} routePairs — ex: ['/api/auth', authRoutes]
 */
function createApp(...routePairs) {
  const app = express();
  app.use(express.json());
  app.use(protect); // kcb-api-key requis sur toutes les routes
  for (const [path, router] of routePairs) {
    app.use(path, router);
  }
  app.use(errorHandler);
  return app;
}

/**
 * Génère un JWT de test signé avec JWT_SECRET de l'environnement.
 * @param {{ _id?: string, role?: string, email?: string }} payload
 */
function makeToken(payload = {}) {
  const jwt = require('jsonwebtoken');
  return jwt.sign(
    {
      _id:   payload._id   ?? 'test-user-id',
      role:  payload.role  ?? 'collector',
      email: payload.email ?? 'test@kucibok.test',
      type:  'access',
      jti:   'test-jti-' + Date.now(),
    },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

/** Header kcb-api-key à inclure dans toutes les requêtes de test. */
const API_HEADER = { 'kcb-api-key': process.env.API_KEY ?? 'test-api-key-for-jest' };

module.exports = { createApp, makeToken, API_HEADER };
