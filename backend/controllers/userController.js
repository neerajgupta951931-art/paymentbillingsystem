const User = require("../models/userModel");

exports.getProfile = async (req, res) => {
    const user = await User.findById(req.userId);
    res.json(user);
};