const Order = require("../models/order");
const Cart = require("../models/cartModel");
const{objectId} = require("mongodb");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

// get single order

//populate joins data from another collection
exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(res.params.id)
    .populate("user","name email")
    .populate(restaurant)
    .exec()    //execute query

    if(!order){
        return next(new ErrorHandler("order not found with this Id ",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

// get logged in users order
 exports.myOrders = catchAsyncErrors(async(req,res,next)=> {
    const userId = new ObjectId(req.user.id);
    const orders = await Order.find({user:userId})
    .populaate("user","name email")
    .populate("restaurant")
    .exec();

    res.status(200).json({
        success:true,
        orders
    })

})
 // get all orderss

 exports.allOrders = catchAsyncErrors(async(res,req,next)=>{
    const orders = await Order.find()
    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.findTotal
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
 })
