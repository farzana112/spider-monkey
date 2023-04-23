const Razorpay = require('razorpay');
const orderModel = require("../models/orderSchema");
const ObjectId = require("mongodb").ObjectId;

const instance = new Razorpay({
    key_id: 'rzp_test_M0KcTcmQL92pf4',
    key_secret: 'd1wehNjyi2k0kcTwVpatiB3p',
});

  
module.exports = {
    generateRazorPay: async (orderId, total) => {
        
        
        try {
            let order = await orderModel.findOne({'ordersList.id':orderId });
           
             total = total * 100
            if(order){
                let options = {
                    amount: parseInt(total),
                    currency: "INR",
                    receipt: "" + orderId,
                }
                const orderResponse = await instance.orders.create(options);
               
                return orderResponse;
            }
        } catch (err) {
            console.error(err);
            throw err; // re-throw the error to be caught by the caller
        }
    },


    verifyPayment(response,order){
        
    }


}
