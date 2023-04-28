const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcrypt");

const userModel = require("../models/userSchema");
const productModel = require("../models/productsSchema");
const cartModel = require("../models/cartSchema");
const addressModel = require("../models/addressSchema");
const orderModel = require("../models/orderSchema");
const wishModel=require("../models/wishSchema")
const parentModel=require("../models/parentSchema")
const categoryModel=require("../models/categorySchema")
const bannerModel=require("../models/bannerSchema")
const notifier = require("node-notifier");
const toastr = require("toastr");
const jquery = require("jquery");
const { JSDOM } = require("jsdom");
// const notifier = require('node-notifier');


const SCERET = process.env.SCERET;
const {
  shopProduct,
  forOneProduct,
} = require("../controllers/userControllers");
let otpgen, otp;

async function signup(req, res) {
  const { name, email, contactNumber, password } = req.body;
  // Checking the existing user
  const existingUser = await userModel
    .findOne({ email: email })
    .catch((error) =>
      console.log(
        `Error at finding the email id form the DB, refer the error : ${error}`
      )
    );
  if (existingUser) {
    return false;
  }

  let pass = password.toString();
  const hashedPassword = await bcrypt.hash(pass, 10);
  //User Creation
  const newUser = await userModel.create({
    id: uuidv4(),
    name: name,
    email: email,
    hashedPassword: hashedPassword,
    contactNumber: contactNumber,
  });
  console.log("new user!");
  console.log(newUser);
  return newUser;
}


async function signin(req, res) {
  
  let email = req.body.email;
  let password = req.body.password;
  ;

  const existingUser = await userModel
    .findOne({ email: email })
    .catch((error) =>
      console.log(
        `Error at finding the email id from the DB, refer the error : ${error}`
      )
    );
  if (!existingUser) {
    return false;
  } else if (existingUser.blocked) {
    return true;
  } else {
    

    let pass = password.toString();
    const matchPassword = await bcrypt.compare(
      pass,
      existingUser.hashedPassword
    );
    
    if (matchPassword) {
      return existingUser;
    } else {
      let wrong = "Wrong Password Or E-mail";
      return wrong;
    }
  }
}



//otp

async function loginOtp(contactNumber) {
  const user = await userModel
    .findOne({ contactNumber: contactNumber })
    .catch((error) =>
      console.log(
        `Error at finding the phone number id form the DB, refer the error : ${error}`
      )
    );

  if (!user) {
    return false;
  } else if (user.blocked) {
    return true;
  } else {
    
    return user;
  }
}

function sendOTP(req, res) {
 
}





async function shopListProduct(pageNum,perPage) {
  try {

    const response = await productModel.find().skip((pageNum - 1) * perPage).limit(perPage)
    const parentData=await parentModel.find({})
    return [response,parentData];

  } catch (error) {
    throw error;
  }
}



async function categoryPost(category, res) {
  const catValue = category['category'];
;

  try {
    const products = await productModel.find({ category: catValue }).exec();
   
    const parentData = await parentModel.find({})
    return [products,parentData]
  
  } catch (err) {
    console.log(err);
    
  }
}



async function forproducts(req, res) {
  let productsData = await productModel
    .find({})
    let bannerData=await bannerModel.find({})
    .catch((error) =>
      console.log(
        `Error at finding the Prodcuts list from the DB, refer the error : ${error}`
      )
    );

  return[ productsData,bannerData]
}

async function forOnePro(prodId) {
  let oneProduct = await productModel
    .findOne({ id: prodId })
    .catch((error) =>
      console.log(
        `Error at finding the Producct for Editing from the DB,error is : ${error}`
      )
    );
  return oneProduct;
}

function clearItemData(req, res, next) {
  console.log("Item Data From the Session");
  delete req.session.itemData;
  next();
}

