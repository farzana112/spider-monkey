const userHelpers = require("../helpers/userHelpers");
const paymentControllers=require("../controllers/paymentControllers")
const User = require("../models/userSchema");
const addressSchema = require("../models/addressSchema");
const Cart = require("../models/cartSchema");
const Order = require("../models/orderSchema");
const Category=require('../models/categorySchema')
const Coupon=require('../models/couponSchema')
const mongoose = require("mongoose");
const { resolve } = require("path");
const { rejects } = require("assert");
const { uuid } = require("uuidv4");
const slugify=require("slugify")
// const { name } = require("ejs");
const Razorpay = require('razorpay');
const notifier = require('node-notifier');
let otp, err, usercart;
let name, wrong;
let blocked=false;
let filterProducts,filterParentData;
let error, signupUser, signinUser, signinErr;
// const notifier = require('node-notifier');
// get request Landing page

function authenticate(req, res, next) {
  if (req.session.user) {
    name = req.session.user.name;
    next();
  } else {
    res.redirect("/signin");
  }
}

async function fetchCategories(req, res, next) {
  try {
    const categories = await Category.find();
    
    res.locals.categories = categories;
    next();
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
}



function mainPage(req, res) {
  if (req.session.user) {
    name = req.session.user.name;
    
    userHelpers.forproducts(req, res).then((resultArray) => {
      const productsData=resultArray[0];
      const bannerData=resultArray[1]
      res.render("user/landing", { layout:"layouts/userlayout",productsData, bannerData,name });
    });
  } else {
    userHelpers.forproducts(req, res).then((resultArray) => {
      const productsData=resultArray[0];
      const bannerData=resultArray[1]
      res.render("user/landing", { layout:"layouts/userlayout",productsData,bannerData });
    });
  }
}

function getContactPage(req,res){
  res.render("user/contact")
}

// GET request Sigin and Signup Page

function getSigininSignup(req, res) {
  if (!req.session.user) {
    name = null;

    return res.render("user/reglogin", { layout:"layouts/userlayout", error, name, wrong,blocked });
  } else {
    return res.redirect("/");
  }
}

function postSignup(req, res) {
  userHelpers.signup(req, res).then((newUser) => {
    if (newUser === false) {
      error = true;

      res.redirect("signin");
    } else {
      message = true;
      req.session.message=message;
      res.redirect("signin");
    }
  });
}

// GET request Products page

function forProducts(req, res) {
  return res.render("user/product", {layout:"layouts/userlayout", name });
}


function postSigin(req, res) {
  userHelpers.signin(req, res).then((signinUser) => {
    ;

    if (signinUser === false) {
      signinErr = true;
      //return res.redirect('/signin')
      return res.render("user/reglogin", { layout:"layouts/userlayout",signinErr });
    }
    if (signinUser === true) {

      blocked = true;
      // return res.redirect("/signin");
      return res.render("user/reglogin",{layout:"layouts/userlayout",blocked})
    }
    if (signinUser === "Wrong Password Or E-mail") {
      wrong = true;
      res.redirect("signin");
    }
    if (signinUser != "Wrong Password Or E-mail"  ) {
      req.session.user = signinUser;
     req.session.message=true

      return res.redirect("/");
    }
  });
}
function formatDate(x){

  const date = new Date(x)
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  const formattedDate = date.toLocaleDateString('en-GB', options);

  return formattedDate

}

function convertOrderId(orderId) {
  return parseInt(Math.abs(hashCode(orderId)).toString().slice(0, 6));
}

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}



function postVerifyOTP(req, res) {
  let mobileNumber = req.body.mobileNumber;
  console.log("mobileNumber is:  " + mobileNumber);
  userHelpers.loginOtp(mobileNumber).then((response) => {
    if (response === false) {
      signinErr = true;
      res.redirect("/signin");
    }

    if (response === true) {
      blocked = true;
      res.redirect("/signin");
    }
    if (response) {
      req.session.user = response;
      const accountSid = "ACeb5bb83b2702e34b066334b18e2034d3";
      const authToken = "8338bce61af5e0ea3be6f201c698d256";
      const client = require("twilio")(accountSid, authToken);
      otpgen = Math.floor(1000 + Math.random() * 9000);

      client.messages
        .create({
          body: `your otp is ${otpgen}`,
          from: "+14308085738",
          to: "+918089110473",
        })
        .then((message) => console.log(message.sid));

      const otp1 = req.body.otp1;
      const otp2 = req.body.otp2;

      const otp3 = req.body.otp3;

      const otp4 = req.body.otp4;
      otp = otp1 + otp2 + otp3 + otp4;
      console.log(otpgen);
      console.log(otp);
      if (otpgen == otp) res.redirect("/");
      else res.render("user/otp", { layout:"layouts/userlayout",err: true });
      // res.redirect("/")
    }
  });
}

