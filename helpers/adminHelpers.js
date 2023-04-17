const { v4: uuidv4 } = require("uuid");
const voucher_codes = require("voucher-code-generator");
const userModel = require("../models/userSchema");
const categoryModel = require("../models/categorySchema");
const productModel = require("../models/productsSchema");
const orderModel = require("../models/orderSchema");
const addressModel = require("../models/addressSchema");
const parentModel=require("../models/parentSchema")
const couponModel=require("../models/couponSchema")
const { getDate } = require("../controllers/adminControllers");
const bannerModel=require('../models/bannerSchema')
const notifier = require('node-notifier');

/**
 *
 * User CRUD Operaions
 */
async function listUsers(pageNum, perPage) {
  let users = await userModel.find({}).skip((pageNum - 1) * perPage).limit(perPage)
    .catch((error) =>
      console.log(
        `Error at finding the userslist from the DB, refer the error : ${error}`
      )
    );

  let userData = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    blocked: user.blocked,
  }));

  return userData;
}

async function userBlock(userId) {
  
  await userModel
    .updateOne({ id: userId }, { blocked: true })
    .catch((error) =>
      console.log(
        `Error at updaing the user block operations, refer the error : ${error}`
      )
    );
}
async function userUnBlock(userId) {
  console.log(userId);
  await userModel
    .updateOne({ id: userId }, { blocked: false })
    .catch((error) =>
      console.log(
        `Error at updaing the user unblock operations, refer the error : ${error}`
      )
    );
}

/**
 * Category CRUD operations
 *
 */

async function listCategory(req, res) {
  let categories = await categoryModel
    .find({})
    .catch((error) =>
      console.log(
        `Error at finding the Category list from the DB, refer the error : ${error}`
      )
    );

  let categoryData = categories.map((cate) => ({
    id: cate.id,
    category: cate.category,
    parent: cate.parent,
  }));
  let parentData=await parentModel.find({})
  return [categoryData,parentData];
}


async function createCategory(data) {
  const category = data.category;
  const parent = data.parent;

  // Check if category already exists
  const existingCategory = await categoryModel.findOne({ category: category });
  if (existingCategory) {
    console.log(`Category '${category}' already exists`);
    return;
  }

  await categoryModel
    .create({
      id: uuidv4(),
      category: category,
      parent: parent,
    })
    .catch((error) =>
      console.log(
        `Error at Creating the Category to the DB, refer the error : ${error}`
      )
    );
}

async function editCategory(idToEdit) {
  let forEditCategory = await categoryModel
    .findOne({ id: idToEdit })
    .catch((error) =>
      console.log(
        `Error at finding the Eidt Category from the DB, refer the error : ${error}`
      )
    );
  return forEditCategory;
}

async function editCategoryPost(req, res) {
  const idToEdit = req.params.id;
  const category = req.body.category;
  const parent = req.body.parent;

  await categoryModel.updateOne(
    { id: idToEdit },
    { $set: { category: category, parent: parent } }
  );
}

async function deleteCategory(idToDelete) {
  await categoryModel.deleteOne({ id: idToDelete });
}

async function listCat(){

  let parent = await parentModel
    .find({})
    .catch((error) =>
      console.log(
        `Error at finding the Category list from the DB, refer the error : ${error}`
      )
    );

  let parentData = parent.map((cate) => ({
    id: cate.id,
    category: cate.category,
    
  }));
  return parentData;

}

async function catPost(catValue){

  const existingCategory = await parentModel.findOne({ category: catValue });

  if (existingCategory) {
    console.log(`Category '${catValue}' already exists`);
    return;
  
}
await parentModel
    .create({
      id: uuidv4(),
      category: catValue
      
    })
    .catch((error) =>
      console.log(
        `Error at Creating the Category to the DB, refer the error : ${error}`
      )
    );

}

async function catEdit(){

  let forEditParent = await parentModel
    .findOne({ id: idToEdit })
    .catch((error) =>
      console.log(
        `Error at finding the Eidt Category from the DB, refer the error : ${error}`
      )
    );
  return forEditParent;

}

async function editCatPost(req,res){
  const idToEdit = req.params.id;
  const category = req.body.category;
  

  await parentModel.updateOne(
    { id: idToEdit },
    { $set: { category: category } }
  );

}

async function catDelete(req,res){
  await parentModel.deleteOne({ id: idToDelete });

}



//Products CRUD OPERATIONS

async function listProducts(pageNum, perPage) {
  let products = await productModel
    .find({}).skip((pageNum - 1) * perPage).limit(perPage)
    .catch((error) =>
      console.log(
        `Error at finding the Products list from the DB, refer the error : ${error}`
      )
    );
  let productsData = products.map((prod) => ({
    id: prod.id,
    itemName: prod.itemName,
    category: prod.category,
    price: prod.price,
    quantity: prod.quantity,
    images: prod.images,
    description: prod.description,
    isActive: prod.isActive,
  }));

  return productsData;
}

