const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const documentSchema = new Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    birth_certificate: { type: String, required: true },
    parent_passport: { type: String, required: true },
    rnottac: { type: String, required: false }, //  Registration number of the taxpayer's account card
    certificate_of_residence_registration: { type: String, required: false },
    certificate_of_registration_of_person: { type: String, required: false },
    status: { type: String, enum: ["pending", "success"] },
  },
  {
    timestamps: { createdAt: true, updatedAt: true },
  }
);

module.exports = mongoose.model("Document", documentSchema);
