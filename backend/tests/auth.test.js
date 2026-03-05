/**
 * P5-TEST-001 — Tests d'intégration du controller auth.
 *
 * Teste les flux : register, login, logout, refresh-token.
 * Tous les models Mongoose et services email sont mockés —
 * pas de connexion MongoDB ni d'envoi d'email réel.
 */
const request = require('supertest');
const express = require('express');
const jwt     = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');

// ─── Mocks ──────────────────────────────────────────────────────────────────
jest.mock('../models/User');
jest.mock('../models/Artist');
jest.mock('../models/Profile');
jest.mock('../models/Wallet');
jest.mock('../models/Transaction');
jest.mock('../models/Review');
jest.mock('../models/Collection');
jest.mock('../models/BlogPost');
jest.mock('../models/Subscription');
jest.mock('../models/Plan');
jest.mock('../models/Artwork');
jest.mock('../utils/jwtBlacklist', () => ({
  blacklistToken: jest.fn().mockResolvedValue(undefined),
  isBlacklisted:  jest.fn().mockResolvedValue(false),
}));
jest.mock('../services/mailer.service', () => ({
  sendWelcomeEmail:                  jest.fn().mockResolvedValue(undefined),
  sendPasswordResetEmail:            jest.fn().mockResolvedValue(undefined),
  sendUserRegistrationAlertToAdmin:  jest.fn().mockResolvedValue(undefined),
  sendEmailChangeNotification:       jest.fn().mockResolvedValue(undefined),
  sendPasswordChangeNotification:    jest.fn().mockResolvedValue(undefined),
  sendVerificationEmail:             jest.fn().mockResolvedValue(undefined),
}));
jest.mock('ethers', () => ({
  Wallet: {
    createRandom: jest.fn().mockReturnValue({
      address:      '0xabc123',
      privateKey:   '0xprivkey',
      mnemonic:     { phrase: 'test mnemonic words twelve total here' },
    }),
  },
}));

const User    = require('../models/User');
const WalletModel = require('../models/Wallet');

// ─── App de test ─────────────────────────────────────────────────────────────

/**
 * Construit une mini-app Express avec les routes auth + errorHandler.
 * Évite de lancer le serveur complet (et la connexion MongoDB).
 * @returns {express.Express}
 */
function buildAuthApp() {
  const app = express();
  app.use(express.json());

  const authRoutes = require('../routes/auth.routes');
  const { errorHandler } = require('../middleware/errorHandler');
  const protect = require('../middleware/api');

  // API key obligatoire comme en production
  app.use((req, res, next) => protect(req, res, next));
  app.use('/api/auth', authRoutes);
  app.use(errorHandler);
  return app;
}

const API_KEY   = process.env.API_KEY;
const JWT_SECRET = process.env.JWT_SECRET;

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Génère un token d'accès JWT valide pour les tests.
 * @param {object} payload
 * @returns {string}
 */
function makeAccessToken(payload = {}) {
  return jwt.sign(
    { _id: 'uid1', role: 'collector', type: 'access', ...payload },
    JWT_SECRET,
    { expiresIn: '1h' }
  );
}

