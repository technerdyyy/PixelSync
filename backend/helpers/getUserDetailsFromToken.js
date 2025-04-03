const jwt = require('jsonwebtoken');
const UserModel = require('../models/UserModel');

const getUserDetailsFromToken = async (token) => {
    if (!token) {
        throw new Error("Session expired or token missing.");
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id);

        if (!user) {
            throw new Error("User not found.");
        }

        return user;
    } catch (error) {
        console.error("JWT Verification Error:", error.message);
        throw new Error("Invalid or expired token.");
    }
};


module.exports = getUserDetailsFromToken;