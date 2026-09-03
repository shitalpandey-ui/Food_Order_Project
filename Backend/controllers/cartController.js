const Cart = require("../models/cartModel");
const FoodItem = require("../models/foodItem");
const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

const CART_POPULATE = [
  { path: "items.foodItem", select: "name price images stock" },
  { path: "restaurant", select: "name images" },
];

function getUserCart(userId) {
  return Cart.findOne({ user: userId }).populate(CART_POPULATE);
}

// Fetch the current user's cart. No cart yet is not an error - it just
// means an empty cart, so the response data is null rather than a 404.
exports.getCart = catchAsyncErrors(async (req, res, next) => {
  const cart = await getUserCart(req.user.id);

  res.status(200).json({
    status: "success",
    data: cart,
  });
});

// A cart only ever holds items from one restaurant at a time - adding an
// item from a different restaurant replaces the cart rather than mixing
// items from two places into one order.
exports.addItemToCart = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId, restaurantId, quantity } = req.body;
  const qty = Number(quantity) > 0 ? Number(quantity) : 1;

  if (!foodItemId || !restaurantId) {
    return next(new ErrorHandler("Please provide foodItemId and restaurantId", 400));
  }

  const foodItem = await FoodItem.findById(foodItemId);
  if (!foodItem) return next(new ErrorHandler("Food item not found", 404));

  const restaurant = await Restaurant.findById(restaurantId);
  if (!restaurant) return next(new ErrorHandler("Restaurant not found", 404));

  let cart = await Cart.findOne({ user: req.user.id });

  if (cart && cart.restaurant.toString() !== restaurantId) {
    cart.restaurant = restaurantId;
    cart.items = [{ foodItem: foodItemId, quantity: qty }];
  } else if (cart) {
    const existingItem = cart.items.find(
      (item) => item.foodItem.toString() === foodItemId
    );
    if (existingItem) {
      existingItem.quantity += qty;
    } else {
      cart.items.push({ foodItem: foodItemId, quantity: qty });
    }
  } else {
    cart = new Cart({
      user: req.user.id,
      restaurant: restaurantId,
      items: [{ foodItem: foodItemId, quantity: qty }],
    });
  }

  await cart.save();
  const updatedCart = await getUserCart(req.user.id);

  res.status(200).json({ status: "success", data: updatedCart });
});

exports.updateCartItemQuantity = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId } = req.params;
  const quantity = Number(req.body.quantity);

  if (!Number.isFinite(quantity) || quantity < 1) {
    return next(new ErrorHandler("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const item = cart.items.find((i) => i.foodItem.toString() === foodItemId);
  if (!item) return next(new ErrorHandler("Food item not found in cart", 404));

  item.quantity = quantity;
  await cart.save();
  const updatedCart = await getUserCart(req.user.id);

  res.status(200).json({ status: "success", data: updatedCart });
});

// Removing the last item deletes the cart document entirely rather than
// leaving an empty one behind.
exports.deleteCartItem = catchAsyncErrors(async (req, res, next) => {
  const { foodItemId } = req.params;

  const cart = await Cart.findOne({ user: req.user.id });
  if (!cart) return next(new ErrorHandler("Cart not found", 404));

  const itemIndex = cart.items.findIndex(
    (i) => i.foodItem.toString() === foodItemId
  );
  if (itemIndex === -1) return next(new ErrorHandler("Food item not found in cart", 404));

  cart.items.splice(itemIndex, 1);

  if (cart.items.length === 0) {
    await Cart.deleteOne({ _id: cart._id });
    return res.status(200).json({ status: "success", data: null });
  }

  await cart.save();
  const updatedCart = await getUserCart(req.user.id);

  res.status(200).json({ status: "success", data: updatedCart });
});

exports.clearCart = catchAsyncErrors(async (req, res, next) => {
  await Cart.deleteOne({ user: req.user.id });

  res.status(200).json({ status: "success", data: null });
});
