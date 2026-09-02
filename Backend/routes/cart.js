const express = require("express");
const router = express.Router();
const { protect } = require("../controllers/authController");
const {
  getCart,
  addItemToCart,
  updateCartItemQuantity,
  deleteCartItem,
  clearCart,
} = require("../controllers/cartController");

// Every cart route is scoped to the logged-in user (req.user.id) - none of
// them trust a client-supplied user id.
router.use(protect);

router.route("/").get(getCart).delete(clearCart);
router.route("/items").post(addItemToCart);
router
  .route("/items/:foodItemId")
  .patch(updateCartItemQuantity)
  .delete(deleteCartItem);

module.exports = router;
