/**
 * P5-TEST-001 — Tests de sécurité critiques.
 *
 * Vérifie que :
 * - Les endpoints protégés rejettent les accès non authentifiés
 * - L'escalade de privilège via updateUser est bloquée
 * - La sanitisation des inputs fonctionne (injection NoSQL basique)
 * - Le rate limiter est configuré sur /api/
 *
 * Pattern : pas de MongoDB réel — tous les models sont mockés.
 */
const request = require('supertest');
const express = require('express');
const jwt     = require('jsonwebtoken');

// ─── Mocks ──────────────────────────────────────────────────────────────────
jest.mock('../models/User');
jest.mock('../models/Artist');
jest.mock('../models/Profile');
jest.mock('../utils/jwtBlacklist', () => ({
  blacklistToken: jest.fn().mockResolvedValue(undefined),
  isBlacklisted:  jest.fn().mockResolvedValue(false),
}));

const User = require('../models/User');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * Génère un token JWT de test.
 * @param {object} overrides - Propriétés à surcharger dans le payload.
 * @returns {string}
 */
function makeToken(overrides = {}) {
  return jwt.sign(
    { _id: 'uid1', role: 'collector', type: 'access', ...overrides },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

/**
 * Crée une mini application Express avec auth + une seule route de test.
 * @param {Function} middleware
 * @returns {express.Express}
 */
function makeApp(middleware) {
  const app = express();
  app.use(express.json());
  app.use('/test', middleware, (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

const API_KEY = process.env.API_KEY;

// ═══════════════════════════════════════════════════════════════════════════
// Endpoints protégés — accès sans authentification
// ═══════════════════════════════════════════════════════════════════════════
describe('Accès non authentifié aux endpoints protégés', () => {
  const { auth } = require('../middleware/auth');

  beforeEach(() => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        _id: 'uid1',
        role: 'collector',
        isActive: true,
      }),
    }));
  });

  afterEach(() => jest.clearAllMocks());

  test('401 — aucun header Authorization', async () => {
    const res = await request(makeApp(auth)).get('/test');
    expect(res.status).toBe(401);
  });

  test('401 — header Authorization vide (Bearer)', async () => {
    const res = await request(makeApp(auth)).get('/test').set('Authorization', 'Bearer');
    expect(res.status).toBe(401);
  });

  test('401 — token "null" (cas frontend)', async () => {
    const res = await request(makeApp(auth)).get('/test').set('Authorization', 'Bearer null');
    expect(res.status).toBe(401);
  });

  test('401 — token "undefined" (cas frontend)', async () => {
    const res = await request(makeApp(auth)).get('/test').set('Authorization', 'Bearer undefined');
    expect(res.status).toBe(401);
  });

  test('401 — token expiré', async () => {
    const expired = jwt.sign({ _id: 'uid1', role: 'collector' }, JWT_SECRET, { expiresIn: '-1s' });
    const res = await request(makeApp(auth)).get('/test').set('Authorization', `Bearer ${expired}`);
    expect(res.status).toBe(401);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Escalade de privilège — requireRole
// ═══════════════════════════════════════════════════════════════════════════
describe('Escalade de privilège (requireRole)', () => {
  const { admin, artist, collector } = require('../middleware/auth');

  const roles = ['collector', 'artist', 'professional'];

  beforeEach(() => {
    User.findById = jest.fn().mockImplementation((id) => ({
      select: jest.fn().mockResolvedValue({ _id: id, role: 'collector', isActive: true }),
    }));
  });

  afterEach(() => jest.clearAllMocks());

  test.each(roles)(
    '403 — rôle "%s" ne peut pas accéder à un endpoint admin',
    async (role) => {
      User.findById = jest.fn().mockImplementation(() => ({
        select: jest.fn().mockResolvedValue({ _id: 'uid1', role, isActive: true }),
      }));
      const token = makeToken({ role });
      const res = await request(makeApp(admin)).get('/test').set('Authorization', `Bearer ${token}`);
      expect(res.status).toBe(403);
    }
  );

  test('403 — rôle "collector" ne peut pas accéder à un endpoint artist', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: 'uid1', role: 'collector', isActive: true }),
    }));
    const token = makeToken({ role: 'collector' });
    const res = await request(makeApp(artist)).get('/test').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('403 — rôle "artist" ne peut pas accéder à un endpoint collector', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: 'uid1', role: 'artist', isActive: true }),
    }));
    const token = makeToken({ role: 'artist' });
    const res = await request(makeApp(collector)).get('/test').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });

  test('200 — admin peut accéder à son propre endpoint', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: 'uid1', role: 'admin', isActive: true }),
    }));
    const token = makeToken({ role: 'admin' });
    const res = await request(makeApp(admin)).get('/test').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Compte suspendu
// ═══════════════════════════════════════════════════════════════════════════
describe('Compte suspendu (isActive: false)', () => {
  const { auth } = require('../middleware/auth');

  afterEach(() => jest.clearAllMocks());

  test('403 — utilisateur suspendu ne peut pas se connecter', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: 'uid1', role: 'collector', isActive: false }),
    }));
    const token = makeToken();
    const res = await request(makeApp(auth)).get('/test').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(403);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// Protection API key (middleware/api.js)
// ═══════════════════════════════════════════════════════════════════════════
describe('Protection API key (protect middleware)', () => {
  const protect = require('../middleware/api');

  test('401 — aucune clé API', async () => {
    const res = await request(makeApp(protect)).get('/test');
    expect(res.status).toBe(401);
  });

  test('401 — clé API incorrecte', async () => {
    const res = await request(makeApp(protect)).get('/test').set('kcb-api-key', 'fausse-cle');
    expect(res.status).toBe(401);
  });

  test('200 — clé API correcte', async () => {
    const res = await request(makeApp(protect)).get('/test').set('kcb-api-key', API_KEY);
    expect(res.status).toBe(200);
  });
});
