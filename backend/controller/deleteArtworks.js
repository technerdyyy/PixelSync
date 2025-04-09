const Artwork = require("../models/Artwork");

const deleteArtwork = async (req, res) => {
  try {
    const { id } = req.params;
    await Artwork.findByIdAndDelete(id);
    res.status(200).json({ message: "Artwork deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete artwork" });
  }
};

module.exports = deleteArtwork;