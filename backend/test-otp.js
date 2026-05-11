// Test script for OTP functionality
// Run with: node test-otp.js

const axios = require('axios');

const API_BASE_URL = 'http://localhost:5000';

async function testOTP() {
  try {
    console.log('Testing OTP functionality...\n');

    // Test data
    const testData = {
      mobile: '9999999999', // Test mobile number
      email: 'test@example.com'
    };

    console.log('1. Sending OTP request...');
    const sendOtpResponse = await axios.post(`${API_BASE_URL}/api/users/send-otp`, testData);
    console.log('Response:', sendOtpResponse.data);

    if (sendOtpResponse.data.testOtp) {
      console.log(`\n2. OTP for testing: ${sendOtpResponse.data.testOtp}`);

      console.log('\n3. Verifying OTP...');
      const verifyData = {
        otp: sendOtpResponse.data.testOtp,
        name: 'Test User',
        mobile: testData.mobile,
        email: testData.email,
        password: 'testpassword123'
      };

      const verifyResponse = await axios.post(`${API_BASE_URL}/api/users/verify-otp-and-register`, verifyData);
      console.log('Verification Response:', verifyResponse.data);
    }

  } catch (error) {
    console.error('Test failed:', error.response ? error.response.data : error.message);
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testOTP();
}

module.exports = { testOTP };
app.post("/api/users/send-otp", async (req, res) => {

  const { mobile } = req.body;

  const otp = otpGenerator.generate(6, {
    upperCase: false,
    specialChars: false
  });

  await Otp.deleteMany({ mobile });

  await Otp.create({
    mobile,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000)
  });

  console.log("OTP:", otp); // 👈 testing ke liye console me dikhega

  res.json({ success: true, message: "OTP sent" });
});
app.post("/api/users/verify-otp-and-register", async (req, res) => {

  const { mobile, otp, name, email, password } = req.body;

  const record = await Otp.findOne({ mobile, otp });

  if (!record) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  if (record.expiresAt < new Date()) {
    return res.status(400).json({ message: "OTP expired" });
  }

  const user = new User({
    name,
    mobile,
    email,
    password
  });

  await user.save();
  await Otp.deleteMany({ mobile });

  res.json({ success: true, message: "User Registered" });
});