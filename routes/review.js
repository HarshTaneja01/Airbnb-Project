const express = require("express");
const router = express.Router({mergeParams: true});
let asyncwrap= require("../utils/asyncwrap.js")
let listing = require("../models/schema.js");
let review = require("../models/review.js");
const {validatereview, isLoggedin , isreviewAuthor} = require("../middleware.js")


router.post("/", validatereview , isLoggedin ,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let listingdata = await listing.findById(id);
    let newreview = new review(req.body.review);
    newreview.author = req.user._id;
    listingdata.review.push(newreview); 
    await newreview.save();
    await listingdata.save();

    console.log("review saved");
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${id}`)
}))

router.delete("/:review_id", isLoggedin , isreviewAuthor, asyncwrap(async(req,res)=>{
    let {id , review_id} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted Successfully !!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router