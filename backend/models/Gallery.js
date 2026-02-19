const mongoose = require("mongoose");

const gallerySchema = new mongoose.Schema(
  {
    name: { type: String, default: "n/a" },
    email: { type: String, index: true },
  },
  { timestamps: true }
);

const Gallery = mongoose.model("Gallery", gallerySchema);
module.exports = Gallery;
