require('dotenv').config()

/**
 * Fonction pour obtenir une variable d'environnement avec valeur par défaut
 */
const getEnvVar = (name, defaultValue) => {
  const value = process.env[name];
  if (value === undefined) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Environment variable ${name} is required`);
  }
  return value;
};

exports.config = {
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  port: parseInt(getEnvVar('PORT', '3000'), 10),
  host: getEnvVar('HOST', '0.0.0.0'),

  // Clé API partagée frontend↔backend (header kcb-api-key)
  apiKey: getEnvVar('API_KEY', ''),

  // URL publique du backend (utilisée dans les PDFs et les emails)
  apiUrl: getEnvVar('API_URL', 'http://localhost:3000'),

  database: {
    uri: getEnvVar('MONGODB_URI', 'mongodb://localhost:27017/kucibok'),
  },

  redis: {
    // Optionnel en dev — obligatoire en prod pour la blacklist JWT et le cache
    url: getEnvVar('REDIS_URL', ''),
  },

  jwt: {
    secret:           getEnvVar('JWT_SECRET', 'your-super-secret-jwt-key-change-in-production'),
    expiresIn:        getEnvVar('JWT_EXPIRES_IN', '1h'),
    refreshSecret:    getEnvVar('REFRESH_TOKEN_SECRET', 'your-super-secret-refresh-key-change-in-production'),
    refreshExpiresIn: getEnvVar('REFRESH_TOKEN_EXPIRES_IN', '30d'),
  },

  cors: {
    origin: getEnvVar('CORS_ORIGIN', 'http://localhost:5173'),
  },

  // SMTP — utilisé uniquement par campaign.controller.js pour l'envoi de campagnes email en masse.
  // Tout le reste des emails passe par Resend (mailer.service.js).
  smtp: {
    host: getEnvVar('SMTP_HOST', 'smtp.ethereal.email'),
    port: parseInt(getEnvVar('SMTP_PORT', '587'), 10),
    user: getEnvVar('SMTP_USER', ''),
    pass: getEnvVar('SMTP_PASS', ''),
  },

  rateLimit: {
    windowMs:    parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', '900000'), 10),
    maxRequests: parseInt(getEnvVar('RATE_LIMIT_MAX_REQUESTS', '100'), 10),
  },

  upload: {
    maxFileSize: parseInt(getEnvVar('MAX_FILE_SIZE', '10485760'), 10),
    path: getEnvVar('UPLOAD_PATH', 'public/uploads'),
  },

  // PayDunya — paiements Afrique de l'Ouest (Wave, Orange Money, Free Money…)
  paydunya: {
    masterKey: getEnvVar('PAYDUNYA_MASTER_KEY', 'test-master-key'),
    privateKey: getEnvVar('PAYDUNYA_PRIVATE_KEY', 'test-private-key'),
    token:     getEnvVar('PAYDUNYA_TOKEN', 'test-token'),
    mode:      getEnvVar('PAYDUNYA_MODE', 'sandbox'),
    store: {
      name:    getEnvVar('PAYDUNYA_STORE_NAME', 'Kucibok'),
      address: getEnvVar('PAYDUNYA_STORE_ADDRESS', 'Dakar, Sénégal'),
      phone:   getEnvVar('PAYDUNYA_STORE_PHONE', '+221000000000'),
      tagline: getEnvVar('PAYDUNYA_STORE_TAGLINE', "Plateforme d'art africain certifié"),
    },
  },

  adminEmail:    getEnvVar('ADMIN_EMAIL', 'admin@kucibok.com'),
  alertReceiver: getEnvVar('ALERT_RECEIVER', 'admin@kucibok.com'),

  wallet: {
    encryptionKey: getEnvVar('WALLET_ENCRYPTION_KEY', ''),
  },

  // Logidoo — intégration logistique transfrontalière (corridors AF↔FR)
  cloudinary: {
    cloudName:  getEnvVar('CLOUDINARY_CLOUD_NAME', ''),
    apiKey:     getEnvVar('CLOUDINARY_API_KEY', ''),
    apiSecret:  getEnvVar('CLOUDINARY_API_SECRET', ''),
  },

  resend: {
    apiKey: getEnvVar('RESEND_API_KEY', ''),
  },

  logidoo: {
    apiKey: getEnvVar('LOGIDOO_API_KEY', ''),
  },

  // PDF — chemin vers le binaire Chromium sur le VPS Ubuntu (Puppeteer)
  chrome: {
    bin: getEnvVar('CHROME_BIN', '/snap/bin/chromium'),
  },

  log: {
    level: getEnvVar('LOG_LEVEL', 'info'),
  },
}