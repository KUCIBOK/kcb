/**
 * P5-TEST-001 — Variables d'environnement injectées avant chaque fichier de test.
 * Ce fichier est chargé via jest.config "setupFiles" (avant les describe/test).
 * Les modèles Mongoose et les services sont mockés dans chaque fichier de test.
 */

process.env.NODE_ENV            = 'test';
process.env.JWT_SECRET          = 'test-jwt-secret-for-jest-minimum-32chars!';
process.env.API_KEY             = 'test-api-key-for-jest';
process.env.WALLET_ENCRYPTION_KEY = 'a'.repeat(64); // 64 hex chars — AES-256-GCM
process.env.ADMIN_EMAIL         = 'admin@kucibok-test.com';
// Valeurs non utilisées en test (DB mockée), présentes pour éviter les warnings
process.env.MONGODB_URI         = 'mongodb://localhost:27017/kucibok-test';
process.env.CORS_ORIGIN         = 'http://localhost:5173';
