let Listing = require("./models/schema")
let Review = require("./models/review")
let { listingSchema , reviewSchema } = require("./listingschema.js")
let expresserror = require("./utils/expresserror.js")

module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        req.flash("error" , "You must be Logged in")
        return res.redirect("/login")
    }
    
    next();
    
}

module.exports.saveredirectUrl = (req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
    
}

module.exports.isOwner = async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id); 
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You dont have the permission to perform this operation")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.isreviewAuthor = async (req,res,next)=>{
    let {id , review_id} = req.params;
    let review = await Review.findById(review_id); 
    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error","You dont have the permission to perform this operation")
        return res.redirect(`/listings/${id}`)
    }
    next()
}

module.exports.validatelisting = (req, res, next) => {
    let { error } = listingSchema.validate(req.body);
    if (error) {
        throw new expresserror(400, error);
    }
    else {
        next();
    }
};


module.exports.validatereview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body);
    if(error){
        throw new expresserror(400,error);
    }
    else{
        next();
    }
};