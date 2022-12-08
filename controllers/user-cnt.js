const { render } = require("ejs");
const { default: mongoose } = require("mongoose");
const User = require("../models/userSchema");
const Product = require('../models/productSchema')
const bcrypt = require("bcrypt");
const checkOtp = require("../utils/otp-auth");
let userSignup;

module.exports = {
  errorPage: async (req, res) => {
    res.render("user/404");
  },
  home: async (req, res) => {
    try {
      if(req.session.loggedIn){
        const products = await Product.find()
        res.render("user/home", { userDetails: req.session.userDetails,products });
      }else{
        res.render('user/home',{userDetails:false})
      }
    } catch (err) {
      res.redirect("/not-found");
    }
  },
  goToShop : async (req,res) => {
    try{
      const products = await Product.find()
      if(products){
        res.render('user/shop',{products})
      }
    }catch (err){
      console.log(err);
      res.redirect('/not-found')
    }
  },
  loginPage : (req, res) => {
    try {
      if(req.session.loggedIn){
        res.redirect('/')
      }else{
        res.render("user/login", { err_msg: false, userDetails: false });
      }
    } catch {
      res.redirect("/not-found");
    }
  },
  postLogin: async (req, res) => {
    try {
      const body = req.body;
      const userDetails = await User.findOne({ Email: body.Email });
      if (userDetails) {
        const password = await bcrypt.compare(
          body.password,
          userDetails.password
        );
        if (password) {
          isBlock = userDetails.isBlock;
          if (!isBlock) {
            req.session.loggedIn = true;
            req.session.userDetails = userDetails;
            res.redirect("/");
          } else {
            res.render("user/login", {
              err_msg: "You have been temporarily blocked by admin",
            });
          }
        } else {
          ails;
          res.render("user/login", {
            err_msg: "Entered password is incorrect"
          });
        }
      } else {
        res.render("user/login", { err_msg: "Entered Email is incorrect" });
      }
    } catch {
      res.redirect("/not-found");
    }
  },
  signup: (req, res) => {
    try {
      res.render("user/register", { err_msg: false, userDetails: false });
    } catch (err) {
      res.redirect("/not-found");
    }
  },
  doSignup: async (req, res) => {
    try {
      const user = await User.find({ Email: req.body.Email });
      const userWithPhone = await User.findOne({ phone: req.body.phone });
      let err_msg = "";
      if (user[0]) {
        err_msg = "This email is already registered";
        res.render("user/register", { err_msg: err_msg });
      } else if (userWithPhone) {
        err_msg = "This mobile number is already registered";
        res.render("user/register", { err_msg: err_msg });
      } else if (req.body.password !== req.body.confirmPassword) {
        err_msg = "Password and confirm password must be same";
        res.render("user/register", { err_msg: err_msg });
      } else {
        const userDetails = req.body;
        const number = parseInt(userDetails.phone);
        checkOtp.sendOtp(number);
        userSignup = userDetails;
        res.render("user/otp-page");
      }
    } catch (err) {
      res.redirect("/not-fount");
    }
  },
  otpPage: (req, res) => {
    res.render("user/otp-page", { errorMsg: false });
  },
  otpVerification: async (req, res) => {
    let Otp = req.body;
    const OTP = Otp.otp;
    const userDetails = userSignup;
    const number = parseInt(userDetails.phone);
    let otpStatus = await checkOtp.verifyOtp(number, OTP);
    if (otpStatus.valid) {
      userDetails.password = await bcrypt.hash(userDetails.password, 10);
      const user = await User.create(userDetails);
      req.session.loggedIn = true;
      req.session.user = user._id;
      req.session.userDetails = userDetails
      res.redirect("/");
    } else {
      res.render("user/otp-page", { errorMsg: "Entered OTP is incorrect" });
    }
  },
  logout: (req, res) => {
    req.session.loggedIn = false;
    res.redirect("/");
  },
  usersList: async (req, res) => {
    try {
      const users = await User.find();
      res.render("admin/users-list", { users });
    } catch {
      res.redirect("/admin/not-available");
    }
  },
  blockUser: async (req, res) => {
    try {
      const id = req.query.id;
      await User.updateOne({ _id: id }, { isBlock: true });
      res.redirect("/admin/users-list");
    } catch {
      res.redirect("admin/not-available");
    }
  },
  unBlockUser: async (req, res) => {
    try {
      const id = req.query.id;
      await User.updateOne({ _id: id }, { isBlock: false });
      res.redirect("/admin/users-list");
    } catch {
      res.redirect("admin/not-available");
    }
  },
};