async function addCart(productToTheCart) {
  let cart = await cartModel.findOne({ user: productToTheCart.user });
  console.log("after helpers")
  console.log(cart)

  if (cart) {
    let product = productToTheCart.cartItems.prod;
    let productExists = cart.cartItems.find((cart) => cart.prod == product);
    if (productExists) {
      let incCartQty = await cartModel.findOneAndUpdate(
        { id: cart.id, "cartItems.prod": productToTheCart.cartItems.prod },
        {
          $inc: { "cartItems.$.quantity": productToTheCart.cartItems.quantity },
        }
      );
    } else {
      let updateCart = await cartModel.updateOne(
        { id: cart.id },
        { $push: { cartItems: productToTheCart.cartItems } }
      );
    }
    notifier.notify({
      title: "Product added to cart",
      message: `The product has been added to your cart`,
      sound: true,
      wait: false,
      appName:"Phone Store",
      icon:"public/images/successicon.jpg",
      position:"top-left"
    });
  } else {
    cart = await cartModel.create({
      id: uuidv4(),
      user: productToTheCart.user,
      cartItems: productToTheCart.cartItems,
    });
  }
  const userCartupdate = await userModel.updateOne(
    { id: productToTheCart.user },
    { $set: { cart: cart.id } }
  );
  
  return cart;
}

async function viewCart(cartId) {
  let cart = await cartModel.findOne({ id: cartId }).populate({
    path: "cartItems.product",
    select: "id itemName price images _id",
  });
  let cartItems = [];

  if (!cart) {
    return [[], 0]; // return an empty cart and total price of 0 if cart does not exist
  }

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
  console.log("cart quantity"+cartItems[0]?.price)


  let totalPrice = cart.cartItems.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );

  return [cartItems, totalPrice];
}

async function clearCart() {
  let cartClear = await cartModel.updateMany({}, { $set: { cartItems: [] } });

  return cartClear;
}

async function removeCartItem(itemTodelete) {
  let removeItem = await cartModel.updateOne(
    { "cartItems.prod": itemTodelete },
    { $pull: { cartItems: { prod: itemTodelete } } }
  );

  return removeItem;
}

async function deleteItem(itemId,cartId){
  
  try {
    

    console.log("the item id to be deleted"+itemId);
    // const response = await cartModel.deleteOne({prod: itemId });
    // console.log("deleted item"+response)
//     const response = await cartModel.findOneAndDelete({prod: itemId});
// console.log("deleted item:", response);
const response = await cartModel.updateOne(
  { id: cartId },
  { $pull: { cartItems: { product: itemId } } }
);
console.log("deleted item:", response);
 const cart=await cartModel.findOne({id:cartId})
 console.log("cart after deletion"+cart)

    return response;
  } catch (error) {
    throw error;
  }

}






async function addWishlist(prodId,userId){

  
  let proObj={
    productId:prodId
  }
  let wishlistItem = await productModel.findOne({ id: prodId });
 
let wishlist=await wishModel.findOne({user:userId});

if(wishlist){
  let productExist =  wishlist.wishitems.findIndex((item) => item.productId === prodId);

  if(productExist==-1){
  let update=  await wishModel.updateOne({ user: userId },
      {
          $addToSet: {
            wishitems: proObj
          },
      }
  )
 

  }
}else{
    const newWishlist = new wishModel({
      user: userId,
      wishitems: proObj
  });
  
  await newWishlist.save()

  }
  let updatedWishlist = await wishModel.findOne({ user: userId }).populate("wishitems.productId");
  
  notifier.notify({
    title: "Product added to wishlist",
    message: `The product has been added to your wishlist`,
    sound: true,
    wait: false,
    appName:"Phone Store",
    icon:"public/images/successicon.jpg",
    position:"top-left"
  });
   return ;
  
  
    
   
}
async function listWish(userId,res){
return wishModel.aggregate([


    {
      $match: {
          user:userId
      }
  },

  {
    $unwind: '$wishitems'
},
{
 
    $project: {
      item: '$wishitems.productId',
        }
  
},
{
  $lookup: {
      from: 'products',
      localField: "item",
      foreignField: "id",
      as: 'wishlist'
  }
},
{
  $project: {
      item: 1, wishlist: { $arrayElemAt: ['$wishlist', 0] }
  }
},

  ]).then((wishlistItems)=>{
    
   
    
    return  wishlistItems
  })



}

 function removeWishItem(itemTodelete){
  
  
   
  let removeItem =  wishModel.updateOne(
    { "wishitems.productId": itemTodelete },
    { $pull: { wishitems: { productId: itemTodelete } } }
  )

  return removeItem;
   



}



