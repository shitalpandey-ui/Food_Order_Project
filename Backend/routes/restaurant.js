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

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllRestaurants)
  .post(protect, authorizeRoles("admin"), createRestaurant);

router
  .route("/:storeId")
  .get(getRestaurant)
  .patch(protect, authorizeRoles("admin"), updateRestaurant)
  .delete(protect, authorizeRoles("admin"), deleteRestaurant);

module.exports = router;