// function sendOTP(){}

function sendAOTP(req,res){
res.render("user/otp")
}

function getUserProf(req, res) {
  let user = req.session.user;
  let name = user.name;

  
userHelpers.forProfilePage(user).then((response)=>{
  const{orderData,itemData,userData,addressData}=response
req.session.orderData=orderData


req.session.itemData = itemData;



   res.render('user/profile',{layout:"layouts/userlayout",name,orderData,formatDate,convertOrderId,itemData:req.session.itemData,userData,addressData})

   

   
})

  
}

 function editProf(req,res){
let user=req.session.user;

 const userId=user._id
 

  const{firstName,email,contactNumber}=req.body
 userHelpers.updateUser(userId,firstName,email,contactNumber).then(()=>{

  res.redirect('/userprofile')
 })

 

 }


 function updatePassword(req,res){

  const user=req.session.user;
  
  const userId=req.session.user._id

  
  
  const{currentPassword,newPassword,confirmPassword }=req.body
  userHelpers.changePassword(userId,currentPassword,newPassword,confirmPassword).then((password)=>{
    res.redirect('/userprofile?password=' + password);
    
  })

 }

 function addAddress(req,res){
  const user=req.session.user
  const userId=req.session.user.id
  const addressData = {
    name: req.body.name,
    contactNumber: req.body.contactNumber,
    firstLine: req.body.firstLine,
    secondLine: req.body.secondLine,
    pincode: req.body.pincode,
    city: req.body.city,
    state: req.body.state
  };
userHelpers.addressAdd(addressData,userId).then()
res.redirect("/userprofile")
 }




function forOneProduct(req, res) {
  let product_id = req.params.id;
  let user = req.session.user;
  
  name=user.name
  
  userHelpers.forOnePro(product_id).then((oneProduct) => {
    res.render("user/a_product", { layout:"layouts/userlayout",oneProduct,name });
  });
}

async function shopProduct(req, res) {
  let name
  let user=req.session.user;
  if(user){
     name=user.name
  }
  const pageNum=req.query.page;
  const perPage=3
  const currentPage=pageNum
  const documentCount= await userHelpers.docCount()
 
  const totalPages=Math.ceil(parseInt(documentCount) / perPage);
  await userHelpers.shopListProduct(pageNum,perPage).then((resultArray) => {
    response=resultArray[0];
    parentData=resultArray[1]
  
    res.render("user/shop", { layout:"layouts/userlayout",response, name ,parentData});
    
  });
}

//new cart section
// async function getAddToCart(req,res){
//   try {
    

//     await userHelpers.addToCart(req.params.id, req.session.user.id).then((data) => {
//       res.json({ status: true });
//     });
//   } catch (error) {
//     res.status(500)
//   }
// }


function getViewCart(req,res){
  res.render("user/view-cart")
}



//cart -section

function showCart(req, res) {
  const cartId = req.session.cartId;
  const user=req.session.user;

  
  
  
  if (cartId === null || cartId === undefined ) {
    let message = false;
    res.render("user/cart", { layout:"layouts/userlayout",message, name });
  } else {
    let message = true;
    userHelpers.viewCart(cartId).then((response) => {
      const [cartItems, totalPrice] = response;
      // req.session.cartItems = cartItems;
      // // console.log("cartItems  1111111111"+cartItems[0])

      // req.session.totalPrice = totalPrice;
      req.session.cartItems = cartItems ?? []; // provide an empty array as the default value
      req.session.totalPrice = totalPrice ?? 0;
      
      res.render("user/cart", { layout:"layouts/userlayout",cartItems, totalPrice, message, name });
    });
  }
}


