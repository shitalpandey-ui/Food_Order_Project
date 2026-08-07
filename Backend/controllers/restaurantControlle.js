// imports required models
const Restaurant = require("../models/restaurant");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const APIFeatures = require("../utils/apiFeatures");

// fetch restaurant with searchinng and sorting
// create controller getAllRestaurant and wrap with catchAsyncError
exports.getAllRestaurants = catchAsyncErrors(async(req,res,next) => {
    //creates APIfeatures object
    //creates mongoose query for all restaurants
    //req.query contains url query parameters
    const apiFeatures = new APIFeatures(Restaurant.find(),req.query)
    // add search condition
    .search()
    //add sort condition
    .sort();
   
    // execute the query
    const restaurants = await apiFeatures.query;
    // sends json response
    res.status(200).json({
        status:"success",
        count:restaurants.length,
        restaurants: restaurants,
    });
});

//Create new restaurant
exports.createRestaurant = catchAsyncErrors(async(req, res, next) => {
    const restaurant = await Restaurant.create(req.body);

    res.status(201).json({
        status:"success",
        data: restaurant,
    });
});

// Fetching one restaurant
exports.getRestaurant = catchAsynsErrors(async(req, res, next) =>{
     const restaurant = await Restaurant.findById(req.params.storeId);

     if(!restaurant)
         return next(new ErrorHandler("No Restaurant found with that ID ,404"));

     res.status(200).json({
        status:"success",
        data: restaurant,
     });
});

// Delete Restaurant
exports.deleteRestaurant = catchAsyncErrors(async(req, res, next) =>{
     const restaurant = await Restaurant.findByIdAndDelete(req.params.storeId);

     if(!restaurant) return next(new ErroHandler("No Restaurant found with that ID ,404"));

      res.status(204).json({
        status:"success",
     });
});