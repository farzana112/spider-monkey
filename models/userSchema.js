const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
    },
    name:{
        type:String,
        required:true,
        trim:true,
        min:3,
        max:64
    },
     email:{
        type:String,
        required:true,
        trim:true,
        unique:true,
        index:true,
        lowercase:true
    },
    hashedPassword:{
        type:String,
        required:true,
        
    },
    contactNumber:{
        type:String,
        unique:true
    },
    blocked:{
        type:Boolean,
        default:false
    },
    cart:{
        type:String,
        default:null
    },
    address:{
        type:String,
        default:null
    },
    order:{
        type:String,
        default:null
    },
    coupons:Array


},{timestamps:true});

module.exports = mongoose.model('User',userSchema);