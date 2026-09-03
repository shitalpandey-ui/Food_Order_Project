const Menu = require("../models/menu");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");

exports.getAllMenus = catchAsyncErrors(async(req, res, next) =>{
     // menu routes aren't nested under /restaurants, so the restaurant id
     // (if any) arrives as a query param rather than a route param
     const filter = req.query.restaurant ? { restaurant:req.query.restaurant}:{}

     // fetch data from database
     // populate replaces that id with full data
     const menu = await Menu.find(filter).populate("menu.items")

     res.status(200).json({
     status: "success",
     count:menu.length,
     data:menu
      })
});

// One restaurant has (at most) one menu document - fetch it directly by
// restaurant id instead of forcing the caller to look up a menuId first.
exports.getMenuForRestaurant = catchAsyncErrors(async(req, res, next) => {
     const menu = await Menu.findOne({ restaurant: req.params.storeId }).populate("menu.items");

     res.status(200).json({
          status: "success",
          data: menu,
     });
});

//create menu
exports.createMenu = catchAsyncErrors(async(req , res, next) =>{
     // A restaurant should only ever have one menu document - return the
     // existing one instead of creating a duplicate.
     const existing = await Menu.findOne({ restaurant: req.body.restaurant });
     if (existing) {
          return res.status(200).json({ status: "success", data: existing });
     }

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

     //If category not found then create new one - re-read the pushed
     //subdocument back out of the array, since menu.menu.push() casts the
     //plain object into a new subdocument instance rather than mutating it
     //in place, so the original `cat` reference would otherwise be stale.
     if(!cat){
          menu.menu.push({category,items:[]});
          cat = menu.menu[menu.menu.length - 1];
     }
     //add items to category
     cat.items.push(...items);
     await menu.save();
     await menu.populate("menu.items")
     res.status(200).json({status: "success", data:menu})

})

//Rename a category
exports.renameCategory = catchAsyncErrors(async(req, res, next) => {
     const { menuId, categoryId } = req.params;
     const { category } = req.body;

     if (!category || !category.trim()) {
          return next(new ErrorHandler("Please provide a category name", 400));
     }

     const menu = await Menu.findById(menuId);
     if(!menu){
          return next(new ErrorHandler("No menu found with that ID", 404));
     }

     const cat = menu.menu.id(categoryId);
     if(!cat){
          return next(new ErrorHandler("No category found with that ID", 404));
     }

     cat.category = category.trim();
     await menu.save();
     await menu.populate("menu.items");
     res.status(200).json({ status: "success", data: menu });
});

//Delete a whole category - the food items themselves are left untouched,
//just uncategorized (no longer referenced by any menu category)
exports.deleteCategory = catchAsyncErrors(async(req, res, next) => {
     const { menuId, categoryId } = req.params;

     const menu = await Menu.findById(menuId);
     if(!menu){
          return next(new ErrorHandler("No menu found with that ID", 404));
     }

     const cat = menu.menu.id(categoryId);
     if(!cat){
          return next(new ErrorHandler("No category found with that ID", 404));
     }

     cat.deleteOne();
     await menu.save();
     await menu.populate("menu.items");
     res.status(200).json({ status: "success", data: menu });
});

//Remove a single item from whichever category holds it
exports.removeItemFromMenu = catchAsyncErrors(async(req, res, next) => {
     const { menuId, foodId } = req.params;

     const menu = await Menu.findById(menuId);
     if(!menu){
          return next(new ErrorHandler("No menu found with that ID", 404));
     }

     menu.menu.forEach((cat) => {
          cat.items = cat.items.filter((itemId) => itemId.toString() !== foodId);
     });

     await menu.save();
     await menu.populate("menu.items");
     res.status(200).json({ status: "success", data: menu });
});

