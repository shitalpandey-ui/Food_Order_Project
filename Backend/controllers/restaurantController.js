const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");
const buildImagesFromFiles = require("../utils/buildImagesFromFiles");

// multipart/form-data sends every field as a string, so JSON-ish fields
// (location, coordinates) and booleans need to be parsed back before saving.
function parseRestaurantBody(body) {
  const parsed = { ...body };

  if (typeof parsed.location === "string") {
    try {
      parsed.location = JSON.parse(parsed.location);
    } catch {
      delete parsed.location;
    }
  }

  if (typeof parsed.isVeg === "string") {
    parsed.isVeg = parsed.isVeg === "true";
  }

  // Images are only ever set via the multer upload below - never trust a
  // client-supplied `images` field (raw JSON, stray form field, etc.), since
  // anything short of real uploaded files fails the images.* required
  // validators (or lets a client set arbitrary image URLs).
  delete parsed.images;

  return parsed;
}

exports.getAllRestaurants = catchAsyncErrors(async(req,res,next) => {
    const apiFeatures = new APIFeatures(Restaurant.find(),req.query)
    .search()
    .sort();
   
    const restaurants = await apiFeatures.query;
    res.status(200).json({
        status:"success",
        count:restaurants.length,
        restaurants: restaurants,
    });
});

exports.createRestaurant = catchAsyncErrors(async(req, res, next) => {
    const body = parseRestaurantBody(req.body);
    const images = buildImagesFromFiles(req);
    if (images.length > 0) body.images = images;

    const restaurant = await Restaurant.create(body);

    res.status(201).json({
        status:"success",
        data: restaurant,
    });
});

exports.getRestaurant = catchAsyncErrors(async(req, res, next) =>{
     const restaurant = await Restaurant.findById(req.params.storeId);

     if(!restaurant)
         return next(new ErrorHandler("No Restaurant found with that ID", 404));

     res.status(200).json({
        status:"success",
        data: restaurant,
     });
});

exports.updateRestaurant = catchAsyncErrors(async(req, res, next) => {
    const body = parseRestaurantBody(req.body);
    const newImages = buildImagesFromFiles(req);

    if (newImages.length > 0) {
        const existing = await Restaurant.findById(req.params.storeId).select("images");
        if (!existing) return next(new ErrorHandler("No Restaurant found with that ID", 404));
        body.images = [...existing.images, ...newImages];
    }

    const restaurant = await Restaurant.findByIdAndUpdate(req.params.storeId, body, {
        new: true,
        runValidators: true,
    });

    if(!restaurant)
        return next(new ErrorHandler("No Restaurant found with that ID", 404));

    res.status(200).json({
        status:"success",
        data: restaurant,
    });
});

exports.deleteRestaurant = catchAsyncErrors(async(req, res, next) =>{
     const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

     if(!restaurant) return next(new ErrorHandler("No Restaurant found with that ID", 404));

      res.status(204).json({
        status:"success",
     });
});