async function address(newAddress) {
  let address = await addressModel.findOne({ user: newAddress.user });

  if (address) {
    let updateAddress = await addressModel.findOneAndUpdate(
      { id: address.id },
      { $push: { addresses: newAddress.address } }
    );

    // console.log(updateAddress);

    return newAddress.address;
  } else {
    let toAddAddress = await addressModel.create({
      id: uuidv4(),
      user: newAddress.user,
      addresses: newAddress.address,
    });

    const userAddressupdate = await userModel.updateOne(
      { id: newAddress.user },
      { $set: { address: toAddAddress.id } }
    );

    return newAddress.address;
  }
}

async function viewAddress(req,res){
const userId=req.session.user.id
  const address=await addressModel.find({user:userId})
  const addresses=address[0].addresses
  console.log("the address object that i got");
  console.log(addresses)
return addresses
}

async function forProfilePage(user) {
  

  let userData = await userModel.findOne({ id: user.id });

  let orderId = userData.order;

  let addressId = userData.address;

  
  let orders = await orderModel.findOne({ id: orderId });

  let addresses = await addressModel.findOne({ id: addressId });
  
let addressData=addresses.addresses[0]

  const orderData = [];
  const itemData = [];
  if (orders && orders.ordersList) {
  for ( var orderList of orders.ordersList) {
    let idAddress = orderList.address;


    const address = await addressModel.findOne({ "addresses.id": idAddress });


    const orderInfo = {
      id: orderList.id,
      user: user.name,
      items: orderList.items,
      totalPrice: orderList.totalPrice,
      orderStatus: orderList.orderStatus,
      address: address,
      createdAt: orderList.createdAt,
      modifiedAt: orderList.modifiedAt,
       cancellationrequest: orderList.cancellationrequest,
      // returnRequest: orderList.returnRequest,
    };

    orderData.push(orderInfo);

    for ( orderItem of orderList.orderItems) {
      const eachItem = await productModel.findOne({ price: orderItem.price });
      
    
      
      if (eachItem) {
        const itemInfo = {
          itemName: eachItem.itemName,
          quantity: orderItem.quantity,
          price: orderItem.price,
          images: eachItem.images,
          description: eachItem.description,
        };

       
        itemData.push(itemInfo);
      } else {
        console.log(`Could not find product with id ${orderItem.id}`);
      }
    }
  }
}

  return { orderData,itemData,userData,addressData };
}
async function forProfilePage(user) {
  let userData = await userModel.findOne({ id: user.id });
  let orderId = userData?.order;
  let addressId = userData?.address;
  let orders = await orderModel.findOne({ id: orderId });
  let addresses = await addressModel.findOne({ id: addressId });
  let addressData = addresses?.addresses?.[0];

  const orderData = [];
  const itemData = [];

  if (orders?.ordersList) {
    for (var orderList of orders.ordersList) {
      let idAddress = orderList.address;
      const address = await addressModel.findOne({ "addresses.id": idAddress });
      for ( orderItem of orderList.orderItems){}
      const eachItem = await productModel.findOne({ price: orderItem.price });

      const orderInfo = {
        id: orderList.id,
        user: user.name,
        items: orderList.items,
        totalPrice: orderList.totalPrice,
        orderStatus: orderList.orderStatus,
        address: address,
        createdAt: orderList.createdAt,
        modifiedAt: orderList.modifiedAt,
        cancellationrequest: orderList.cancellationrequest,
        // returnRequest: orderList.returnRequest,
      };

      orderData.push(orderInfo);

      for (orderItem of orderList.orderItems) {
        if (eachItem) {
          const itemInfo = {
            itemName: eachItem?.itemName,
            quantity: orderItem.quantity,
            price: orderItem.price,
            images: eachItem?.images,
            description: eachItem?.description,
          };

          itemData.push(itemInfo);
        } else {
          console.log(`Could not find product with id ${orderItem.id}`);
        }
      }
    }
  }

  return { orderData, itemData, userData, addressData };
}


