/**
 * P5-TEST-001 — Tests unitaires des middlewares critiques.
 *  - protect (middleware/api.js) : vérification kcb-api-key
 *  - requireRole (middleware/auth.js) : JWT + rôle
 */
const request = require('supertest');
const express = require('express');
const jwt     = require('jsonwebtoken');

jest.mock('../models/User');
const User = require('../models/User');

// ─── Helpers ───────────────────────────────────────────────────────────────

function makeMinimalApp(middleware) {
  const app = express();
  app.use(express.json());
  app.get('/test', middleware, (_req, res) => res.status(200).json({ ok: true }));
  return app;
}

function validToken(overrides = {}) {
  return jwt.sign(
    { _id: 'uid1', role: 'collector', type: 'access', ...overrides },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// protect — middleware/api.js
// ═══════════════════════════════════════════════════════════════════════════
describe('protect (middleware/api.js)', () => {
  const protect = require('../middleware/api');
  const app = makeMinimalApp(protect);

  test('401 si header kcb-api-key absent', async () => {
    const res = await request(app).get('/test');
    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/API key/i);
  });

  test('401 si clé incorrecte', async () => {
    const res = await request(app).get('/test').set('kcb-api-key', 'mauvaise-cle');
    expect(res.status).toBe(401);
  });

  test('200 avec la bonne clé API', async () => {
    const res = await request(app)
      .get('/test')
      .set('kcb-api-key', process.env.API_KEY);
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// requireRole — middleware/auth.js
// ═══════════════════════════════════════════════════════════════════════════
describe('requireRole (middleware/auth.js)', () => {
  const { auth, admin } = require('../middleware/auth');

  const baseUser = { _id: 'uid1', role: 'collector', isActive: true };

  beforeEach(() => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(baseUser),
    }));
  });

  afterEach(() => jest.clearAllMocks());

  // --- auth (aucune restriction de rôle) ---
  test('401 si header Authorization absent', async () => {
    const res = await request(makeMinimalApp(auth)).get('/test');
    expect(res.status).toBe(401);
  });

  test('401 si token malformé', async () => {
    const res = await request(makeMinimalApp(auth))
      .get('/test')
      .set('Authorization', 'Bearer token.invalide.ici');
    expect(res.status).toBe(401);
  });

  test('401 si token signé avec un mauvais secret', async () => {
    const badToken = jwt.sign({ _id: 'uid1' }, 'mauvais-secret', { expiresIn: '1h' });
    const res = await request(makeMinimalApp(auth))
      .get('/test')
      .set('Authorization', `Bearer ${badToken}`);
    expect(res.status).toBe(401);
  });

  test('401 si utilisateur introuvable en DB', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
    const res = await request(makeMinimalApp(auth))
      .get('/test')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(401);
  });

  test('403 si compte suspendu (isActive: false)', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ ...baseUser, isActive: false }),
    }));
    const res = await request(makeMinimalApp(auth))
      .get('/test')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(403);
  });

  test('200 avec token valide (aucune restriction de rôle)', async () => {
    const res = await request(makeMinimalApp(auth))
      .get('/test')
      .set('Authorization', `Bearer ${validToken()}`);
    expect(res.status).toBe(200);
  });

  // --- admin (rôle 'admin' requis) ---
  test('403 si rôle collector tente un endpoint admin', async () => {
    const res = await request(makeMinimalApp(admin))
      .get('/test')
      .set('Authorization', `Bearer ${validToken({ role: 'collector' })}`);
    expect(res.status).toBe(403);
  });

  test('200 si rôle admin accède à un endpoint admin', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ ...baseUser, role: 'admin' }),
    }));
    const res = await request(makeMinimalApp(admin))
      .get('/test')
      .set('Authorization', `Bearer ${validToken({ role: 'admin' })}`);
    expect(res.status).toBe(200);
  });
});
