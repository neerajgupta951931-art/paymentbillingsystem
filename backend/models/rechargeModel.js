const mongoose = require("mongoose");

const rechargeSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    mobile: String,
    operator: String,
    circle: String,
    amount: Number,
    status: String
}, { timestamps: true });

module.exports = mongoose.model("Recharge", rechargeSchema);