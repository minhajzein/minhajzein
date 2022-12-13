const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-cnt')
const userCheck = require('../middlewares/session')
const cart = require('../controllers/cart-cnt')

//=======================================================================================================

router.get('/',controller.home)

router.get('/go-to-shop',controller.goToShop)

router.get('/productDetails',controller.productDetails)

router.get('/cartPage',userCheck.sessionUser,cart.goToCart)
router.get('/addToCart',cart.addToCart)

router.route('/login')
    .get(controller.loginPage)
    .post(controller.postLogin)

router.route('/register')
    .get(controller.signup)
    .post(controller.doSignup)

router.get('/get-otp',controller.otpPage)
    
router.post('/verify-otp',controller.otpVerification)

router.get('/logout',controller.logout)

router.get('/not-found',controller.errorPage)


//====================================================================================================================

module.exports = router ;