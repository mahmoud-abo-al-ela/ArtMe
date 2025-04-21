const mongoose = require("mongoose");

const artworkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  imageUrl: { type: String, required: true },
  images: { type: [String], default: [] },
  category: { type: String, required: true },
  artist: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
  isForSale: { type: Boolean, default: false },
  price: { type: Number },
});

// Virtual to ensure backward compatibility
artworkSchema.virtual("firstImage").get(function () {
  return this.images && this.images.length > 0 ? this.images[0] : this.imageUrl;
});

// Set toJSON option to include virtuals
artworkSchema.set("toJSON", { virtuals: true });
artworkSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Artwork", artworkSchema);
