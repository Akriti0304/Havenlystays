const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    },
    phone:{
        type : Number,
        required : true,
        min : 1000000001,
        max : 9999999999
    }
},{
    timestamps: true
})

userSchema.plugin(passportLocalMongoose);

const user = new mongoose.model("User",userSchema);

module.exports = user;