const User = require("../models/userModel");
const Otp = require("../models/otpModel");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");

// Send OTP
exports.sendOtp = async (req, res) => {
    const { mobile } = req.body;

    const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false
    });

    await Otp.create({
        mobile,
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log("OTP:", otp);

    res.json({ message: "OTP sent" });
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
    const { mobile, otp } = req.body;

    const record = await Otp.findOne({ mobile, otp });

    if (!record) return res.status(400).json({ error: "Invalid OTP" });

    let user = await User.findOne({ mobile });

    if (!user) {
        user = await User.create({ mobile });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ token, user });
};