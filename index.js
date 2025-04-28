const express=require("express");
const app=express();
const mongoose=require("mongoose");
const path=require("path");
const methodOverride=require("method-override");
const ejsMate=require("ejs-mate");
const customError=require("./utils/customError.js");
const listingsRouter = require("./routes/listing.js");
const reviewsRouter =  require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user.js");
const cors = require("cors");
const filtersData = require("./filterData/filterData.js");
const flash = require('connect-flash');

const port=8080;

app.use(cors());

let dbUrl=process.env.Mongo_Atlas_URL;

const store = MongoStore.create({
    mongoUrl:dbUrl ,
    crypto: {
        secret : process.env.Secret_Code
    },
    touchAfter : 24 * 3600
  });

store.on("error",()=>console.log("Error in mongo store session : ",err));

app.use(session({
    store, 
    secret : process.env.Secret_Code,
    resave:false,
    saveUninitialized:true,
    cookie : {
        expires : Date.now()+7*24*60*60*1000,
        maxAge : 7*24*60*60*1000,
        httpOnly : true
    }
}));

app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname,"/public")));

app.engine("ejs",ejsMate);

app.set("view engine","ejs");
app.set("views", path.join(__dirname, "views"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser()); 
passport.deserializeUser(User.deserializeUser());

async function main(){
    mongoose.connect(dbUrl);
}

main().then((res)=>{
    console.log("Connection Successful");
}).catch((err)=>{
    console.log(err);
});

app.use(((req,res,next)=>{
    res.locals.currUser = req.user;
    res.locals.filtersData = filtersData;

    if(req.path=="/listings" || req.path=="/listings/"){
        res.locals.isListingPage = true;
    }
    else{res.locals.isListingPage = false}
    next();
}));

app.use(flash());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
})


app.use(userRouter);
app.use("/listings",listingsRouter);
app.use("/listings/:id/review",reviewsRouter);

app.get("/", (req, res) => {
    res.redirect("/listings");
});

app.all("*",(req,res)=>{
    throw new customError("Page not found",404);
});

app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    // res.status(statusCode).send(message);
    res.render("Listing/error.ejs",{err});
});

app.listen(port,()=>{
    console.log("Listening to port : "+port);
});