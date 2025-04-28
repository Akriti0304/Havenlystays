const Review=require("../models/review");
const Listing=require("../models/listing");

module.exports.createReview = async(req,res)=>{
    let {comment,rating} = req.body;
    let {id} = req.params;

    let saveReview = new Review({
        comment:comment,
        rating:rating,
        owner: req.user._id
    });

    let review =  await saveReview.save();

    let listing = await Listing.findByIdAndUpdate(id,
        {
            $push: { reviews:  review }
        },
        {new:true}
    );

    req.flash("success",`Review added successfully!`);

    res.redirect(`/listings/${id}/show`);
}

module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    let listing = await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});

    let review = await Review.findByIdAndDelete(reviewId);

    req.flash("success",`One review deleted successfully!`);
    res.redirect(`/listings/${id}/show`);
}