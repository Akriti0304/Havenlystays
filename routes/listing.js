const express=require("express");
const wrapAsync=require("../utils/wrapAsync.js");
const router = express.Router({mergeParams:true});
const {isloggedIn} = require("../utils/middleware.js");
const {isAuthorizeUser} = require("../utils/middleware.js");
const ListingControllers = require("../controllers/listing.js");
const multer = require("multer");
const {storage} = require("../cloudStorageConfig/storage.js");

const upload = multer({storage});

router.get("/create",isloggedIn,wrapAsync(
    ListingControllers.renderCreateForm
));

router.route("/")
.get(wrapAsync(
    ListingControllers.allListings
))
.post(isloggedIn,upload.array("image",5),wrapAsync(
    ListingControllers.createListing
));

router.post("/search",wrapAsync(
    ListingControllers.searchListing
));

router.post("/filter-search",wrapAsync(
    ListingControllers.searchByFilter
));

router.get("/:id/show",wrapAsync(
    ListingControllers.showListing
));

router.get("/:id/edit",isloggedIn,isAuthorizeUser,wrapAsync(
    ListingControllers.renderEditForm
));

router.route("/:id")
.patch(isloggedIn,isAuthorizeUser,upload.array("image",5),wrapAsync(
    ListingControllers.editListing
))
.delete(isloggedIn,isAuthorizeUser,wrapAsync(
    ListingControllers.destroyListing
));

module.exports = router;