// Headers de base avec la clé API
const baseHeaders = { 'kcb-api-key': API_KEY, 'Content-Type': 'application/json' };

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/auth/register
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/register', () => {
  let app;

  beforeAll(() => {
    app = buildAuthApp();
  });

  afterEach(() => jest.clearAllMocks());

  const validPayload = {
    email:    'test@kucibok.com',
    password: 'Password123!',
    role:     'collector',
    name:     'Test User',
    username: 'testuser',
    country:  'SN',
  };

  test('400 — champs requis manquants (email absent)', async () => {
    const { email: _e, ...noEmail } = validPayload;
    const res = await request(app)
      .post('/api/auth/register')
      .set(baseHeaders)
      .send(noEmail);
    expect(res.status).toBe(400);
  });

  test('400 — champs requis manquants (password absent)', async () => {
    const { password: _p, ...noPassword } = validPayload;
    const res = await request(app)
      .post('/api/auth/register')
      .set(baseHeaders)
      .send(noPassword);
    expect(res.status).toBe(400);
  });

  test('409 — email déjà utilisé', async () => {
    User.findOne = jest.fn().mockResolvedValue({ _id: 'uid1', email: validPayload.email });
    const res = await request(app)
      .post('/api/auth/register')
      .set(baseHeaders)
      .send(validPayload);
    expect(res.status).toBe(409);
  });

  test('201 — inscription réussie', async () => {
    User.findOne = jest.fn().mockResolvedValue(null);
    const savedUser = {
      _id: 'uid1',
      email: validPayload.email,
      role: validPayload.role,
      name: validPayload.name,
      username: validPayload.username,
      isActive: false,
      isEmailVerified: false,
      toObject: jest.fn().mockReturnValue({ _id: 'uid1', role: 'collector' }),
    };
    const saveMock = jest.fn().mockResolvedValue(savedUser);
    User.mockImplementation(() => ({ ...savedUser, save: saveMock }));
    WalletModel.mockImplementation(() => ({ save: jest.fn().mockResolvedValue({}) }));

    const res = await request(app)
      .post('/api/auth/register')
      .set(baseHeaders)
      .send(validPayload);
    // Inscription réussie = 200 ou 201 selon implémentation
    expect([200, 201]).toContain(res.status);
    expect(res.body).toHaveProperty('user');
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/auth/login
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/login', () => {
  let app;

  beforeAll(() => {
    app = buildAuthApp();
  });

  afterEach(() => jest.clearAllMocks());

  test('404 — payload vide (email undefined → user non trouvé)', async () => {
    // Le controller cherche User.findOne({ email: undefined }) sans validation préalable
    User.findOne = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
    const res = await request(app)
      .post('/api/auth/login')
      .set(baseHeaders)
      .send({});
    expect(res.status).toBe(404);
  });

  test('404 — email inexistant', async () => {
    // Le controller retourne notFound (404) pour éviter l'énumération d'email
    User.findOne = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(null),
    }));
    const res = await request(app)
      .post('/api/auth/login')
      .set(baseHeaders)
      .send({ email: 'ghost@kucibok.com', password: 'pass' });
    expect(res.status).toBe(404);
  });

  test('401 — mot de passe incorrect', async () => {
    const hashedPassword = await bcrypt.hash('correctPassword', 10);
    User.findOne = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({
        _id: 'uid1',
        email: 'test@kucibok.com',
        password: hashedPassword,
        role: 'collector',
        isActive: true,
        isEmailVerified: true,
        toObject: jest.fn().mockReturnValue({ _id: 'uid1', role: 'collector' }),
      }),
    }));
    const res = await request(app)
      .post('/api/auth/login')
      .set(baseHeaders)
      .send({ email: 'test@kucibok.com', password: 'wrongPassword' });
    expect(res.status).toBe(401);
  });

  test('200 — connexion réussie avec token dans la réponse', async () => {
    const hashedPassword = await bcrypt.hash('Password123!', 10);
    const mockUser = {
      _id: 'uid1',
      email: 'test@kucibok.com',
      password: hashedPassword,
      role: 'collector',
      isActive: true,
      isEmailVerified: true,
      likedArtworks: [],
      // save() est appelé par le controller pour mettre à jour lastLogin
      save: jest.fn().mockResolvedValue(undefined),
      toObject: jest.fn().mockReturnValue({
        _id: 'uid1',
        email: 'test@kucibok.com',
        role: 'collector',
        likedArtworks: [],
      }),
    };
    User.findOne = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue(mockUser),
    }));

    const res = await request(app)
      .post('/api/auth/login')
      .set(baseHeaders)
      .send({ email: 'test@kucibok.com', password: 'Password123!' });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body).toHaveProperty('user');
    expect(res.body.user.password).toBeUndefined(); // Le mdp ne doit JAMAIS être renvoyé
  });
});

// ═══════════════════════════════════════════════════════════════════════════
// POST /api/auth/logout
// ═══════════════════════════════════════════════════════════════════════════
describe('POST /api/auth/logout', () => {
  let app;

  beforeAll(() => {
    app = buildAuthApp();
  });

  afterEach(() => jest.clearAllMocks());

  test('401 — déconnexion sans token (auth requis)', async () => {
    // La route logout exige le middleware auth — sans token → 401
    const res = await request(app)
      .post('/api/auth/logout')
      .set(baseHeaders);
    expect(res.status).toBe(401);
  });

  test('200 — déconnexion avec token valide — token révoqué', async () => {
    User.findById = jest.fn().mockImplementation(() => ({
      select: jest.fn().mockResolvedValue({ _id: 'uid1', role: 'collector', isActive: true }),
    }));
    const token = makeAccessToken();
    const { blacklistToken } = require('../utils/jwtBlacklist');

    const res = await request(app)
      .post('/api/auth/logout')
      .set({ ...baseHeaders, Authorization: `Bearer ${token}` });

    expect(res.status).toBe(200);
    expect(blacklistToken).toHaveBeenCalled();
  });
});
