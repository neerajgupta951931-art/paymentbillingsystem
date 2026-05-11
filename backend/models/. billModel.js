const mongoose = require("./db");

const billSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    billType: String,
    amount: Number,
    status: {
        type: String,
        enum: ["paid", "pending", "overdue"],
        default: "pending"
    }
}, { timestamps: true });

module.exports = mongoose.model("Bill", billSchema);
