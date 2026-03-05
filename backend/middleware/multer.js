// P1-SEC-012 — Validation MIME par magic bytes (non spoofable)
// P2-ARCH-006 — Upload vers Cloudinary CDN (plus de stockage disque)
const multer = require('multer');
const cloudinary = require('../config/cloudinaryConfig');
const logger = require('../utils/logger');

// Signatures magic bytes des types autorisés
const MAGIC_SIGNATURES = [
  // JPEG : FF D8 FF
  { mime: 'image/jpeg', ext: 'jpg', offset: 0, bytes: [0xFF, 0xD8, 0xFF] },
  // PNG  : 89 50 4E 47 0D 0A 1A 0A
  { mime: 'image/png',  ext: 'png', offset: 0, bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] },
  // GIF  : 47 49 46 38
  { mime: 'image/gif',  ext: 'gif', offset: 0, bytes: [0x47, 0x49, 0x46, 0x38] },
  // WebP : RIFF....WEBP (octets 0-3 = RIFF, octets 8-11 = WEBP)
  { mime: 'image/webp', ext: 'webp', offset: 0, bytes: [0x52, 0x49, 0x46, 0x46] },
];

/**
 * Détecte le vrai type MIME d'un buffer par ses magic bytes.
 * @param {Buffer} buffer
 * @returns {{ mime: string, ext: string } | null}
 */
function detectMagicType(buffer) {
  for (const sig of MAGIC_SIGNATURES) {
    const slice = buffer.slice(sig.offset, sig.offset + sig.bytes.length);
    if (sig.bytes.every((b, i) => slice[i] === b)) {
      if (sig.mime === 'image/webp') {
        const webpMarker = buffer.slice(8, 12);
        if (Buffer.from('WEBP').equals(webpMarker)) return sig;
        continue;
      }
      return sig;
    }
  }
  return null;
}

/**
 * Upload un buffer vers Cloudinary et retourne l'URL sécurisée.
 * @param {Buffer} buffer - Buffer de l'image en mémoire
 * @param {string} mimeType - Type MIME détecté par magic bytes
 * @returns {Promise<{ url: string, publicId: string }>}
 */
function uploadToCloudinary(buffer, mimeType) {
  return new Promise((resolve, reject) => {
    const folder = 'kucibok/uploads';
    const resourceType = 'image';

    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType, format: mimeType.split('/')[1] },
      (error, result) => {
        if (error) return reject(error);
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    stream.end(buffer);
  });
}

// Stockage en mémoire pour inspecter le buffer AVANT upload
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 }, // 20 Mo
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowed.includes(file.mimetype)) {
      return cb(new Error('Type de fichier non autorisé.'), false);
    }
    cb(null, true);
  },
});

/**
 * Middleware Express : multer (mémoire) → validation magic bytes → upload Cloudinary.
 * Expose req.file.cloudinaryUrl et req.file.cloudinaryPublicId pour les controllers.
 *
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').NextFunction} next
 * @returns {void}
 */
const multerMiddleware = (req, res, next) => {
  upload.single('image')(req, res, async (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({ message: `Erreur upload : ${err.message}` });
    }
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    if (!req.file) {
      return next();
    }

    // Vérification des magic bytes réels
    const detected = detectMagicType(req.file.buffer);
    if (!detected) {
      return res.status(400).json({ message: 'Fichier rejeté : type réel non autorisé (magic bytes invalides).' });
    }

    // Upload vers Cloudinary depuis le buffer mémoire
    try {
      const { url, publicId } = await uploadToCloudinary(req.file.buffer, detected.mime);
      req.file.cloudinaryUrl      = url;
      req.file.cloudinaryPublicId = publicId;
      req.file.mimetype           = detected.mime;
      next();
    } catch (uploadErr) {
      logger.error('Erreur upload Cloudinary:', { error: uploadErr.message });
      return res.status(500).json({ message: 'Erreur serveur lors du traitement du fichier.' });
    }
  });
};

module.exports = multerMiddleware;
