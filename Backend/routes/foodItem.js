const express = require("express");
const router = express.Router({ mergeParams: true });

const {
  getFoodItem,
  createFoodItem,
  getAllFoodItems,
  deleteFoodItem,
  updateFoodItem,
} = require("../controllers/foodItemController");

const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const upload = require("../middleware/upload");
router.route("/item").post(protect, authorizeRoles("admin"), upload.array("images", 4), createFoodItem);

router.route("/items/:storeId").get(getAllFoodItems);
router
  .route("/item/:foodId")
  .get(getFoodItem)
  .patch(protect, authorizeRoles("admin"), upload.array("images", 4), updateFoodItem)
  .delete(protect, authorizeRoles("admin"), deleteFoodItem);

module.exports = router;
