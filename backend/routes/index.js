const express = require("express");
const router = express.Router();

const loginUser = require("../controller/authController");
const registerUser = require("../controller/registerUser");
const userDetails = require("../controller/userDetails");
const saveArtworks  = require("../controller/saveArtwork");
const getUserArtworks = require("../controller/getUserArtworks"); 

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/user-details", userDetails);
router.post("/save-artwork", saveArtworks );
router.get("/user-artworks/:email", getUserArtworks); 

module.exports = router;