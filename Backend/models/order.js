const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
     deliveryInfo:{
        address:{
            type:String,
            required: true,
        },
        city:{
            type: String,
            required:true,
        },
        country:{
           type: String,
        },
        postalCode:{
            type:String,
        },
        phoneNumber:{
            type:String,
            required:true,
        }
     }, // these schema are already created so we can just usae it rather than writting it manually again
     restaurant:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
     },
     user:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'User',
        required:true
     },
     orderItems:[
     {
        name:{
            type:String,
            required:true
        },
        quantity:{
            type:String,
            required:true
        },
        image:{
            type:String,
            required:true,
        },
        price:{
            type:Number,
            required:true
        },
        foodItem:{
            type: mongoose.Schema.Types.ObjectId,
            ref:"FoodItem",
            required:true,
        },
     }
    ],
    paymentInfo:{
        id:{
            type:String,
        },
        status:{
            type:String,
        }
    },
    paidAt:{
        type:Date,
    },
    itemsPrice:{
        type:Number,
        required:true,
        default:0.0,
    },
    taxPrice:{
        type:Number,
        default: 0.0
    },
    deliveryCharges:{
        type:Number,
        default:0.0
    },
    finalTotal:{
        type:Number,
        required:true,
        default:0.0
    },
    orderStatus:{
        type:String,
        required:true,
        default:'Processing'
    },
    deliverdAt:{
        type:Date,
        default: Date.now
    },
})

// Stock Management

orderSchema.pre('save',async function(next) {
    try{
       for(const orderItem of this.orderItems){
        const foodItem = await mongoose.model('FoodItem').findById(orderItem.foodItem);
        if(!foodItem){
            throw new Error("Food item not found")
        }
         if(foodItem.stock < orderItem.quantity){
            throw new Error('Insufficient stock for ${orderItem.name}')
         }
         foodItem.stock -=orderItem.quantity;
         await foodItem.save();
       }
       next()

    }catch(error){
        next(error)

    }
    
})
module.exports = mongoose.model('Order',orderSchema);