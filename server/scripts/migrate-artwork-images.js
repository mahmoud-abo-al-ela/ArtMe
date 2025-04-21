const mongoose = require("mongoose");
const Artwork = require("../models/Artwork");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// Hide sensitive connection string
console.log("MongoDB URI is", process.env.MONGO_URI ? "configured" : "missing");

// Set mongoose options
mongoose.set("strictQuery", false);

// Connect to MongoDB with connection options
mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Migrate artwork images
async function migrateArtworkImages() {
  try {
    console.log("Starting migration of artwork images...");

    // Find all artworks that have an imageUrl but no images in the array
    const artworks = await Artwork.find({
      imageUrl: { $exists: true, $ne: "" },
      $or: [{ images: { $exists: false } }, { images: { $size: 0 } }],
    }).exec();

    console.log(`Found ${artworks.length} artworks to migrate`);

    let updatedCount = 0;

    // Update each artwork
    for (const artwork of artworks) {
      artwork.images = [artwork.imageUrl];
      await artwork.save();
      updatedCount++;

      if (updatedCount % 10 === 0) {
        console.log(`Migrated ${updatedCount}/${artworks.length} artworks...`);
      }
    }

    console.log(`Migration completed. Updated ${updatedCount} artworks.`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error("Migration failed:", error);
    try {
      await mongoose.connection.close();
    } catch (e) {
      console.error("Error closing connection:", e);
    }
    process.exit(1);
  }
}

// Add error handlers
process.on("SIGINT", async () => {
  console.log("Migration interrupted");
  await mongoose.connection.close();
  process.exit(0);
});

// Run migration
migrateArtworkImages();
