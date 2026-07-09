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
  validateId,
} = require("../middlewares/validation");

router.get("/", getItems);

router.use(authorization);
router.post("/", validateClothingItem, createItems);
router.delete("/:itemId", validateId, deleteItem);
router.put("/:itemId/likes", validateId, likeItem);
router.delete("/:itemId/likes", validateId, dislikeItem);

module.exports = router;
