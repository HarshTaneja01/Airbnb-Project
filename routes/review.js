const express = require("express");
const router = express.Router({mergeParams: true});
let asyncwrap= require("../utils/asyncwrap.js")
let {reviewSchema} = require("../listingschema.js")
let expresserror = require("../utils/expresserror.js")
let listing = require("../models/schema.js");
let review = require("../models/review.js");

let validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expresserror(400,error);
    }
    else{
        next();
    }
};

router.post("/", validatereview ,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let listingdata = await listing.findById(id);
    let newreview = new review(req.body.review);
    listingdata.review.push(newreview); 

    await newreview.save();
    await listingdata.save();

    console.log("review saved");
    req.flash("success","New Review Created!!");
    res.redirect(`/listings/${id}`)
}))

router.delete("/:review_id", asyncwrap(async(req,res)=>{
    let {id , review_id} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted Successfully !!");
    res.redirect(`/listings/${id}`);
}))

module.exports = router