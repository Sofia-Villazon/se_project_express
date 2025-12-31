const ClothingItem = require("../models/clothingItem");

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res.status(500).send({ message: err.message });
    });
};

const createItems = (req, res) => {
  const { name, avatar } = req.body;
  ClothingItem.create({ name, avatar })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const itemId = req.params.itemId;
  ClothingItem.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => {
      return res.send({ message: "Clothing item deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(404).send({ message: "Clothing item not found" });
      } else if (err.name === "CastError") {
        return res.status(400).send({ message: "Invalid user ID format" });
      }
      return res.status(500).send({ message: err.message });
    });
  // Temporary response until implementation is complete
  // return res.status(501).send({ message: "Not implemented" });
};

module.exports = {
  getItems,
  createItems,
  deleteItem,
};
