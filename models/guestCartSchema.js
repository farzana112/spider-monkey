const mongoose = require('mongoose');
const guesCartSchema = new mongoose.Schema({
    id:{type:String,required:true},
    
    cartItems:[
        {
            product:{type:mongoose.Schema.Types.ObjectId,ref:'Products',required:true},
            quantity:{type:Number,default:1,required:true},
            price:{type:Number,required:true},
            prod:{type:String,required:true}
        
        }
    ]
}, {timestamps: true});
module.exports = mongoose.model('guestCart', guestCartSchema);
