const Artwork = require("../models/Artwork");

const getUserArtworks = async (req, res) => {
  try {
    const { email } = req.params;
    const artworks = await Artwork.find({ userEmail: email });

    res.status(200).json(artworks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch artworks" });
  }
};

module.exports = getUserArtworks;
