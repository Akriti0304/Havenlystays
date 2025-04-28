const User = require("../models/user.js");

module.exports.renderSignUpForm = async(req,res)=>{
    res.render("User/register.ejs");
}

module.exports.signUpUser = async(req,res)=>{
    const {username, email, password} = req.body;
    let userObj = new User({
        username,
        email
    });
    let newUser = await User.register(userObj,password);
    req.login(newUser,(err) => {
        if(err){
           return next(err);
        }
        req.flash("success",`Welcome To Havenlystays ${username}! You are successfully Signed up.`);
        return res.redirect("/listings");
    });
}

module.exports.renderLoginForm = async(req,res)=>{
    res.render("User/login.ejs");
}

module.exports.LoginUser = async(req,res)=>{
    let redirectUrl = res.locals.redirectUrl || "/listings";
    req.flash("success",`You are successfully logged in!`);
    res.redirect(redirectUrl || "/home");
}

module.exports.LogoutUser = async(req,res)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success",`You are successfully logged out!`);
        res.redirect("/listings");
    })
}