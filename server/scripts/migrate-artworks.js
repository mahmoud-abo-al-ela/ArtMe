const mongoose = require("mongoose");
const User = require("../models/User");
const Artwork = require("../models/Artwork");
require("dotenv").config();

console.log("Starting migration process...");

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      // Find all artworks
      const artworks = await Artwork.find();
      console.log(`Found ${artworks.length} artworks to process`);

      // Group artworks by artist
      const artworksByArtist = {};

      artworks.forEach((artwork) => {
        if (!artwork.artist) {
          console.log(
            `Skipping artwork ${artwork._id} with no artist reference`
          );
          return;
        }

        const artistId = artwork.artist.toString();
        if (!artworksByArtist[artistId]) {
          artworksByArtist[artistId] = [];
        }
        artworksByArtist[artistId].push(artwork._id);
      });

      // Update each artist with their artworks
      const artistIds = Object.keys(artworksByArtist);
      console.log(`Found ${artistIds.length} artists with artworks`);

      for (const artistId of artistIds) {
        const artworkIds = artworksByArtist[artistId];
        console.log(
          `Updating artist ${artistId} with ${artworkIds.length} artworks`
        );

        const result = await User.findByIdAndUpdate(
          artistId,
          { $addToSet: { artworks: { $each: artworkIds } } },
          { new: true }
        );

        if (result) {
          console.log(
            `Updated artist ${artistId}, now has ${result.artworks.length} artworks`
          );
        } else {
          console.log(`Artist ${artistId} not found in database`);
        }
      }

      console.log("Migration completed successfully");
    } catch (error) {
      console.error("Error:", error);
    } finally {
      await mongoose.disconnect();
      console.log("Database disconnected");
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