async function createProduct(product) {
  

  await productModel.create({
    id: uuidv4(),
    itemName: product.itemName,
    category: product.category,
    quantity: product.quantity,
    price: product.price,
    images: product.Images,
    description: product.description,
    category: product.category,
  });
}

async function editProduct(idToEdit) {
  let forEditProduct = await productModel
    .findOne({ id: idToEdit })
    .catch((error) =>
      console.log(
        `Error at finding the Edit Product from the DB, refer the error : ${error}`
      )
    );
  
  
  return forEditProduct;
}

async function editProductPost(req, res) {
  let idToEdit = req.params.id;
  let itemName = req.body.itemName;
  let description = req.body.description;
  let category = req.body.category;
  let parent = req.body.parent;
  let quantity = req.body.quantity;
  let price = req.body.price;
  let images = req.files;
  

 
  
 
  
  await productModel.updateOne(
    { id: idToEdit },
    {
      $set: {
        itemName: itemName,
        description: description,
        category: category,
        parent: parent,
        price: price,
        quantity: quantity,
        images: images,
      },
    }
  );
}

// async function deleteProduct(idToDelete) {
//   await productModel.deleteOne({ id: idToDelete });
// }

async function deleteProduct(idToDelete) {
  try {
    const response =await productModel.deleteOne({ id: idToDelete });
        return response
  }catch(error){
    throw error
  }
  

}

async function productAdd(){
  let parentData=await parentModel.find({})
  return parentData
}



async function addBanner(texts, Image) {
  try {
    const banner = new bannerModel({
      title: texts.title,
      description: texts.description,
      link: texts.link,
      image: Image,
    });
    const response = await banner.save();
    return response;
  } catch (error) {
    throw error;
  }
}

async function listBanners(){
  const response=await bannerModel.find({})
return response
}


async function listOrder(pageNum, perPage) {
  const orderData = [];
  const allOrders = await orderModel.find();
  for (const oneOrder of allOrders) {
    const user = await userModel.findOne({ id: oneOrder.user });
    for (orderList of oneOrder.ordersList) {
      let idAddress = orderList.address;
      const address = await addressModel.findOne({ "addresses.id": idAddress });
      const orderInfo = {
        id: orderList.id,
        items: orderList.orderItems,
        totalPrice: orderList.totalPrice,
        orderStatus: orderList.orderStatus,
        cancellationrequest: orderList.cancellationrequest,
        returnRequest: orderList.returnRequest,
        address: address,
        createdAt: orderList.createdAt,
        modifiedAt: orderList.modifiedAt,
      };
      orderData.push(orderInfo);
    }
  }
  const start = (pageNum - 1) * perPage;
  const end = start + perPage;
  return orderData.slice(start, end);
}



async function statusChange(orderId, status) {
  if (status === "cancelled") {
    orderModel
      .findOneAndUpdate(
        { "ordersList.id": orderId },
        {
          $set: {
            "ordersList.$.orderStatus": status,
            "ordersList.$.cancellationrequest": true,
          },
        }
      )
      .exec(function (err, result) {
        if (err) {
          console.log("Error:", err);
          return err;
        } else {
          console.log("Status changed:", result);
          return result;
        }
      });
  }
  if (
    status === "shipped" ||
    status === "processing" ||
    status === "delivered"
  ) {
    orderModel
      .findOneAndUpdate(
        { "ordersList.id": orderId },
        {
          $set: {
            "ordersList.$.orderStatus": status,
            "ordersList.$.cancellationrequest": false,
          },
        }
      )
      .exec(function (err, result) {
        if (err) {
          console.log("Error:", err);
          return err;
        } else {
          console.log("Status changed:", result);
          return result;
        }
      });
  }
}

async function orderDetails(orderId) {
  try {
    const order = await orderModel.findOne(
      { "ordersList.id": orderId },
      { "ordersList.$": 1 }
    );
    
    const Order = await orderModel.findOne({ "ordersList.id": orderId });
   
    let user = await userModel.findOne({ id: Order.customerId });
    
    const address = await addressModel.findOne(
      { user: Order.customerId },
      { addresses: { $slice: 1 } }
    );
    
    if (address) {
      const addressCity = address.city;
     
    }

    return { order, user, address };
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function viewReport(req, res) {
  let orders = await orderModel.aggregate([
    { $unwind: "$ordersList" },

    { $match: { "ordersList.orderStatus": "delivered" } },
  ]);

  return orders;
}

async function getTotal(req, res) {
  let result = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.orderStatus": "delivered" } },
    {
      $group: {
        _id: null,
        grandTotal: { $sum: "$ordersList.totalPrice" },
      },
    },
  ]);
  const tot = result[0].grandTotal;
  
  return tot;
}

