const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminControllers');
const middlewares = require('../helpers/middlewares');
const middleware=require("../helpers/middleware")
const uploads=require('../multer/multer')
// const multer=require('../multer/multer')

// landing page route GET Method => Signin Page

router.get('/',adminController.getlogin);

// sigin route POST Method

router.post('/',adminController.postlogin);

// Logout route GET
router.use(adminController.authenticate)
router.get('/logout', adminController.authenticate, adminController.getlogout);


// Dashboard Route GET

router.get('/dashboard',adminController.layout,adminController.getDashboard);

// Users List Route GET

router.get('/users',adminController.authenticate,adminController.getUsers);

router.get('/user/block/:id',adminController.authenticate,adminController.blockUser);

router.get('/user/unblock/:id',adminController.authenticate,adminController.unBlockUser);

// Category Operations

router.get('/categories',adminController.authenticate,adminController.getCategories);

router.post('/categories',adminController.authenticate,adminController.postCategory);

router.get('/categories/edit/:id',adminController.authenticate,adminController.getOneCategory);

router.post('/categories/edit/:id',adminController.authenticate,adminController.postEditCategory);

router.get('/categories/delete/:id',adminController.authenticate,adminController.categoryDelete);

//parent categories
router.get('/parentcat',adminController.authenticate,adminController.getcats)


router.post('/parentcat',adminController.authenticate,adminController.postcats)


router.get('/editcat/:id',adminController.authenticate,adminController.editCat)


router.post('/editcat/:id',adminController.authenticate,adminController.postEditCat)


router.get('/delete_category/:id',adminController.authenticate,adminController.deleteCat)




router.get('/addproduct',adminController.authenticate, adminController.layout,adminController.addProduct)

  router.post('/addproduct',adminController.authenticate, adminController.layout, middlewares.uploads.array('images'), adminController.postProduct);

 router.get('/view-product',adminController.authenticate,adminController.layout,adminController.getProducts)


 //Products Operations
 //create
 router.get('/products',adminController.authenticate,adminController.getProducts)
 router.post('/products',adminController.authenticate,adminController.postProduct)
 

 //edit
 router.get('/products/edit/:id',adminController.authenticate,adminController.getOneProduct)
 router.post('/products/edit/:id',adminController.authenticate,middlewares.editeduploads.array('images'),adminController.postEditProduct)


 //delete
router.delete('/products_delete/:id',adminController.authenticate,adminController.productDelete)

//  Banner Addition
router.get('/add-banner',adminController.authenticate,adminController.getAddBanner)
router.post('/post-banner',uploads.addBannerupload,adminController.authenticate, adminController.postBanner);
router.get('/list-banner',adminController.authenticate,adminController.listBanners)
router.get('/edit-banner',adminController.authenticate,adminController.editBanner)

  
//   Coupons
router.get('/add_coupon',adminController.authenticate,adminController.addCoupon)
router.post('/add_coupon',adminController.authenticate,adminController.postAddCoupon)
router.get('/generate_coupon',adminController.authenticate,adminController.generateCoupon)
router.get('/coupon',adminController.authenticate,adminController.newCoupons)
router.delete("/coupon_delete/:id",adminController.authenticate,adminController.deleteCoupon)
 





  //orders
  router.get('/orderlist',adminController.authenticate,adminController.orderList)


router.post('/order/:id',adminController.authenticate,adminController.updateStatus);

 router.get('/order/details/:id',adminController.authenticate,adminController.orderDetails)

// sales report 
router.get('/sales-report',adminController.authenticate,adminController.getSalesReport)

router.post('/sales-report',adminController.authenticate,adminController.postSalesReport)


 
 

 

;

router.get('/products',adminController.authenticate)








module.exports = router;
