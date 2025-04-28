const mongoose=require("mongoose");
const Review = require("./review");

let listingSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    image:[{
        url:{
            type:String,
            required:true,
        },
        fileName:String
    }],
    price:{
        type:Number,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    country:{
        type:String,
        required:true
    },
    category:[
        {
            type:String,
            enum:[
                "Mountains",
                "Amazing Views",
                "Castles",
                "Amazing pools",
                "Beach",
                "Homes",
                "Domes",
                "New",
                "Boats",
                "Surfing",
                "Camper vans"
            ],
            required:true,
        }
    ],
    reviews:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"review"
    }],
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    }
},{
    timestamps: true
  });

listingSchema.post("findOneAndDelete",async (listing)=>{
    await Review.deleteMany({_id : {$in : listing.reviews}});
});

const listing =mongoose.model("listing",listingSchema);

module.exports=listing;