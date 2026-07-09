const router = require("express").Router();
const { getCurrentUser, updateProfile } = require("../controllers/users");
const {
  validateAuthentification,
  validateUpdateUser,
} = require("../middlewares/validation");

router.get("/me", validateAuthentification, getCurrentUser);
router.patch("/me", validateUpdateUser, updateProfile);

module.exports = router;
