const mongoose = require("mongoose");

let messageSchema = new mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    email: {
        type:String,
        required:true
    },
    phone: {
        type:Number,
        required:true,
        min:1000000001,
        max:9999999999
    },
    guests: {
        type:Number,
        required:true,
        min:1
    },
    message: {
        type:String,
        required:true
    },
    date: {
        type:Date,
        required:true
    },
    requestTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});

const message = mongoose.model("message", messageSchema);

module.exports = message;