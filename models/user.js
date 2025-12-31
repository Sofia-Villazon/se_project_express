const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, "Name is required"],
  },
  avatar: {
    type: String,
    required: [true, "Avatar URL is required"],
    validate: {
      validator: (v) => validator.isURL(v),
      message: "Invalid URL format for avatar",
    },
  },
});

module.exports = mongoose.model("user", userSchema);
