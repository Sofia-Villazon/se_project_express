const ClothingItem = require("../models/clothingItem");

const BadRequestError = require("../errors/bad-request-err");
const UnauthorizedError = require("../errors/unauthorized-err");
const ForbiddenError = require("../errors/forbidden-err");
const NotFoundError = require("../errors/not-found-err");
const ConflictError = require("../errors/conflict-err");

const getItems = (req, res, next) => {
  ClothingItem.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      next(err);
    });
};

const createItems = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const userId = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner: userId })
    .then((item) => res.status(201).send(item))
    .catch((err) => {
      if (err.name === "ValidationError") {
        next(new BadRequestError("Invalid data provided"));
      }
      return next(err);
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findById(itemId)
    .orFail(() => {
      next(new NotFoundError("Clothing item not found"));
    })
    .then((item) => {
      if (!item.owner.equals(userId)) {
        next(
          new ForbiddenError("You don't have permission to delete this item")
        );
      }
      return ClothingItem.findByIdAndDelete(itemId).then((deletedItem) => {
        res.send({ message: `${deletedItem.name} deleted successfully` });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      }
      return next(err);
    });
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      next(new NotFoundError("Clothing item not found"));
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => {
      next(new NotFoundError("Clothing item not found"));
    })
    .then((item) => res.status(200).send(item))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Clothing item not found"));
      }
      if (err.name === "CastError") {
        next(new BadRequestError("Invalid user ID format"));
      }
      next(err);
    });
};

module.exports = {
  getItems,
  createItems,
  deleteItem,
  likeItem,
  dislikeItem,
};
