/*const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");
const { Schema } = require("mongoose");
const userModel = require("../models/userSchema");*/

/*const addressSchema = new Schema({
   userId:{type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    name:{type:String,required:true},
    houseName: { type: String, required: true },
    contactNumber: { type: Number, required: true},
    street: { type: String, required: true},
    city: { type: String, required: true },
    state: { type: String, required: true },
    zip: { 
      type: String, 
      required: true  
    }
    
});  */

/* const addressSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
  addresses: [
    {
      id: {
        type: String,
        required: true,
      },
      name: {
        type: String,
        required: true,
      },
      contactNumber: {
        type: String,
        required: true,
      },
      street: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },
      
      state: {
        type: String,
        required: true,
      },
      zip: { 
        type: String, 
        required: true  
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      modifiedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
 });*/


// module.exports = mongoose.model("Address", addressSchema);
const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true
      },
      user:{
        type:String,
        required:true
      },
      addresses:[
        {
          id:{
            type:String,
            required:true
          },
          name: {
            type: String,
            required: true
          },
          contactNumber: {
            type: String,
            required: true
          },
          firstLine: {
            type: String,
            // required: true
          },
          secondLine: {
            type: String,
            // required:true
            
          },
          city: {
            type: String,
            required: true
          },
          state: {
            type: String,
            required: true
          },
          pincode: {
            type: Number,
            //  required: true
          },
          createdAt:{
            type: Date,
            default: Date.now
          
          },
          modifiedAt:{
            type: Date,
            default: Date.now
          }

        }

      ]    
});

addressSchema.pre('findOneAndUpdate', function(next) {
  this.modifiedAt = Date.now();
  next();
});


module.exports = mongoose.model('Address', addressSchema);