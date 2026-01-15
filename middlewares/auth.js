const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../utils/config");

const authorization = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith("Bearer ")) {
    return res.status(401).send({ message: "Authorization required" });
  }
  const token = authorization.replace("Bearer ", "");

  let playload;
  try {
    playload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    res.status(401).send({ message: "Authorization required" });
  }

  req.user = { _id: playload._id };
  next();
};

module.exports = { authorization };
