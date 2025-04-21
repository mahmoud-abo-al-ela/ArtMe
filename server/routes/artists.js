const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { uploadToCloudinary } = require("../services/cloudinary");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });
const User = require("../models/User");

// Get all artists (Public)
router.get("/", async (req, res) => {
  try {
    const { limit = 10, sort } = req.query;

    // Find all users (all are artists) and populate their artworks
    const query = User.find()
      .select("-password")
      .populate({
        path: "artworks",
        select: "title imageUrl images category",
      })
      .lean();

    // Apply limit
    query.limit(parseInt(limit));

    // Execute query
    let artists = await query;

    // Sort by number of artworks if requested
    if (sort === "artworks") {
      artists = artists.sort(
        (a, b) => (b.artworks?.length || 0) - (a.artworks?.length || 0)
      );
    }

    // Add artwork count to each artist
    const artistsWithCounts = artists.map((artist) => ({
      ...artist,
    }));

    res.json(artistsWithCounts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get artist by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const artist = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "artworks",
        select: "title imageUrl images category isForSale price createdAt",
      })
      .lean();

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.json(artist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get artist by name (Public)
router.get("/name/:name", async (req, res) => {
  try {
    const nameParam = req.params.name;
    // Format the name for comparison
    const formattedName = nameParam
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    // Find artist by name (case insensitive)
    const artist = await User.findOne({
      name: { $regex: new RegExp(`^${formattedName}$`, "i") },
    })
      .select("-password")
      .populate({
        path: "artworks",
        select: "title imageUrl images category isForSale price createdAt",
      })
      .lean();

    if (!artist) {
      return res.status(404).json({ message: "Artist not found" });
    }

    res.json(artist);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get artist profile
router.get("/profile", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the response to match the client's expected structure
    const profile = {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      social: {
        instagram: user.socialLinks?.instagram || "",
        facebook: user.socialLinks?.facebook || "",
      },
    };

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Update artist profile
router.put("/profile", auth, async (req, res) => {
  try {
    const { id } = req.user;
    const { name, bio, social } = req.body;

    const updateData = {
      name,
      bio,
      socialLinks: {
        instagram: social?.instagram || "",
        facebook: social?.facebook || "",
      },
    };

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Format the response to match the client's expected structure
    const profile = {
      name: user.name,
      email: user.email,
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      social: {
        instagram: user.socialLinks?.instagram || "",
        facebook: user.socialLinks?.facebook || "",
      },
    };

    res.json(profile);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

router.post(
  "/profile/image",
  auth,
  upload.single("profileImage"),
  async (req, res) => {
    try {
      const { id } = req.user;
      console.log("Received file:", {
        originalname: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      });
      const imageUrl = await uploadToCloudinary(
        "ArtMe/profile",
        req.file.buffer
      );
      const user = await User.findByIdAndUpdate(
        id,
        { profileImage: imageUrl },
        { new: true }
      ).select("-password");

      res.json({
        profileImage: user.profileImage,
        message: "Profile image updated",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error uploading image" });
    }
  }
);

module.exports = router;
