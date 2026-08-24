const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

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
    const restaurant = await Restaurant.create(req.body);

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
    const restaurant = await Restaurant.findByIdAndUpdate(req.params.storeId, req.body, {
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
