const mongoose = require("mongoose");

const documentSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    path: { type: String, required: true },
    type: { type: String, required: true },
    artworkId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artwork",
      required: true,
    },
  }, {
    timestamps: true,
  }
);

const Document = mongoose.model("Document", documentSchema);

module.exports = Document;
