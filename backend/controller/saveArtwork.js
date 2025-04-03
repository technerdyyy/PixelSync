const Artwork = require("../models/Artwork");

const saveArtwork = async (req, res) => {
  try {
    const { userEmail, title, image } = req.body;

    if (!userEmail || !title || !image) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newArtwork = new Artwork({ userEmail, title, image });
    await newArtwork.save();

    res.status(201).json({ message: "Artwork saved successfully!" });
  } catch (error) {
    console.error("Error saving artwork:", error);
    res.status(500).json({ message: "Error saving artwork", error });
  }
};

module.exports = saveArtwork;
