const User = require("../models/userModel");

// UPI Pay
exports.upiPay = async (req, res) => {
    const { senderUPI, receiverUPI, amount } = req.body;

    const sender = await User.findOne({ upi: senderUPI });
    const receiver = await User.findOne({ upi: receiverUPI });

    if (!sender || !receiver) {
        return res.send("User not found");
    }

    if (sender.balance < amount) {
        return res.send("Insufficient balance");
    }

    sender.balance -= amount;
    receiver.balance += amount;

    await sender.save();
    await receiver.save();

    res.send("UPI Payment Success ✅");
};