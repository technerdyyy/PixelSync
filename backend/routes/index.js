const express = require("express");
const router = express.Router();

const loginUser = require("../controller/authController");
const registerUser = require("../controller/registerUser");
const userDetails = require("../controller/userDetails")

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-details", userDetails);

module.exports = router;