const mongoose = require("mongoose");
const wishSchema = new mongoose.Schema({
  user: {
    type: String,
  },
  wishitems: [
    {
      productId: String
      
    },
  ],
 
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Wish", wishSchema);
