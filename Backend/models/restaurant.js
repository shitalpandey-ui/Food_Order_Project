//import mongoose library
const mongoose = require("mongoose");
//defines schema
const restaurantSchema = new mongoose.Schema({
     name:{   // define restaurant name
        type:String,
        required: [true,"Please enter the restaurant name"],
        trim: true,
        maxLength:[100,"Restaurant name cannot exceed the limit "],
     },
     isVeg:{
        type: Boolean,
        default: false,

    },
    address:{
        type:String,
        required:[true,"Please enter the restaurant address"],
    },
    ratings:{
        type: Number,
        default:0,
    },
    numOfReviews:{
        type: Number,
        default:0,
    },
    location:{  // Used to map nearby restaurant
        type:{
            type:String,
            enum:["Point"],
            required : true,
        },
        coordinates:{
            type:[Number],
            required:true,
        }
    },
    reviews:[{
        name: {
            type:String,
            required: true,
        },
    rating:{
        type:Number,
        required:true,
    },
    comment:{
        type:String,
        required:true,
    },
  },
 ],
   images:[
    {
        public_id:{
            type:String,
            required:true,
        },
        url:{
            type:String,
            required:true,
        },
    },
   ],
   createdAt:{
    type:Date,
    default:Date.now,
   },
});
// this enables location based queries
restaurantSchema.index({location:"2dsphere"});
// allow text searching in address
restaurantSchema.index({address:"text"});

module.exports = mongoose.model("Restaurant",restaurantSchema);