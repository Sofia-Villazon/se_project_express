const router = require("express").Router();
const {
  getItems,
  createItems,
  deleteItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");
const { authorization } = require("../middlewares/auth");

router.get("/", getItems);

router.use(authorization);
router.post("/", createItems);
router.delete("/:itemId", deleteItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);

module.exports = router;
