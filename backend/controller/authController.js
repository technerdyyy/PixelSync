const User = require("../models/UserModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function loginUser(request, response) {
  try {
    const { email, password, userId } = request.body;
    console.log("Received Data:", request.body);

    //  Find user by email instead of userId
    const user = await User.findOne({ email });

    //  Check if user exists
    if (!user) {
      return response.status(400).json({
        message: "User not found",
        error: true,
      });
    }

    //  Fix bcrypt function
    const verifyPassword = await bcrypt.compare(password, user.password);

    if (!verifyPassword) {
      return response.status(400).json({
        message: "Incorrect password",
        error: true,
      });
    }

    //  Token data
    const tokenData = {
      id: user._id,
      email: user.email,
    };

    //  Ensure correct JWT secret
    const token = jwt.sign(tokenData, process.env.JWT_SECRET, { expiresIn: "1d" });

    //  Correct cookie options
    const cookieOptions = {
      // httpOnly: true,
      secure: true,
      sameSite: "None", // Required for cross-origin requests
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
    return response.status(500).json({
      message: error.message || "Server error",
      error: true,
    });
  }
}

module.exports = loginUser;
