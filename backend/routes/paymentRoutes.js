const express = require("express");
const router = express.Router();
const { upiPay } = require("../controllers/paymentController");

router.post("/upi-pay", upiPay);

module.exports = router;