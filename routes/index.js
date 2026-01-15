const router = require("express").Router();
const userRoutes = require("./users");
const { createUser, login } = require("../controllers/users");
const { authorization } = require("../middlewares/auth");

const clothingItemRoutes = require("./clothingItems");
const { NOT_FOUND } = require("../utils/errors");

router.post("/signup", createUser);
router.post("/signin", login);

router.use("/items", clothingItemRoutes);

// router.use(authorization);
router.use("/users", authorization, userRoutes);

router.use((req, res) => {
  res.status(NOT_FOUND).send({ message: "Requested resource not found" });
});

module.exports = router;
