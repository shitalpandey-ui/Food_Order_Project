const Fooditem = require("../models/foodItem");
const Menu = require("../models/menu");
const ErrorHandler = require("../utils/errorHandler");
const catchAsync = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const buildImagesFromFiles = require("../utils/buildImagesFromFiles");

// multipart/form-data sends every field as a string, so numeric fields need
// to be parsed back before saving. Images are only ever set via the multer
// upload below - never trust a client-supplied `images`/`imageUrl` field.
function parseFoodItemBody(body) {
  const parsed = { ...body };

  if (typeof parsed.price === "string") parsed.price = Number(parsed.price);
  if (typeof parsed.stock === "string") parsed.stock = Number(parsed.stock);

  delete parsed.images;
  delete parsed.imageUrl;

  return parsed;
}

exports.getAllFoodItems = catchAsync(async (req, res, next) => {
  let restaurantId = {};
  if (req.params.storeId) {
    restaurantId = { restaurant: req.params.storeId };
  }

  const foodItems = await Fooditem.find(restaurantId).populate("restaurant");
  res.status(200).json({
    status: "success",
    results: foodItems.length,
    data: foodItems,
  });
});

// /v1/eats/stores/{store_id}/menus
exports.createFoodItem = catchAsync(async (req, res, next) => {
  const body = parseFoodItemBody(req.body);
  const images = buildImagesFromFiles(req);
  if (images.length > 0) body.images = images;

  const fooditem = await Fooditem.create(body);
  res.status(201).json({
    status: "success",
    data: fooditem,
  });
});

exports.getFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findById(req.params.foodId);

  if (!foodItem)
    return next(new ErrorHandler("No foodItem found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: foodItem,
  });
});

exports.updateFoodItem = catchAsync(async (req, res, next) => {
  const body = parseFoodItemBody(req.body);
  const newImages = buildImagesFromFiles(req);

  if (newImages.length > 0) {
    const existing = await Fooditem.findById(req.params.foodId).select("images");
    if (!existing)
      return next(new ErrorHandler("No document found with that ID", 404));
    body.images = [...existing.images, ...newImages];
  }

  const foodItem = await Fooditem.findByIdAndUpdate(
    req.params.foodId,
    body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!foodItem)
    return next(new ErrorHandler("No document found with that ID", 404));

  res.status(200).json({
    status: "success",
    data: foodItem,
  });
});

exports.deleteFoodItem = catchAsync(async (req, res, next) => {
  const foodItem = await Fooditem.findByIdAndDelete(req.params.foodId);

  if (!foodItem)
    return next(new ErrorHandler("No document found with that ID", 404));

  // Drop any dangling references so a deleted item doesn't keep showing up
  // in the restaurant's menu categories.
  await Menu.updateMany(
    { restaurant: foodItem.restaurant },
    { $pull: { "menu.$[].items": foodItem._id } }
  );

  res.status(204).json({
    status: "success",
  });
});
