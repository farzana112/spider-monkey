const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    id: {
      type: String,
      required: true
    },
    itemName: {
      type: String,
      required: true
    },
    description:{
      type:String,
      required:true
    },
    category: {
      type:String,
      required:true
    },

    quantity: {
      type: String,
      required: true
    },
    price: {
      type: String,
      required: true
    },
    images: [{
      path:String
    }]
    
  });
  module.exports = mongoose.model('Products', productSchema);