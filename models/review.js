const mongoose = require("mongoose");

let reviewSchema = new mongoose.Schema({
    comment: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        max: 5,
        min: 0,
        default: 0,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
},{
    timestamps: true
  });

const review = mongoose.model("review", reviewSchema);

module.exports = review;