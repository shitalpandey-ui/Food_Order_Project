const Order = require("../models/order");
const ErrorHandler = require("../utils/errorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");

exports.getSingleOrder = catchAsyncErrors(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    .populate("user","name email")
    .populate("restaurant")
    .exec()

    if(!order){
        return next(new ErrorHandler("Order not found with this Id",404))
    }
    res.status(200).json({
        success:true,
        order
    })
})

exports.myOrders = catchAsyncErrors(async(req,res,next)=> {
    const orders = await Order.find({user:req.user.id})
    .populate("user","name email")
    .populate("restaurant")
    .exec();

    res.status(200).json({
        success:true,
        orders
    })
})

exports.allOrders = catchAsyncErrors(async(req,res,next)=>{
    const orders = await Order.find()
    let totalAmount = 0;

    orders.forEach((order)=>{
        totalAmount += order.finalTotal
    });

    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})
