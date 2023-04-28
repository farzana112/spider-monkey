const mongoose = require('mongoose');
const cartSchema = new mongoose.Schema({
    id:{type:String,required:true},
    user:{type:String,ref:'User',required:true},

    cartItems:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:'Products',required:true},
            quantity:{type:Number,default:1,required:true},
            price:{type:Number,required:true},
            prod:{type:String,required:true},
            subtotal:{type:Number,default:1}
           
        
        }


    ]
}, {timestamps: true});
module.exports = mongoose.model('Cart', cartSchema);
