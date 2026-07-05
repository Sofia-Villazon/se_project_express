const router = require("express").Router();
const {
  getItems,
  createItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authorization } = require("../middlewares/auth");
const {
  validateClothingItem,
  validateUserInfo,
  validateAuthentification,
  validateIds,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(authorization);
router.post("/", validateClothingItem, createItems);
router.delete("/:itemId", validateIds, deleteItem);
router.put("/:itemId/likes", validateIds, likeItem);
router.delete("/:itemId/likes", validateIds, dislikeItem);

module.exports = router;
