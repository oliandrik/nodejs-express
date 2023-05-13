const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const fileSchema = new Schema(
  {
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    filename: { type: String },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = mongoose.model("File", fileSchema);