async function addToCart(req, res) {
  let price = Number(req.body.price);
  console.log("price of the product"+price);
  const productToTheCart = {
    user: req.session.user.id,
    cartItems: {
      product: req.body.prodId,
      quantity: req.body.quantity,
      price: price,
      prod: req.params.id,
    },
  };
  
  
  userHelpers.addCart(productToTheCart).then((cart) => {
    req.session.cartId = cart.id;
    console.log("cartId");
    console.log(req.session.cartId)


    res.redirect('/cart')
  });
}
async function updateQuantity(req,res){
 
   const pid = req.body.product; 
   let qty = req.body.quantity;
  
let count=req.body.count;
   const pCost = req.body.pCost
  // console.log(req.body.quantity,req.body.count);
  // const uEmail = req.session.userid.email;
  let response={} ;
  
  let total=0;
  response.subtotal=parseInt(pCost) *qty ;
 // req.session.total
 console.log("pid",pid);
 console.log("qty",qty);
 console.log("pcost",pCost);
 console.log("subtotal",response.subtotal);

   if (count == -1 && qty == 1) {
   
    
     qty=1;
    

  } else {
    console.log("else");
   await Cart.updateOne(
        {
          
          "cartItems.product": pid,
        },
        {
          
          $set: { "cartItems.$.subtotal": response.subtotal , "cartItems.$.quantity": qty}
        }
      )
      .then((response) => {
       console.log(response);

      });
  //console.log("updated cart",updatedCart);
  let l=0;
  
 const cartId=req.session.cartId
  let cart = await Cart.findOne({ id: cartId }).populate({
    path: "cartItems.product",
    select: "id itemName price images IsActive",
  });
 let cartItems = [];
 //console.log();

  cart.cartItems.forEach((item, index) => {
    cartItems[index] = {
      id: item.product.id,
      itemName: item.product.itemName,
      price: item.product.price,
      images: item.product.images,
      quantity: cart.cartItems[index].quantity,
      product: item.product._id,
      subtotal: item.quantity * item.product.price,
    };
  });
  //console.log(cartItems[0])
  
 
    let total=0;
   
  for(let i=0;i< cartItems.length;i++)
  {
       total=total+cartItems[i].subtotal;
       
  }
  console.log(total);
       response.total=total;
       req.session.totalPrice=total;
     req.session.cartItems = cartItems
       res.json(response);
  
  // }  
  }
 

}

function deleteCartItem(req, res) {
  let itemTodelete = req.params.id;
  
  userHelpers.removeCartItem(itemTodelete).then((removeItem) => {
   
    res.redirect("/cart");
  });
}

async function removeCart(req, res) {
  userHelpers.clearCart().then((response) => {
    res.redirect("/cart");
  });
}

function deleteItem(req,res){
  
  const itemId=req.params.id
  const cartId=req.session.cartId
  
   userHelpers.deleteItem(itemId,cartId).then((response) => {
     res.json(response)
     
   })
 }




function showWishList(req,res){
  let user=req.session.user;
 
  if(!user){
    let message =false
    res.render("user/wishlist",{layout:"layouts/userlayout",message})
  }else{
    let message =true
    res.render("user/wishlist",{layout:"layouts/userlayout",message})
  }
}







function getAddressPage(req, res) {
  userHelpers.viewAddress(req,res).then((addresses)=>{
     
    console.log("addresses at getadress page"+addresses)
    res.render("user/address", { layout:"layouts/userlayout",name ,addresses});
  })
}
// function getAddressPage(req, res) {
//   userHelpers.viewAddress(req,res).then((addresses)=>{

//     console.log("addresses in get page: ", Array.isArray(addresses), addresses);

//     // console.log("addresses in get page"+addresses)
//     res.render("user/address", { layout:"layouts/userlayout", name }, (err) => {
//       if (err) {
//         console.error(err);
//         res.status(500).send('Error rendering template');
//       } else {
//         res.end();
//       }
//     });
//   }).catch((err) => {
//     console.error(err);
//     res.status(500).send('Error fetching addresses');
//   });
// }


function postaddress(req, res) {
  console.log
  const newAddress = {
    user: req.session.user.id,
    address: {
      name: req.body.name,
      contactNumber: req.body.contactNumber,
      firstLine: req.body.firstLine,
      secondLine: req.body.secondLine,
      city: req.body.city,
      state: req.body.state,
      pincode: req.body.pincode,
      id: uuid(),
    },
  };

  userHelpers.address(newAddress).then((response) => {
    req.session.Address = response;

    

    res.redirect("/checkout");
  });

  
}

//   Check-Out

function getCheckoutPage(req, res) {
console.log(req.session);
  userHelpers.viewAddress(req,res).then((addresses)=>{
     
    
    const address=req.body.address
    // console.log("address from checkout page"+req.body)
    const totalPrice = req.session.totalPrice;
    // const address = req.session.Address;
    const cartItems = req.session.cartItems;
    // const cartItems = Cart.find("id:req.session.cartId")
    const user=req.session.user;
    
    
    res.render("user/checkout", { layout:"layouts/userlayout",totalPrice, addresses, cartItems,name });
  })
  }


