const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     id: {
//         type: String,
//         required: true
//       },
//       user:{
//         type:String,
//         required:true
//       },
//       ordersList:[
//         {
//           id:{
//             type:String,
//             required:true

//           },
//            items:[
//             {
//               product:{
//                 type:String,
//                 required:true
//             },
//             quantity:{
//                 type:Number,
//                 required:true,
//             },
//             price:{
//               type:Number,
//               required:true
//             },
//             _product:{
//                 type:mongoose.Schema.Types.ObjectId,
//                 ref:'Product',
//                 required:true
//             }
//           }
//            ],
//           totalPrice:{
//             type:Number,
//             required:true
//           },
//           status:{
//               type:String,
//               enum:['delivered','processing','shipped','cancelled'],
//               default:'processing'
//           },
//           address:{
//               type:String,
//               required:true,
//           },
//           createdAt:{
//             type: Date,
//             default: Date.now

//           },
//           modifiedAt:{
//             type: Date,
//             default: Date.now
//           },
//           cancellationRequest:{
//             type:Boolean,
//             default:false
//           },
//           returnRequest:{
//             type:Boolean,
//             default:false
//           }

//         },

//       ]

// });

// // orderSchema.pre('findOneAndUpdate', function(next) {
// //   this.modifiedAt = Date.now();
// //   next();
// // });

// module.exports = mongoose.model('Order',orderSchema)

const orderSchema = new mongoose.Schema({
  //  customerName: String,
  customerId: String,
  // contactNumber: Number,
  id: String,

  ordersList: [
    {
      id: String,

      orderItems: [
        {
          id: String,
          name: String,
          price: Number,
          quantity: Number,
        },
      ],
      address: {
        type: String,
      },
      totalPrice: Number,
      orderStatus: {
        type: String,
        enum: ["processing", "shipped", "delivered", "cancelled"],
        default: "processing",
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      modifiedAt: {
        type: Date,
        default: Date.now,
      },

      cancellationrequest: {
        type: Boolean,
        default: false,
      },
      returnRequest:{
        type:Boolean,
        default:false
      },
      paymentStatus: {
        type: Boolean,
        default: true,
      },
      returnrequest: {
        type: Boolean,
        default: false,
      },
      paymentmode:{
        type:String,
        required:true,
        default: "cod",
      }
    },
  ],
});

module.exports = mongoose.model("Order", orderSchema);
