const express = require("express");
const {
  getAllRestaurants,
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  deleteRestaurant,
} = require("../controllers/restaurantController");
const { protect } = require("../controllers/authController");
const { authorizeRoles } = require("../middleware/authorizeRoles");
const upload = require("../middleware/upload");

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllRestaurants)
  .post(protect, authorizeRoles("admin"), upload.array("images", 6), createRestaurant);

router
  .route("/:storeId")
  .get(getRestaurant)
  .patch(protect, authorizeRoles("admin"), upload.array("images", 6), updateRestaurant)
  .delete(protect, authorizeRoles("admin"), deleteRestaurant);

module.exports = router;
