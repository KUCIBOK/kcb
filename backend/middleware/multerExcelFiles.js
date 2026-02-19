const multer = require("multer");
const fs = require("fs");
const path = require("path");

const MIMES_TYPES = {
  "text/csv": "csv",
  "application/vnd.ms-excel": "xls",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const uploadPath = "public/uploads/clients";
    fs.mkdirSync(path.resolve(uploadPath), { recursive: true });
    callback(null, uploadPath);
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_");
    const extension =
      MIMES_TYPES[file.mimetype] || path.extname(file.originalname).slice(1);
    callback(null, `${name}${Date.now()}.${extension}`);
  },
});

module.exports = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
}).single("file");
