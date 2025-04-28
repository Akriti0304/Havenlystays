const express = require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const passport = require("passport");
// const localStrategy = require("passport-local");
const { saveRedirectUrl } = require("../utils/middleware.js");
const UserControllers = require("../controllers/user.js");

router.route("/register")
.get(wrapAsync(
    UserControllers.renderSignUpForm
))
.post(wrapAsync(
    UserControllers.signUpUser
))

router.route("/login")
.get(wrapAsync(
    UserControllers.renderLoginForm
))
.post(saveRedirectUrl,passport.authenticate('local', {
     failureRedirect: '/login',
     failureFlash: true 
    }),wrapAsync(
        UserControllers.LoginUser
))

router.get("/logout",wrapAsync(
    UserControllers.LogoutUser
))

module.exports = router;