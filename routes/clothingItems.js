const router = require("express").Router();
const {
  getItems,
  createItems,
  deleteItem,
} = require("../controllers/clothingItems");

router.get("/", getItems);
router.post("/", createItems);
router.delete("/:itemId", deleteItem);

module.exports = router;
