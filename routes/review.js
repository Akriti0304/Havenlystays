const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const {isloggedIn} = require("../utils/middleware.js");
const {isAuthorizeForReview} = require("../utils/middleware.js");
const ReviewControllers  = require("../controllers/review.js");

//add review to a listing
router.post("/",isloggedIn,wrapAsync(
    ReviewControllers.createReview
));

// delete a review from a listing
router.delete("/:reviewId",isloggedIn,isAuthorizeForReview,wrapAsync(
    ReviewControllers.destroyReview
))

module.exports = router;