const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");
const User = require("../models/user");
const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .orFail(() => {
      next(new NotFoundError("User not found"));
    })
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return userObj;
    })
    .then((user) => res.status(200).send(user))

    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("User not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
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
        next(new ConflictError("Email already in use"));
      }
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    next(new BadRequestError("Email and password are required"));
  }
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
      if (err.message === "Incorrect email or password") {
        next(new UnauthorizedError("Incorrect email or password"));
      }else{
        next(err);
      }
    });
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, avatar },
    { runValidators: true, new: true }
  )
    .then((user, err) => {
      if (!user) {
        next(err);
      }
      const userObj = user.toObject();
      delete userObj.password;
      return res.send(userObj);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError(err.message));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
    });
};
module.exports = {
  getCurrentUser,
  createUser,
  login,
  updateProfile,
};
