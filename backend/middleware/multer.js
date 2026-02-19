const multer = require('multer');
const fs = require('fs');
const path = require('path');

const MIMES_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
}

const storage = multer.diskStorage({
    destination: (req, file, callback) => {
        const uploadPath = `public/uploads/${new Date().getFullYear()}/${new Date().getMonth() + 1}`;
        fs.mkdirSync(path.resolve(uploadPath), { recursive: true });
        callback(null, uploadPath);
    },
    filename: (req, file, callback) => {
        const name = file.originalname.split(' ').join('_');
        const extension = MIMES_TYPES[file.mimetype];
        callback(null, name + Date.now() + '.' + extension);
    }
});

// Limite de taille de fichier à 20 Mo (ajuste la valeur si besoin)
module.exports = multer({
    storage,
    limits: { fileSize: 20 * 1024 * 1024 } // 20 Mo
}).single('image');