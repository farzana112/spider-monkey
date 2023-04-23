const express = require('express');
const router = express.Router();
const userControllers = require('../controllers/userControllers');
// const {categoriesMiddleware}=require('../helpers/middlewares')
const categoryModel=require('../models/categorySchema')


//router.use(userControllers.authenticate)
// Landing page route GET Method
router.use(userControllers.fetchCategories);
router.get('/',userControllers.mainPage);

//Sigin and Signup Page GET Method

router.get('/signin',userControllers.getSigininSignup);


//contact page
router.get('/contact',userControllers.authenticate,userControllers.getContactPage)



router.post('/search',userControllers.authenticate,userControllers.postSearch)

router.post('/category',userControllers.authenticate,userControllers.postCategory)


router.get('/sort',userControllers.authenticate,userControllers.getSort)
router.post('/sort',userControllers.authenticate,userControllers.postSort)

// router.post('/subcat')

//Products page GET Method

router.get('/products', userControllers.authenticate,userControllers.forProducts);
router.get('/products/:id',userControllers.authenticate,userControllers.forOneProduct);

// Signup POST Method

router.post('/signup',userControllers.postSignup);

router.post('/signin',userControllers.postSigin);

// otp 

router.get('/otp',userControllers.sendAOTP)
router.post('/otp',userControllers.postVerifyOTP)
// router.post('\otp',userControllers.sendOTP)

//otp2
// router.get('/otp2',userControllers.OTPSend)

//shop
router.get('/shop',userControllers.authenticate,userControllers.shopProduct)
router.get('/shop/:category',userControllers.authenticate,userControllers.shopCategory)

router.get('/logout',userControllers.logout)

//cart operations
router.get('/cart',userControllers.authenticate,userControllers.showCart)

// new cart Operations
// router.get('/add_to_cart/:id',userControllers.authenticate, userControllers.getAddToCart)
router.get('/view_cart', userControllers.authenticate, userControllers.getViewCart)





//cart operations
router.post('/products/addtocart/:id',userControllers.authenticate,userControllers.addToCart)
router.get('/cart/removeitem/:id',userControllers.authenticate,userControllers.deleteCartItem)

router.get('/deletecart',userControllers.authenticate,userControllers.removeCart)

//user profile

router.get('/userprofile',userControllers.authenticate,userControllers.getUserProf)

router.post('/userprofile',userControllers.authenticate,userControllers.editProf)


router.post("/passwordchange",userControllers.authenticate,userControllers.updatePassword)

router.post("/edit_address",userControllers.authenticate,userControllers.addAddress)




router.get("/view_wishlist",userControllers.authenticate,userControllers.listWishlist)

router.post("/add_to_wishlist/:id",userControllers.authenticate,userControllers.addToWishlist)

router.get("/remove/:id",userControllers.authenticate,userControllers.deleteWishItem)



router.get('/address',userControllers.authenticate,userControllers.getAddressPage);

router.post('/address',userControllers.authenticate,userControllers.postaddress);

//coupon

router.get('validate_coupon',userControllers.authenticate,userControllers.validateCoupon)

//checkout
router.get('/checkout',userControllers.authenticate,userControllers.getCheckoutPage);

router.post('/checkout',userControllers.authenticate,userControllers.postCheckOut);

//coupon
router.post('/userCouponPost',userControllers.authenticate,userControllers.couponPost)
// order

router.get('/orderconfirm',userControllers.authenticate,userControllers.getorderPage);

 router.get('/order/details/:id',userControllers.authenticate,userControllers.orderItemDetails)

router.post('/order/details/cancel/:id',userControllers.authenticate,userControllers.orderCancel);

router.post('/order/details/return/:id',userControllers.authenticate,userControllers.orderReturn);















module.exports = router;