function clearItemData(req, res, next) {
 
  delete req.session.itemData;
  next();
}
async function postCheckOut (req, res) {
  
  let dataOrder=req.body
  let addressId=req.body.address
  // const customerName = req.session.user.name
  let user=req.session.user;
 
  const customerId=req.session.user.id

  // const address = req.session.Address;

  const cartItems = req.session.cartItems;

  const totalPrice = req.session.totalPrice;
  console.log(cartItems)
  console.log("cart Itmes")
  const orderItems=cartItems.map(item=>{
    return{
      product:item.product,//_id
      price:item.price,
      quantity:item.quantity,
      prod:item.id,  //id
      images:item.images
  }
})


req.session.orderItems=orderItems
console.log("orderItems ar post checkout");
console.log(orderItems);


  
  const newOrder = new Order({
    
    customerId,
     id:uuid(),
     ordersList:{
      orderItems:orderItems,
      address:addressId,
      totalPrice:totalPrice ,
      id:uuid(),
      paymentmode : req.body['payment_method'] === 'cod' ? 'cod' : 'razorpay'
  


     }
      });
 
  userHelpers.orderCreate(newOrder,req,res,dataOrder).then((orderId)=>{

  let orderid =orderId.orderId
  let total =orderId.totalPrice
   
  if(req.body['payment_method']=='cod'){
 
  res.render('user/orderconfirm',{layout:"layouts/userlayout"})}

  else if(req.body['payment_method']=='razorpay'){
   
paymentControllers.generateRazorPay(orderid,total).then((order)=>{
  
  res.render('user/rpay_checkout',{layout:"layouts/userlayout",order})
}).catch((err)=>{
  console.log(err);
})
  }
})

}

function validateCoupon(req,res){
  const coupon=req.body.couponName;
  
  }

function getorderPage(req, res) {
  let name=req.session.user.name

  res.render("user/orderconfirm",{layout:"layouts/userlayout",name});
}




async function orderItemDetails(req,res){

  const orderId=req.params.id;
  const orderData=req.session.orderData
 
  // let itemData=req.session.itemData
  console.log("from order item details");
  console.log(req.session.orderItems);
  
  
const idSlug = slugify(orderId, { lower: true })
  
  const orderDetails =await orderData.find((order) => order.id == orderId)
const user=req.session.user;
const name=user.name
// const itemData=req.session.itemData
const resultArray= await userHelpers.orderItems(orderId)
const orderProducts=resultArray[0]
const itemData=resultArray[1]
console.log("order products")
console.log(orderProducts);
console.log("match prodtd");
console.log(itemData);
 await  userHelpers.statusUpdate(orderData).then((orderData)=>{
   
   


    res.render('user/orderdetails',{layout:"layouts/userlayout",orderDetails,itemData,name,formatDate,convertOrderId,orderData})
   
  })



}




function orderCancel(req, res) {
  let idCancel = req.params.id;

  userHelpers.cancelOrder(idCancel).then(() => {
    res.redirect("/userprofile");
  });
}

function orderReturn(req, res) {
  let idReturn = req.params.id;

  userHelpers.returnOrder(idReturn).then(() => {
    res.redirect("/userprofile");
  });
}

//log-out
function logout(req, res) {
  req.session.user = null;
  res.render("user/reglogin",{layout:"layouts/userlayout"});
}


//       Wish List

function addToWishlist(req,res){

  let prodId=req.params.id
 
   let userId=req.session.user.id

   console.log("oruct iD"+prodId)
   console.log("userID"+userId)


 userHelpers.addWishlist(prodId,userId).then(()=>{
  res.redirect("/view_wishlist")
 })


  

   
}

function listWishlist(req,res){
  const userId=req.session.user.id
 
  userHelpers.listWish(req.session.user.id,res).then((wishlistItems)=>{
    
    if(wishlistItems.length==0 || wishlistItems===undefined){
      
      res.render("user/no_wishlist",{layout:"layouts/userlayout"})
    }
    res.render("user/wishlist",{ layout:"layouts/userlayout",wishlistItems})
  })

}

function deleteWishItem(req, res) {
  const itemTodelete = req.params.id;
  

  userHelpers.removeWishItem(itemTodelete).then((removeItem) => {
  

    res.redirect("/view_wishlist");
  });
}
  
