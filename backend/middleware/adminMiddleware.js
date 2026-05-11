const User = require("../models/userModel");

module.exports = async (req, res, next) => {
    const user = await User.findById(req.userId);

    if (user.role !== "admin") {
        return res.status(403).send("Access denied");
    }

    next();
};