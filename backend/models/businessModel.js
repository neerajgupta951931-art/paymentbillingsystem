const mongoose = require("mongoose");

const businessSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  category: String,
  address: String,
  contactNumber: String,
  email: String,
  upiId: String,

  bankAccount: {
    accountNumber: String,
    ifsc: String,
    bankName: String
  },

  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Business", businessSchema);