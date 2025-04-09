const Artwork = require("../models/Artwork");

const deleteAllArtworks = async (req, res) => {
  try {
    const { email } = req.params;
    await Artwork.deleteMany({ email });
    res.status(200).json({ message: "All artworks deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete artworks" });
  }
};

module.exports = deleteAllArtworks;
