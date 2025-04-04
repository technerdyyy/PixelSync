const express = require("express");
const router = express.Router();

const loginUser = require("../controller/authController");
const registerUser = require("../controller/registerUser");
const userDetails = require("../controller/userDetails");
const saveArtwork = require("../controller/saveArtwork");
const getUserArtworks = require("../controller/getUserArtworks");
const chatController = require("../controller/chatController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-details", userDetails);
router.post("/save-artwork", saveArtwork);
router.get("/user-artworks/:email", getUserArtworks);

// Chat routes
router.post("/chat/message", chatController.saveMessage);
router.get("/chat/history/:room", chatController.getChatHistory);

module.exports = router;