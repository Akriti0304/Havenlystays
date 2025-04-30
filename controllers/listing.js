// const { default: Fuse } = require("fuse.js");
const Listing = require("../models/listing");
const customError=require("../utils/customError.js");
const Fuse = require("fuse.js");
const filterData = require("../filterData/filterData.js");
const Message = require("../models/message.js");

module.exports.allListings = async (req,res)=>{
    const lists=await Listing.find({});

    res.render("Listing/lists.ejs",{lists});
}

module.exports.searchListing = async(req,res)=>{
    res.locals.isListingPage = true;

    const {title} = req.body;

    let data = await Listing.find({});

    const fuse = new Fuse(data,{
        keys:["title"],
        threshold: 0.3,
        includeScore: true
    })
    
    const results = fuse.search(title);


    if(results.length>0){
        let lists = results.map((result)=>result.item);
        return res.render("Listing/lists.ejs",{lists});
    }
    let lists = false;

    req.flash("error","No listing found by this name.");
    
    res.redirect("/listings");
}

module.exports.searchByFilter = async(req,res)=>{
    res.locals.isListingPage = true;

    const {category} = req.query;

    let data = await Listing.find({});

    const fuse = new Fuse(data,{
        keys:["category"],
        threshold: 0.3,
        includeScore: true
    })
    
    const results = fuse.search(category);


    if(results.length>0){
        let lists = results.map((result)=>result.item);
        return res.render("Listing/lists.ejs",{lists});
    }
    let lists = false;

    req.flash("error","No listing found for this category.");
    
    res.redirect("/listings");
}

module.exports.createListing = async (req,res)=>{

    let images = [];

    for(let i=0;i<=(req.files.length)-1;i++){
        // console.log(i);
        images.push(
            {
                url : req.files[i].path,
                fileName :req.files[i].filename
            }
        )
    }

    let {title,description,country,location} =req.body;

    let category = JSON.parse(req.body.category);

    let listing={title,description,country,location,category,price:parseInt(req.body.price),owner: res.locals.currUser._id,image:images};
    
    
    if(!listing){
        throw new customError("Send valid data for listing",404);
    }
    let List= await new Listing({...listing});
    List.save();

    req.flash("success","Successfully! New Listing Created");
    
    res.redirect("/listings");
}

module.exports.showListing = async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id).populate({
        path:"reviews",
        populate:{
            path: "owner",
            model: "User"
        }
    }).populate("owner");

    
    res.render("Listing/show.ejs",{list});
}

module.exports.renderEditForm = async (req,res)=>{
    let {id}=req.params;
    const list=await Listing.findById(id);

    let uploadedImagesUrls = [];

    for(let i=0;i<5;i++){
        uploadedImagesUrls.push((list.image[i].url).replace("/upload","/upload/h_100,w_100"))
    }

    res.render("Listing/edit.ejs",{list,uploadedImagesUrls});
}

module.exports.editListing = async (req,res)=>{
    let {id}=req.params;

    let list = await Listing.findById(id);

    if(!req.body){
        throw new customError("Send valid data to edit listing",404);
    }

    let {title,description,country,location} =req.body;

    let category = JSON.parse(req.body.category);

    const listingObj = {title,description,country,location,category};

    // let listing={title,description,country,location,category,price:parseInt(req.body.price),owner: res.locals.currUser._id,image};

    let listing={...listingObj,price:parseInt(req.body.price)};


    if(typeof req.files !== 'undefined'){
        
    let images = [];

    for(let i=0;i<=(req.files.length)-1;i++){
        // console.log("1st i ", i);
        images.push(
            {
                url : req.files[i].path,
                fileName :req.files[i].filename
            }
        )
    }

    if(req.files.length<5){
        for(let i=req.files.length; i<5; i++){
            // console.log("2nd i ", i);
            images.push(list.image[i]);
        }
    }

        listing={...listing,image:images};
    }

    await Listing.findByIdAndUpdate(id,{...listing});

    req.flash("success",`Listing successfully edited!`);
    res.redirect(`/listings/${id}/show`);
}

module.exports.destroyListing = async (req,res)=>{
    let {id}=req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success",`Listing deleted successfully!`);
    res.redirect("/listings");
}

module.exports.renderCreateForm = async (req,res)=>{
    res.render("Listing/create.ejs");
}

module.exports.renderContactForm = async (req,res)=>{
    //listing id
    let {id} = req.params;
    // console.log(id);
    res.render("Request/contactForm.ejs",{id});
}

module.exports.addRequest = async (req,res)=>{
    let {name, email, phone, guests, message, date} = req.body;
    //listing id
    let {id} = req.params;

    let listing = await Listing.findById(id);

    ownerId = listing.owner;

    if(!name || !email || !phone || !guests || !message || !date || !id || !ownerId){
        throw new customError("Data is missing",404);
    }

    let msg = await new Message({
        name,
        email,
        phone,
        guests,
        message,
        date,
        requestTo : ownerId
    });

    msg.save();

    req.flash("success",`Request added successfully!`);

    res.redirect(`/listings/${id}/show`);
}

module.exports.destroyRequest = async (req,res) =>{
    //message id
    let {id} = req.params;

    const msg = await Message.findByIdAndDelete(id);

    req.flash("success",`Request deleted successfully!`);

    res.redirect("/listings/inbox");
}

module.exports.renderMessages = async (req,res)=>{
    currUserID = res.locals.currUser._id;

    const messages = await Message.find({ requestTo: currUserID });

    res.render("Request/inbox.ejs",{messages});
}