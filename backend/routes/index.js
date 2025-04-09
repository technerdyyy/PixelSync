const express = require("express");
const router = express.Router();

const loginUser = require("../controller/authController");
const registerUser = require("../controller/registerUser");
const userDetails = require("../controller/userDetails");
const saveArtwork = require("../controller/saveArtwork");
const getUserArtworks = require("../controller/getUserArtworks");
const deleteArtwork = require("../controller/deleteArtworks"); // ✅ Add this
const deleteAllArtworks = require("../controller/deleteAllArtworks"); // ✅ Add this
const chatController = require("../controller/chatController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-details", userDetails);
router.post("/save-artwork", saveArtwork);
router.get("/user-artworks/:email", getUserArtworks);

// ✅ Add these two routes
router.delete("/delete-artwork/:id", deleteArtwork);
router.delete("/delete-all-artworks/:email", deleteAllArtworks);

// Chat routes
router.post("/chat/message", chatController.saveMessage);
router.get("/chat/history/:room", chatController.getChatHistory);

module.exports = router;