async function updateUser(userId, name, email,contactNumber) {
  let updatedUser = await userModel.findOneAndUpdate(
    { _id: userId },
    { email: email, name: name ,contactNumber:contactNumber},
    { new: true }
  );

 
}




async function changePassword(
  userId,
  currentPassword,
  newPassword,
  confirmPassword
) {
  
  
    let currentUser = await userModel.findOne({ _id: userId });
    if (!currentUser) {
     
  
      return currentPassword;
    }

    

    if (newPassword !== confirmPassword) {
      
      notifier.notify({
        title: "Failed",
        message: `Error Occured while changing Password. Pls try Again!`,
        sound: true,
        wait: false,
        appName:"Phone Store",
        icon:"public/images/fail.png"
      });
      return currentPassword;
    }

    if (newPassword === currentPassword) {
      console.log("New password cannot be the same as the current password");
      notifier.notify({
        title: "Failed",
        message: `Error Occured while changing Password. Pls try Again!`,
        sound: true,
        wait: false,
        appName:"Phone Store",
        icon:"public/images/fail.png"

      });
      return currentPassword;
    }

    

    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      

      let updatedUser=await userModel.updateOne({_id:userId},{$set:{hashedPassword:hashedPassword}})
      if(updatedUser){
        notifier.notify({
          title: "Password Reset",
          message: `Your Password is successfully reset! `,
          sound: true,
          wait: false,
          appName:"Phone Store",
          icon:"public/images/successicon.jpg"

        });
        return currentPassword
        
      }


    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'An error occurred while changing the password' });
    }
    
 
}

async function addressAdd(addressData,userId){

let updateAddress= await addressModel.findOne({user:userId})
console.log("update Address  255555 ");
console.log(updateAddress);
updateAddress.addresses[0].name=addressData.name
updateAddress.addresses[0].contactNumber=addressData.contactNumber
updateAddress.addresses[0].firstLine=addressData.firstLine
updateAddress.addresses[0].secondLine=addressData.secondLine
updateAddress.addresses[0].city=addressData.city
updateAddress.addresses[0].pincode=addressData.pincode
updateAddress.addresses[0].state=addressData.state



return await updateAddress.save();
}
   

async function orderCreate(order, req, res,dataOrder) {
  let orderId;
  let totalPrice;
 
  let user = await userModel.findOne({ id: order.customerId });

  if (user.order != null && user.order !== "null") {
    let updateOrder = await orderModel.findOneAndUpdate(
      { id: user.order },
      { 
        "$push": { ordersList: order.ordersList } }
    );
    

    
    orderId = updateOrder?.ordersList[updateOrder.ordersList.length - 1].id;
    totalPrice = updateOrder?.ordersList[updateOrder.ordersList.length - 1].totalPrice;
  
    
  } else {
    const newOrder = await orderModel.create({
      id: order.id,
      customerId: order.customerId,
      ordersList: order.ordersList,
    });

    orderId = newOrder.ordersList[0].id;
    totalPrice = newOrder.ordersList[0].totalPrice;

    const userOrderupdate = await userModel.updateOne(
      { id: order.customerId },
      { $set: { order: newOrder.id } }
    );
  }

  const clearCartafterOrder = await  clearCart();


return new Promise((resolve, reject) => {
  resolve({ orderId, totalPrice });
});
}




