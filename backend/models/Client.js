const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema(
  {
    nom: String,
    prenom: String,
    email: {
      type: String,
      unique: true,
      sparse: true,
    },
    telephone: {
      type: String,
      unique: true,
      sparse: true,
    },
    ville: String,
    artistId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isDeletedByArtist: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Client", clientSchema);
