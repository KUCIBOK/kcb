/**
 * P5-TEST-001 — Configuration globale Jest.
 *
 * Injecte les variables d'environnement nécessaires aux tests unitaires
 * AVANT le chargement de tout module (dotenv n'est pas requis ici).
 *
 * ⚠️ Ces valeurs sont fictives et réservées aux tests — ne jamais
 *    utiliser des secrets de production dans ce fichier.
 */

// JWT & API key — valeurs de test uniquement
process.env.JWT_SECRET = 'test-jwt-secret-64chars-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.REFRESH_TOKEN_SECRET = 'test-refresh-secret-64chars-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';
process.env.API_KEY = 'test-api-key-kucibok';

// Base de données — jamais connectée pendant les tests unitaires
process.env.MONGODB_URI = 'mongodb://localhost:27017/kucibok_test';

// Redis — désactivé en tests (les mocks gèrent la blacklist)
process.env.REDIS_URL = '';

// Email — pas d'envoi réel en tests
process.env.RESEND_API_KEY = 'test-resend-key';

// App
process.env.NODE_ENV = 'test';
process.env.PORT = '3001';
process.env.HOST = 'localhost';
process.env.CORS_ORIGIN = 'http://localhost:5173';
