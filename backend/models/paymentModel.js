const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Business",
    required: true
  },

  amount: {
    type: Number,
    required: true
  },

  paymentMethod: {
    type: String,
    enum: ["UPI", "Card", "Cash"],
    required: true
  },

  status: {
    type: String,
    enum: ["pending", "completed", "failed"],
    default: "completed"
  },

  transactionId: {
    type: String,
    unique: true
  }

}, { timestamps: true });

module.exports = mongoose.model("Payment", paymentSchema);