const mongoose=require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type : String,
        required : true,
        unique : true
    }
},{
    timestamps: true
})

userSchema.plugin(passportLocalMongoose);

const user = new mongoose.model("User",userSchema);

module.exports = user;