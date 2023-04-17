const adminHelpers = require("../helpers/adminHelpers");
const Swal = require("sweetalert2");
const notifier = require("node-notifier");
// const notification = require('electron-notification');

let error;
let adminStatus
function getDate(x){

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

const credentials = {
  email: "admin@spidermonkey.com",
  password: "admin123",
};

// session handling middleware
function authenticate(req, res, next) {
  if (req.session.logIn) {
    next();
  } else {
    res.redirect("/admin");
  }
}

// layout setting middleware
function layout(req, res, next) {
  req.app.set("layout", "layouts/adminlayout");
  next();
}

// GET request Sigin Page
function getlogin(req, res) {
  if (req.session.admin) {
    res.redirect("/admin/dashboard");
  } else {
    res
      .render("admin/login", { layout: "layouts/adminloginlayout", error })
      
  }
}

// POST request Signin Page
function postlogin(req, res, next) {
  const { email, password } = req.body;

  if (credentials.email == email && credentials.password == password) {
    error = false;
    req.session.admin = req.body;
req.session.logIn=true;
adminStatus=req.session.logIn
console.log(req.session.admin);
console.log(req.session.logIn);
    notifier.notify({
      title: "Success",
      message: `You are Successfully Logged In`,
      sound: true,
      wait: false,
      appName: "Phone Store",
      icon: "public/images/successicon.jpg",
      position: "top-left",
    });

    res.redirect("/admin/dashboard");
    
  } else {
    error = true;
    res.redirect("/admin");
  }
}
// Logout Functionality
function getlogout(req, res) {
  req.session.admin = null;
  req.session.logIn = false;
  adminStatus = false;
  req.session.destroy((err) => {
    if (err) {
      console.log(err);
      res.status(404);
    } else {
      res.clearCookie("connect.sid");
      return res.render("admin/login",{layout:"layouts/adminloginlayout",adminStatus});
    }
  });
}

// GET Request for Dashboard

async function getDashboard(req, res) {
let adminStatus=req.session.logIn


  const total= await adminHelpers.getTotal()
  
    const deliveredOrderCount=await adminHelpers.orderCount()
   const productsCount= await adminHelpers.productCount()
   const usersCount=await adminHelpers.userCount()
   const rpCount=await adminHelpers.razorpayOrders()
   let codCount=await adminHelpers.codOrders()
  
   const codObject = {
    codCount: codCount,
    
  };
  
  
   const proOrders=await adminHelpers.processOrders()
   const shippedOrders=await adminHelpers.shippedOrders()
   const cancelOrders=await adminHelpers.cancelOrders()
   const deliverOrders=await adminHelpers.deliverOrders()
   const ordertype=[];
   ordertype.push(proOrders)
   ordertype.push(cancelOrders)
   ordertype.push(deliverOrders)
   ordertype.push(shippedOrders)
  



  return res.render("admin/dashboard", {adminStatus,total,deliveredOrderCount,productsCount,usersCount,rpCount,codCount,proOrders,shippedOrders,cancelOrders,deliverOrders,codObject,ordertype,rpCount,codCount});
}


// GET Request for Users List

function getUsers(req, res) {
  const pageNum=req.query.page;
  const perPage=5
  const currentPage=pageNum
  const documentCount=adminHelpers.documentCount()
  const totalPages=Math.ceil(parseInt(documentCount) / perPage);
  
  adminHelpers.listUsers(pageNum,perPage).then((userData) => {
   

    return res.render("admin/userslist", { adminStatus,userData });
  });
}

function blockUser(req, res) {
  
  let userId = req.params.id;
  adminHelpers.userBlock(userId).then(() => {
    return res.redirect("/admin/users");
  });
}

function unBlockUser(req, res) {
  let userId = req.params.id;
  adminHelpers.userUnBlock(userId).then(() => {
    return res.redirect("/admin/users");
  });
}

function getCategories(req, res) {
  adminHelpers.listCategory(req, res).then((resultArray) => {
    const categories = resultArray[0];
    
  const parentData = resultArray[1];

    return res.render("admin/categories", {adminStatus, categories,parentData });
  });
}

function postCategory(req, res) {
  let data = req.body;
  adminHelpers.createCategory(data).then(() => {
    return res.redirect("/admin/categories");
  });
}

function getOneCategory(req, res) {
  let idToEdit = req.params.id;
  adminHelpers.editCategory(idToEdit).then((forEditCategory) => {
    return res.render("admin/editcategory", {adminStatus, forEditCategory });
  });
}

function postEditCategory(req, res) {
  adminHelpers.editCategoryPost(req, res).then(() => {
    return res.redirect("/admin/categories");
  });
}

function categoryDelete(req, res) {
  idToDelete = req.params.id;
  adminHelpers.deleteCategory(idToDelete).then(() => {
    return res.redirect("/admin/categories");
  });
}

//  parent 
function getcats(req,res){
  adminHelpers.listCat(req, res).then((parentData) => {
   

    return res.render("admin/parentcat", {adminStatus,parentData});
  });

}
function postcats(req,res){
  
 
  data=req.body
 const catValue=data['category']

 adminHelpers.catPost(catValue).then(() => {
  return res.redirect("/admin/parentcat");
});
 

}
function editCat(req,res){
  idToEdit = req.params.id;
  adminHelpers.catEdit(idToEdit).then((forEditCategory) => {
    return res.render("admin/editcat", { adminStatus,forEditCategory });
  });
  

}

function postEditCat(req,res){
  adminHelpers.editCatPost(req, res).then(() => {
    return res.redirect("/admin/parentcat");
  });

}

function deleteCat(req,res){
  idToDelete = req.params.id;
  adminHelpers.catDelete(idToDelete).then(() => {
    return res.redirect("/admin/parentcat");
  });

}

/**
 * Products CRUD Operations
 * 
 * 
 */

function addProduct(req,res){
adminHelpers.productAdd().then((parentData)=>{
 
  res.render("admin/addproduct",{adminStatus,parentData})

})
}
async function getProducts(req, res) {
  const pageNum=req.query.page;
  const perPage=5;
  const currentPage=pageNum
  const documentCount=await adminHelpers.proCount()
  
  const totalPages=Math.ceil(parseInt(documentCount) / perPage);
  

 await adminHelpers.listProducts(pageNum, perPage).then((productsData) => {
    console.log(productsData);

    res.render("admin/products", {adminStatus, productsData });
  });
}
function postProduct(req, res) {
  

  const product = {
    itemName: req.body.itemName,
    description: req.body.description,
    category: req.body.category,
    price: req.body.price,
    quantity: req.body.quantity,
    Images: req.files,
  };

  
  adminHelpers.createProduct(product).then(() => {
    return res.redirect("/admin/view-product");
  });
}

function getOneProduct(req, res) {
  let idToEdit = req.params.id;
  adminHelpers.editProduct(idToEdit).then((forEditProduct) => {
    return res.render("admin/editproduct", {adminStatus, forEditProduct });
  });
}

function postEditProduct(req, res) {
  adminHelpers.editProductPost(req, res).then(() => {
    return res.redirect("/admin/products");
  });
}



function getAddBanner(req, res) {
  res.render("admin/banner",{adminStatus});
}

 const postBanner = async (req, res) => {
 
  adminHelpers.addBanner(req.body, req.file.filename).then((response) => {
    
    res.redirect("/admin/banner");
  });
}

function listBanners(req,res){

  adminHelpers.listBanners().then((response)=>{
    res.render("admin/list-banner",{adminStatus,response,getDate})
  })
  

}

function editBanner(req,res){
  res.render("admin/editbanner",{adminStatus})


}
async function orderList(req,res){
  const pageNum=req.query.page||1;
  const perPage=10;
  const currentPage=pageNum
  const documentCount=await adminHelpers.ordersCount()
  
  const totalPages=Math.ceil(parseInt(documentCount) / perPage);

 
 
  await adminHelpers.listOrder(pageNum,perPage).then((orderData)=>{

    req.session.orderData = orderData;

    

    res.render('admin/orderlist',{adminStatus,orderData,convertOrderId})

})

}

function updateStatus(req,res){

  let orderId = req.params.id;
  

   let status = req.body.status
    
  

   adminHelpers.statusChange(orderId,status).then((response)=>{

      

       res.redirect('/admin/orderlist')

   })
   

   

   

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

function orderDetails(req,res){
  let orderId=req.params.id
  
  adminHelpers.orderDetails(orderId).then((data)=>{
   
    const userData=data.user
    const orderData=data.order
    const addressData=data.address
    




    res.render("admin/order-details",{adminStatus,getDate,orderData,convertOrderId,userData,addressData})
  })
  

}



async function getSalesReport(req,res){

await adminHelpers.viewReport().then(async (response)=>{

 
  
 let total= await adminHelpers.getTotal()


 

  res.render("admin/sales-report",{adminStatus,getDate,response,total})

})
}


 function postSalesReport(req,res){

  const start=req.body.startdate
  const end=req.body.enddate;


 
  adminHelpers.postReport(start,end).then(async(response)=>{
    let total=await adminHelpers.getFullTotal(start,end)
    
    res.render("admin/sales-report",{adminStatus,getDate,response,total})
    

  })

}

function addCoupon(req,res){
  res.render("admin/add-coupon",{adminStatus})

}

function postAddCoupon(req,res){
  data = {
    couponName: req.body.couponName,
    expiry: req.body.expiry,
    minPurchase: req.body.minPurchase,
    description: req.body.description,
    discountPercentage: req.body.discountPercentage,
    maxDiscountValue: req.body.maxDiscountValue,
  };
  
  
  adminHelpers.postAddCoupon(data).then((response)=>{
    res.redirect('/admin/coupon')

  })

}

function generateCoupon(req,res){
  adminHelpers.generateCoupon().then((response) => {
    res.json(response);
  });

}

function newCoupons(req,res){
  adminHelpers.getCoupons().then((coupon)=>{

   res.render("admin/coupon",{adminStatus,getDate,coupon})
 })

}

function deleteCoupon(req,res){
  
 const couponId=req.params.id
 
  adminHelpers.deleteCoupon(couponId).then((response) => {
    res.json(response)
    
  })
}
function productDelete(req, res) {
  idToDelete = req.params.id;
  adminHelpers.deleteProduct(idToDelete).then((response) => {
    res.json(response)
  });
}



module.exports = {
  layout,
  authenticate,
  getlogin,
  postlogin,
  getlogout,
  getDashboard,
  getUsers,
  blockUser,
  unBlockUser,
  getCategories,
  postCategory,
  getOneCategory,
  postEditCategory,
  categoryDelete,
  getProducts,
  postProduct,
  getOneProduct,
  postEditProduct,
  productDelete,
  getAddBanner,
  postBanner,
  listBanners,
  editBanner,
  orderList,
  updateStatus,
  convertOrderId,
  orderDetails,
  getDate,
  convertOrderId,
  getSalesReport,
  postSalesReport,
  getcats,
  postcats,
  editCat,
  postEditCat,
  deleteCat,
  addCoupon,
  postAddCoupon,
  generateCoupon,
  newCoupons,
  deleteCoupon,
  addProduct
};
