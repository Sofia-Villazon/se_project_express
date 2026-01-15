const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const {
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER_ERROR,
} = require("../utils/errors");

const getCurrentUser = (req, res) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      const error = new Error("User not found");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    })
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const createUser = (req, res) => {
  const { name, avatar, email } = req.body;

  bcrypt
    .hash(req.body.password, 8)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: "Email already in use" });
      }
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(INTERNAL_SERVER_ERROR).send({ message: err.message });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ message: "Login successful", token, user });
    })
    .catch((err) => {
      if (!email || !password) {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Email and password are required" });
      }
      return res.status(401).send({ message: err.message });
    });
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { runValidators: true, new: true }
  )
    .then((user) => {
      if (!user) {
        return res.status(NOT_FOUND).send({ message: "User not found" });
      }
      const userObj = user.toObject();
      delete userObj.password;
      return res.send(userObj);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST)
          .send({ message: "Invalid user ID format" });
      }
      return res.status(500).send({ message: "Error" });
    });
};
module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
