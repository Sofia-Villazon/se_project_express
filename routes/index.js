const router = require("express").Router();
const userRoutes = require("./users");
const { createUser, login } = require("../controllers/users");
const { authorization } = require("../middlewares/auth");
const {
  validateClothingItem,
  validateUserInfo,
  validateAuthentification,
  validateIds,
} = require("../middlewares/validation");

const clothingItemRoutes = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signup", validateUserInfo, createUser);
router.post("/signin", validateAuthentification, login);

router.use("/items", validateClothingItem, clothingItemRoutes);

router.use("/users", validateIds, userRoutes);

router.use((req, res, next) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
