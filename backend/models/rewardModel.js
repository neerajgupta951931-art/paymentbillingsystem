const mongoose = require("mongoose");

const rewardSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    rewardName: String,
    pointsSpent: Number
}, { timestamps: true });

module.exports = mongoose.model("Reward", rewardSchema);