const mongoose = require("mongoose");

const billSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  billType: {
    type: String,
    enum: ["electricity", "water", "internet", "property", "gas"],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "paid", "overdue"],
    default: "paid"
  },
  dueDate: {
    type: Date
  }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
