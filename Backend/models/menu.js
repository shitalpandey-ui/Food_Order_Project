//It defines how menu item is stored in MongoDb

const mongoose = require("mongoose");
const menuSchema = new mongoose.Schema({
     menu:[{   //[] it is used bcoz it is an array  
        category:{
            type:String
        },
        items:[{
            type: mongoose.Types.ObjectId,
            ref: "FoodItem"
        }],
        }],
     restaurant:{
        type: mongoose.Types.ObjectId,
        ref: "Restaurant"
     },

},
{ // Virtuals are extra phase that we create in code but not store them in database
    toJSON: { virtuals: true },
   toObject: { virtuals: true } 
}
)

const Menu = mongoose.model("Menu",menuSchema);
module.exports = Menu;