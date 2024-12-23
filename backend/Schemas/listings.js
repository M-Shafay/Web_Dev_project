const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, default: "AirBnb Stay" },
  price: { type: Number, default: 100 },
  location: { type: String, default: "Unknown" },
  image_url: { type: String, default: "" },
  hostId: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
  category: { type: String, default: "Apartment" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("listings", listingSchema);
