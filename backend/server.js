const express = require("express");
const cors = require("cors");
require("dotenv").config();

const connectDB = require("./config/db");

// Routes (modular)
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

// Direct Models (for extra APIs)
const User = require("./models/userModel");
const Payment = require("./models/paymentModel");
const Business = require("./models/businessModel");
const Bill = require("./models/billModel");
const Recharge = require("./models/rechargeModel");
const Reward = require("./models/rewardModel");
const Wallet = require("./models/walletTransactionModel");
const BankTransfer = require("./models/bankTransferModel");

const bcrypt = require("bcryptjs");

const app = express();
const PORT = process.env.PORT || 5000;

// DB Connect
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// ================= BASIC =================

app.get("/", (req, res) => {
  res.send("🚀 API Running");
});


// ================= ROUTES (MODULAR) =================

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/payment", paymentRoutes);


// ================= EXTRA APIs (DIRECT) =================

// Register
app.post("/register", async (req, res) => {
  const { name, mobile, email, password, otp } = req.body;

  const OtpModel = require("./models/otpModel");
  const record = await OtpModel.findOne({ mobile, otp });
  if (!record) return res.status(400).json({ error: "Invalid OTP" });

  const existing = await User.findOne({ mobile });
  if (existing) return res.status(400).json({ error: "User exists" });

  const hash = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    mobile,
    email,
    password: hash,
    balance: 1000
  });

  res.json({ message: "Registered ✅", user });
});

// Login
app.post("/login", async (req, res) => {
  const { mobile, password } = req.body;

  const user = await User.findOne({ mobile });
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(401).json({ error: "Invalid credentials" });

  res.json({ message: "Login success", userId: user._id });
});


// ================= PAYMENT =================

// Pay
app.post("/pay", async (req, res) => {
  const { userId, businessId, amount } = req.body;

  const user = await User.findById(userId);
  if (!user || user.balance < amount) {
    return res.status(400).send("Insufficient balance");
  }

  await Payment.create({
    userId,
    businessId,
    amount,
    transactionId: "TXN" + Date.now()
  });

  user.balance -= amount;
  await user.save();

  res.send("Payment successful ✅");
});


// Scan Pay
app.post("/scan-pay", async (req, res) => {
  const { senderMobile, receiverUPI, amount } = req.body;

  const sender = await User.findOne({ mobile: senderMobile });
  const receiver = await User.findOne({ upi: receiverUPI });

  if (!sender || !receiver) return res.send("User not found");

  if (sender.balance < amount) {
    return res.send("Insufficient balance");
  }

  sender.balance -= amount;
  receiver.balance += amount;

  await sender.save();
  await receiver.save();

  await Wallet.create({
    userId: sender._id,
    type: "debit",
    amount
  });

  await Wallet.create({
    userId: receiver._id,
    type: "credit",
    amount
  });

  res.send("Payment Successful ✅");
});


// Bank Transfer
app.post("/bank-transfer", async (req, res) => {
  const { userId, amount } = req.body;

  const user = await User.findById(userId);

  if (user.balance < amount) {
    return res.status(400).send("Insufficient balance");
  }

  user.balance -= amount;
  await user.save();

  await BankTransfer.create({
    userId,
    amount,
    transactionId: "BNK" + Date.now()
  });

  res.send("Bank transfer successful ✅");
});


// Bill
app.post("/bill", async (req, res) => {
  await Bill.create(req.body);
  res.send("Bill Paid");
});

// Recharge
app.post("/recharge", async (req, res) => {
  await Recharge.create(req.body);
  res.send("Recharge Done");
});

// Reward
app.post("/reward", async (req, res) => {
  await Reward.create(req.body);
  res.send("Reward Redeemed");
});


// Admin
app.get("/admin/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});


// ================= SERVER =================

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
module.exports = app; 