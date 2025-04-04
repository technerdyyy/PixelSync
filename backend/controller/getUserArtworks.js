const Artwork = require("../models/Artwork");

const getUserArtworks = async (req, res) => {
  try {
    const { email } = req.params;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    const artworks = await Artwork.find({ userEmail: email });

    if (artworks.length === 0) {
      return res.status(404).json({ message: "No artworks found for this user." });
    }

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
};

module.exports = getUserArtworks;
