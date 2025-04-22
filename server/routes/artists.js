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
    const query = User.find({ role: { $ne: "admin" } })
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

// Get artist's own profile (Private - requires auth)
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

// Get public artist profile with artworks (Public)
router.get("/profile/public", async (req, res) => {
  try {
    let { name } = req.query;

    if (!name) {
      return res.status(400).json({ message: "Artist name is required" });
    }

    // Decode URL-encoded name and replace hyphens with spaces if needed
    name = decodeURIComponent(name).replace(/-/g, " ");

    // Use case-insensitive search with regex for more flexible matching
    const nameRegex = new RegExp(
      "^" + name.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&") + "$",
      "i"
    );

    const user = await User.findOne({ name: nameRegex })
      .select("-password")
      .populate({
        path: "artworks",
        select: "title imageUrl images category createdAt",
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "Artist not found" });
    }

    // Format the response with profile info and artworks
    const publicProfile = {
      _id: user._id,
      name: user.name,
      bio: user.bio || "",
      profileImage: user.profileImage || "",
      socialLinks: {
        instagram: user.socialLinks?.instagram || "",
        facebook: user.socialLinks?.facebook || "",
        twitter: user.socialLinks?.twitter || "",
        website: user.socialLinks?.website || "",
      },
      artworks: user.artworks || [],
    };

    res.json(publicProfile);
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
