const mongoose = require("mongoose");
const validator = require("validator");

const clothingItemSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, "Name is required"],
  },
  weather: {
    type: String,
    enum: ["hot", "warm", "cold"],
    required: [true, "Weather is required"],
  },
  imageUrl: {
    type: String,
    required: [true, "Image URL is required"],
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Invalid URL format for imageUrl",
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: [true, "Owner is required"],
  },
  likes: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("clothingItem", clothingItemSchema);
