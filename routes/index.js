const router = require("express").Router();
const userRoutes = require("./users");
const clothingItemRoutes = require("./clothingItems");

router.use("/users", userRoutes);
router.use("/items", clothingItemRoutes);

module.exports = router;