async function postReport(start, end) {
  const startDate = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T23:59:59.999Z`);
  let annualReportOrders;
  let orders = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    {
      $match: {
        "ordersList.orderStatus": "delivered",
        "ordersList.createdAt": { $gte: startDate, $lte: endDate },
      },
    },
  ]);
  return orders

  

  
}
async function getFullTotal(start,end){
  const startDate = new Date(`${start}T00:00:00.000Z`);
  const endDate = new Date(`${end}T23:59:59.999Z`);

  let result = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    {
      $match: {
        "ordersList.orderStatus": "delivered",
        "ordersList.createdAt": { $gte: startDate, $lte: endDate },
      },
    },
   
    {
      $group: {
        _id: null,
        grandTotal: { $sum: "$ordersList.totalPrice" },
      },
    },
  ]);
  if(result && result.length > 0){
    const tot = result[0].grandTotal;
  
    return tot;
  }


}
async function orderCount(){
  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.orderStatus": "delivered" } },
    { $count: "orderCount" },
  ]);
  
  
  return orderCount[0].orderCount;
  

}
 async function productCount(){
 
  const count = await productModel.estimatedDocumentCount({});
 
  return count;
  
}

async function userCount(){
  
  const count=await userModel.estimatedDocumentCount({})
  return count
}

async function razorpayOrders(){

  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.paymentmode": "razorpay" } },
    { $count: "orderCount" },
  ]);

  
 
  order=orderCount[0].orderCount
  

  return order;

}

async function codOrders(){
  
  
  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.paymentmode": "cod" } },
    { $count: "orderCount" },
  ]);
  
  
 let order=orderCount[0].orderCount
  
  return order;
}

async function processOrders(){
   
  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.orderStatus": "processing" } },
    { $count: "orderCount" },
  ]);

  
  let order=orderCount[0].orderCount
  
  return order;

}
async function shippedOrders(){
  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.orderStatus": "shipped" } },
    { $count: "orderCount" },
  ]);

  
 
  if(orderCount){
  
  return 2;
  }else{
    return 1
  }

}
async  function cancelOrders(){
  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.orderStatus": "cancelled" } },
    { $count: "orderCount" },
  ]);

 
  
  let order=orderCount[0].orderCount
 
  return order;


}

async function deliverOrders(){
  let orderCount = await orderModel.aggregate([
    { $unwind: "$ordersList" },
    { $match: { "ordersList.orderStatus": "delivered" } },
    { $count: "orderCount" },
  ]);

 
  
  let order=orderCount[0].orderCount
  
  return order;
  
}
async function postAddCoupon(data){
 


  try {
    await couponModel.create(data);
    return { status: true };
  } catch (error) {
    console.log(error);
    throw error;
  }

}

async function generateCoupon(){
  try {
    let couponCode = voucher_codes.generate({
      length: 6,
      count: 1,
      charset: "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      prefix: "WHITE-",
    });
    
        return { status: true, couponCode: couponCode[0] };
  } catch (err) {
    console.log(err);
    throw err;
  }

}
async function getCoupons(){
 
    try {
    const data =await couponModel.find({});
    
    return data;
    } catch (error) {
    throw error;
    }
    }


async function deleteCoupon(couponId)

{
  
  try {
    const response = await couponModel.deleteOne({ _id: couponId });
    return response;
  } catch (error) {
    throw error;
  }

  }

async function documentCount(){
  const count = await userModel.countDocuments();
  return count;
}
async function ordersCount(){
  let totalCount = 0;
  const orders = await orderModel.find();
  orders.forEach(order => {
    totalCount += order.ordersList.length;
  });
  return totalCount;
}

async function viewUser(pageNum,perPage){
  try {
    const response = await userModel.find().skip((pageNum - 1) * perPage).limit(perPage);
    return response;
  } catch (error) {
    throw new Error(error.message);
  }

}

async function proCount(){
  const count=await productModel.countDocuments()
return count
}




module.exports = {
  listUsers,
  userBlock,
  userUnBlock,
  listCategory,
  createCategory,
  editCategory,
  editCategoryPost,
  deleteCategory,
  listProducts,
  createProduct,
  editProduct,
  deleteProduct,
  editProductPost,
  productAdd,
  addBanner,
  listBanners,
  listOrder,

  statusChange,
  orderDetails,
  viewReport,
  getTotal,
  postReport,
  getFullTotal,
  orderCount,
  productCount,
  userCount,
  razorpayOrders,
  codOrders,
  processOrders,
  shippedOrders,
  deliverOrders,
  cancelOrders,
  catPost,
  catEdit,
  listCat,
  editCatPost,
  catDelete,
  postAddCoupon,
  generateCoupon,
  getCoupons,
  deleteCoupon,
  documentCount,
  viewUser,
  ordersCount,
  proCount
  
  
};
