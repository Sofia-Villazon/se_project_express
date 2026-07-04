const jwt = require("jsonwebtoken");
const { JWT_SECRET, UNAUTHORIZED } = require("../utils/config");
const UnauthorizedError = require("../errors/unauthorized-err");

const authorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }
  const token = authorization.replace("Bearer ", "");

  let playload;
  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = { _id: playload._id };
  return next();
};

module.exports = { authorization };
