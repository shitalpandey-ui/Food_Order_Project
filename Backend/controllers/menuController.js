const Menu = require("../models/menu");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllMenus = catchAsyncErrors(async(req, res, next) =>{
     // filter logic
     const filter = req.params.storeId ? { restaurant:req.params.storeId}:{}

     // fetch data from database
     // populate replaces that id with full data
     const menu = await Menu.find(filter).populate("menu.items")

     res.status(200).json({
     status: "success",
     count:menu.length,
     data:menu
      })
});

//create menu
exports.createMenu = catchAsyncErrors(async(req , res, next) =>{
     const menu = await Menu.create(req.body);

     res.status(201).json({status: "success", data:menu})
})

//Delete Menu
exports.deleteMenu = catchAsyncErrors(async(req , res, next) =>{
     const menu = await Menu.findByIdAndDelete( req.params.menuId);
     
     if(!menu){
          return next(new ErrorHandler ("No menu found with that ID",404))
     }
     res.status(204).json({status:"success"})
})

//Add items into menu
exports.AddItemsToMenu = catchAsyncErrors(async(req,res,next)=>{
     const {category,items} = req.body;
     const menuId = req.params.menuId;
     if(!menuId){
          return next(new ErrorHandler ("Please provide menuId",400))
     }
     const menu = await Menu.findById(menuId);
     if(!menu){
          return next(new ErrorHandler ("No menu found with that ID",404))
     }
     //find the category
     let cat = menu.menu.find((c) => c.category === category);

     //If category not found then create new one
     if(!cat){
          cat = {category,items:[]};
              menu.menu.push(cat);

     }
     //add items to category
     cat.items.push(...items);
     await menu.save();
     await menu.populate("menu.Items")
     res.status(200).json({status: "success", data:menu})
     
})

