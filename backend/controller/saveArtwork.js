const Artwork = require("../models/Artwork");
const cloudinary = require("../cloudinary"); // Import Cloudinary config

const saveArtwork = async (req, res) => {
  try {
    const { userEmail, title, image } = req.body;
    if (!userEmail || !title || !image) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Upload image to Cloudinary
    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "artworks", // Optional folder in Cloudinary
    });

    // Save Cloudinary URL in MongoDB
    const newArtwork = new Artwork({ 
      userEmail, 
      title, 
      image: uploadedImage.secure_url  // ✅ Use Cloudinary URL
    });
    await newArtwork.save();

    res.json({ message: "Artwork saved successfully!", imageUrl: uploadedImage.secure_url });
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ message: "Error saving artwork", error });
  }
};

module.exports = saveArtwork ;
