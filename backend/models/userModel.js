const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  mobile: String,
  email: String,
  password: String,
  upi: String,
  balance: { type: Number, default: 1000 },
  role: { type: String, default: "user" }
});

module.exports = mongoose.model("User", userSchema);