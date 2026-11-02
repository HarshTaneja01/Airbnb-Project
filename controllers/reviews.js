let listing = require("../models/schema.js");
let review = require("../models/review.js");

module.exports.createreview = async(req,res)=>{
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
}

module.exports.deletereview = async(req,res)=>{
    let {id , review_id} = req.params;
    await listing.findByIdAndUpdate(id,{$pull:{review:review_id}});
    await review.findByIdAndDelete(review_id);
    req.flash("success","Review Deleted Successfully !!");
    res.redirect(`/listings/${id}`);
}