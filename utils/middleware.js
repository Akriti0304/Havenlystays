const Listing = require("../models/listing");
const Review = require("../models/review");
const Message = require("../models/message");
// const customError = require("./customError");

module.exports.isloggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isAuthorizeUser = async (req, res, next) => {
    let id = req.params.id;
    let listing = await Listing.findById(id);
    res.locals.isAuthorizeUser = (listing.owner.equals(res.locals.currUser._id));
    if(res.locals.isAuthorizeUser){
        return next();
    }
    res.redirect("/listings");
}

module.exports.isAuthorizeForReview = async (req, res, next) => {
    let {id , reviewId} = req.params;
    let listing = await Listing.findById(id);
    let isAuthorizeUser = (listing.owner.equals(res.locals.currUser._id));

    let review = await Review.findById(reviewId);
    let isReviewOwner = review.owner.equals(res.locals.currUser._id);

    if(isAuthorizeUser || isReviewOwner){
        return next();
    }
    res.redirect("/listings");
}

module.exports.isAuthorizeForMessage = async (req, res, next) => {
    let id = req.params.id;
    let msg = await Message.findById(id);
    res.locals.isAuthorizeUser = (msg.requestTo.equals(res.locals.currUser._id));
    if(res.locals.isAuthorizeUser){
        return next();
    }
    res.redirect("/listings/inbox");
}