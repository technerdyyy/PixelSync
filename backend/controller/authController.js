const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginUser(request, response) {
  try {
    const { email, password, userId } = request.body; // ✅ FIXED typo
    console.log("Received Data:", request.body);

    const user = await User.findOne({ email });

    if (!user) {
      return response.status(400).json({
        message: "User not found",
        error: true,
      });
    }

    const verifyPassword = await bcrypt.compare(password, user.password); // ✅ password now defined

    if (!verifyPassword) {
      return response.status(400).json({
        message: "Incorrect password",
        error: true,
      });
    }

    const tokenData = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

    const cookieOptions = {
      secure: true,
      sameSite: "None",
    };

    return response
      .cookie("token", token, cookieOptions)
      .status(200)
      .json({
        message: "Login successful",
        token: token,
        success: true,
      });

  } catch (error) {
    console.error("Login Error:", error); // ✅ Add this line for clearer debugging
    return response.status(500).json({
      message: error.message || "Server error",
      error: true,
    });
  }
}

module.exports = loginUser;
