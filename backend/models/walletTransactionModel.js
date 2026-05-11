const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    type: {
        type: String,
        enum: ["credit", "debit"]
    },
    amount: Number,
    description: String
}, { timestamps: true });

module.exports = mongoose.model("WalletTransaction", walletSchema);