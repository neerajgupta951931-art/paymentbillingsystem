const mongoose = require("mongoose");

const bankTransferSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false // allowing false for now if frontend doesn't pass userId properly yet
  },
  account: {
    type: String,
    required: true
  },
  ifsc: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  remark: {
    type: String
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

module.exports = mongoose.model("BankTransfer", bankTransferSchema);