function postSearch(req,res){
let product
  userHelpers.searchPost(req.body).then((resultArray)=>{
    if(resultArray[0]==null){
      product = null

    }
    else{
      product=resultArray[0]

    }
    const parentData=resultArray[1]
   res.render("user/shopsearch",{layout:"layouts/userlayout",product,parentData})

  })
}

function getSort(req,res){
res.render("user/shopsort2",{layout:"layouts/userlayout",filterProducts,filterParentData})
}
function postSort(req,res){
  
  const start=req.body['start']
  const end=req.body['end']
  console.log("strat"+start)
  console.log("end" +end)
  userHelpers.sortPost(start,end).then((resultArray)=>{
     filterProducts=resultArray[0]
     filterParentData=resultArray[1]
     const products=filterProducts
     const parentData=filterParentData
    res.render("user/shopsort",{layout:"layouts/userlayout",products,parentData})

  })


}

function postCategory(req,res){

 
  const category=req.body
  userHelpers.categoryPost(category).then((resultArray)=>{
const products=resultArray[0]
const parentData=resultArray[1]
    res.render("user/shopcategory",{layout:"layouts/userlayout",products, parentData})
  })
  

}

function shopCategory(req,res){

  const category=req.params.category;
  userHelpers.categoryShop(category).then((resultArray)=>{
    const products=resultArray[0]
    const parentData=resultArray[1]
    res.render("user/shopsort",{layout:"layouts/userlayout",products,parentData})
  })

}
async function couponPost(req,res){
 
  const couponCode= req.body.couponCode.toString(); 
  
  
  
  const uId = req.session.user.id;
  
  
  const cData = await Coupon.findOne({couponName:couponCode});

  
  let response={}
  
  
console.log(req.session.totalPrice);

let totalPrice=req.session.totalPrice
const userData=await User.findOne({id:uId})




  response.expiry=false;
  response.exist=false;
  response.totallow=false;
  response.discountedTotal=0;
  const currentDate = new Date();


   if (cData.expiry <currentDate) {
   response.expiry=true;
    console.log("expiry true");    
     res.json(response);
 }else if(userData.coupons.includes(couponCode))
 {
  response.exist=true;
  console.log("Coupon already exists");
   res.json(response);
//  res.json({ success: false, message: "Coupon already exists" });
 }
 else if(totalPrice<cData.minPurchase)
 {
  try {
 response.totallow=true;
 response.minAmount=cData.minPurchase;
   res.json(response);
 } catch (error) {
  console.log("Error:", error);
  res.status(500).json({ success: false, message: "Internal server error" });
 }
 }else{
 try {
    const result = await User.updateOne(
      { id: uId},
      { $push: { coupons: couponCode } }
   );
    console.log("New coupon added to user document:", couponCode);

   let maxDiscount=cData.maxDiscountValue;
   let discountApplied=0;
  const discountPercent= cData.discountPercentage;
   const discountAmount=(discountPercent/100)*totalPrice;
  
  if(discountAmount<=maxDiscount)
  {
   totalPrice = totalPrice- discountAmount;
   discountApplied=discountAmount;

  }
   else{
   totalPrice = totalPrice-maxDiscount;
     discountApplied=maxDiscount;
   }
 
req.session.totalPrice=totalPrice

   response.discountedTotal =totalPrice;
   response.discountAmount=discountApplied;
    console.log("discounted total",response.discountedTotal);

     res.json(response);
  } catch (error) {
   console.log("Error updating user document:", error);
   res.json({ success: false, message: "Error updating user document" });
 }


 }
}




module.exports = {
  mainPage,
  fetchCategories,
  authenticate,
  getSigininSignup,
  postSignup,
  postSigin,
  forProducts,
  
  postVerifyOTP,
  shopProduct,
  forOneProduct,
  showCart,
  addToCart,
  
  
  logout,
  sendAOTP,
  removeCart,
  deleteCartItem,
  deleteItem,
  getAddressPage,
  postaddress,
  getCheckoutPage,
  postCheckOut,
  getorderPage,
  editProf,
  updatePassword,
  getUserProf,
  orderCancel,
  orderReturn,
  getContactPage,
  orderItemDetails,
  addAddress,
  formatDate,
  convertOrderId,
  clearItemData,
  showWishList,
  addToWishlist,
  getViewCart,
  listWishlist,
  deleteWishItem,
  postSearch,
  postSort,
  postCategory,
  getSort,
  shopCategory,
  validateCoupon,
  couponPost,
  updateQuantity

};