async function cancelOrder(idCancel) {
  let cancelorder = await orderModel.findOneAndUpdate(
    { "ordersList.id": idCancel },
    { $set: { "ordersList.$.cancellationrequest": true } }
  );

  
  return cancelOrder;
}

async function orderItems(orderId){
  const orderItems = await orderModel.aggregate([
    { $match: { ordersList: { $elemMatch: { id: orderId } } } },
    { $unwind: "$ordersList" },
    { $match: { "ordersList.id": orderId } },
    { $unwind: "$ordersList.orderItems" },
    { $project: { _id: 0, orderItem: "$ordersList.orderItems" } }
  ]);
  
  console.log(orderItems);
  const prices = orderItems.map(orderItem => orderItem.orderItem.price);
  console.log("prices")
  console.log(prices);
  const matchingProducts = await productModel.find({ price: { $in: prices } });

  
  return [orderItems,matchingProducts]

}

async function returnOrder(idReturn) {
  let retunrOrder = await orderModel.findOneAndUpdate(
    { "ordersList.id": idReturn },
    { $set: { "ordersList.$.returnRequest": true } }
  );

  return true;
}


async function searchPost(searchData) {
  try {
    const searchTerm = searchData['search'];
    console.log("search term: " + searchTerm);

    const product = await productModel.findOne({ itemName: { $regex: new RegExp(searchTerm, 'i') } });
    const parentData=await parentModel.find({})

    // if (!product) {
    //   return 
    // }
    // else{
      
      // console.log(parentData)
      return [product,parentData]
    // }

    // Do something with the product if found
  } catch (error) {
    console.error(error);
    // Handle the error
  }
}

async function sortPost(startPrice, endPrice){
  // console.log("start"+start)
  // console.log("end"+end)
  const start = parseFloat(startPrice);
const end = parseFloat(endPrice);

// const products=  await productModel.find({ price: { $gte: start, $lte: end } }).sort({ price: 1 })
const products = await productModel.aggregate([
  {
    $match: {
      $expr: {
        $and: [
          { $gte: [{ $toDouble: "$price" }, start] },
          { $lte: [{ $toDouble: "$price" }, end] },
        ],
      },
    },
  },
  { $sort: { price: 1 } },
]);

console.log("produts sorted")
console.log(products)
const parentData=await parentModel.find({})
return [products,parentData]

}


async function categoryShop(category){
  const Category=await categoryModel.find({category:category})
  
  const selectedCategory = Category[0]
  const parentCategory=selectedCategory .parent
  
  const regex = new RegExp(selectedCategory.category, 'i'); // Create regex with category value
  
  const products = await productModel.find({ itemName: regex });
  const parentData=await parentModel.find({})
  
  return [products,parentData]
 
    
  
}
async function statusUpdate(orderData){

 
  const ordersToUpdate=  orderData.filter((order) => order.cancellationrequest == true)
  if(ordersToUpdate){
    if (ordersToUpdate.length > 0) {
      ordersToUpdate.forEach(async(order) => {
        order.orderStatus = "cancelled";
        // await order.save()
      });
    }
  }
  
return 
 

}

async function docCount(){
  const count=await productModel.countDocuments()
  return count

}



module.exports = {
  signup,
  signin,
  
  shopListProduct,
  forOnePro,
  addCart,
  viewCart,
  sendOTP,
  clearCart,
  orderItems,
  removeCartItem,
  deleteItem,
  address,
  viewAddress,
  forproducts,
  forProfilePage,
  addressAdd,
  cancelOrder,
  returnOrder,
  statusUpdate,
  orderCreate,
  loginOtp,
  updateUser,
  changePassword,
  clearItemData,
  addWishlist,
  listWish,
  removeWishItem,
  searchPost,
  categoryPost,
  sortPost,
  categoryShop,
  docCount
  
};
