const express = require("express");
const router = express.Router();
const Artwork = require("../models/Artwork");
const auth = require("../middleware/auth");
const { uploadToCloudinary } = require("../services/cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const User = require("../models/User");

// Create Artwork (Artist only)
router.post("/", auth, upload.single("image"), async (req, res) => {
  const { title, description, category, isForSale, price } = req.body;

  try {
    // Validate input
    if (!title || !category || !req.file) {
      return res
        .status(400)
        .json({ message: "Title, category, and image are required" });
    }

    // Upload image to Cloudinary
    const imageUrl = await uploadToCloudinary(
      "ArtMe/artworks",
      req.file.buffer
    );

    const artwork = new Artwork({
      title,
      description,
      imageUrl,
      images: [imageUrl],
      category,
      artist: req.user.id,
      isForSale: isForSale === "true", // FormData sends boolean as string
      price: isForSale === "true" ? price : undefined,
    });

    await artwork.save();

    // Update the user's artworks array with the new artwork ID
    await User.findByIdAndUpdate(req.user.id, {
      $push: { artworks: artwork._id },
    });

    res.status(201).json(artwork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error, try again later" });
  }
});

// Get All Artworks (Public)
router.get("/", async (req, res) => {
  try {
    const { limit } = req.query;

    const query = Artwork.find()
      .populate("artist", "name")
      .sort({ createdAt: -1 });

    if (limit) {
      query.limit(parseInt(limit));
    }

    const artworks = await query;
    res.json(artworks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Get Artwork by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id).populate(
      "artist",
      "name"
    );
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    res.json(artwork);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update Artwork (Artist only)
router.put("/:id", auth, upload.single("image"), async (req, res) => {
  const { title, description, category, isForSale, price } = req.body;
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });
    if (artwork.artist.toString() !== req.user.id)
      return res.status(403).json({ message: "Not authorized" });

    let imageUrl = artwork.imageUrl;
    if (req.file) {
      imageUrl = await uploadToCloudinary("ArtMe/artworks", req.file.buffer);
    }

    artwork.title = title || artwork.title;
    artwork.description = description || artwork.description;
    artwork.imageUrl = imageUrl;

    // Update the images array if there's a new image
    if (req.file) {
      artwork.images = [imageUrl];
    }

    artwork.category = category || artwork.category;
    artwork.isForSale = isForSale === "true" || artwork.isForSale; // Handle string boolean
    artwork.price = isForSale === "true" ? price : undefined;

    await artwork.save();
    res.json(artwork);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Delete Artwork (Artist only or Admin)
router.delete("/:id", auth, async (req, res) => {
  try {
    const artwork = await Artwork.findById(req.params.id);
    if (!artwork) return res.status(404).json({ message: "Artwork not found" });

    // Extract userId from token - JWT payload has nested user object
    const userId = req.user.id || (req.user.user && req.user.user.id);

    if (!userId) {
      return res.status(400).json({ message: "Invalid user token structure" });
    }

    // Check if user is admin (role check)
    const user = await User.findById(userId);

    const isAdmin = user && user.role === "admin";

    // If not admin, check if user is the artist
    if (!isAdmin && artwork.artist.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    await Artwork.deleteOne({ _id: req.params.id });

    // Remove artwork from user's artworks array
    await User.findByIdAndUpdate(artwork.artist, {
      $pull: { artworks: req.params.id },
    });

    res.json({ message: "Artwork deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
