const express = require('express')
const router = express.Router()
const controller = require('../controllers/user-cnt')
const userCheck = require('../middleware/session')
const cart = require('../controllers/cart-cnt')

//=======================================================================================================

router.get('/',userCheck.sessionUser,controller.home)

router.get('/go-to-shop',controller.goToShop)

router.get('/productDetails',controller.productDetails)

router.get('/cartPage',cart.goToCart)
router.get('/addToCart',userCheck.sessionUser,cart.addToCart)

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