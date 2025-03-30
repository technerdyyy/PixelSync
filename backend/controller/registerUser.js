const UserModel = require("../models/UserModel");
const bcryptjs = require("bcryptjs");

async function registerUser(request, response) {
    try {
        const { name, email, password } = request.body;

        // Check if user already exists
        const checkEmail = await UserModel.findOne({ email });

        if (checkEmail) {
            return response.status(400).json({
                message: "User already exists",
                error: true,
            });
        }

        // Hash password before saving
        const salt = await bcryptjs.genSalt(10);
        const hashPassword = await bcryptjs.hash(password, salt);

        // Create new user
        const newUser = new UserModel({
            name,
            email,
            password: hashPassword,
        });

        const savedUser = await newUser.save();

        return response.status(201).json({
            message: "User registered successfully",
            data: savedUser,
            success: true,
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
        });
    }
}

module.exports = registerUser;
