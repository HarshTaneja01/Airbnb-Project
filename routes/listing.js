const express = require("express");
const router = express.Router();
let asyncwrap= require("../utils/asyncwrap.js")
let {listingSchema} = require("../listingschema.js")
let expresserror = require("../utils/expresserror.js")
let listing = require("../models/schema.js");

let validatelisting = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body);
    if(error){
        throw new expresserror(400,error);
    }
    else{
        next();
    }
};

router.get("/",async(req,res)=>{
    const data = await listing.find()
    res.render("listing.ejs",{data})
    
})
 
router.get("/new",(req,res)=>{
    res.render("newlisting.ejs")
})

router.post("/", validatelisting ,asyncwrap(async(req,res)=>{

    let{title , description,image,price,location,country} = req.body;
    await listing.insertOne({
    title:title,
    description:description,
    image:image,
    price:price,
    location:location,
    country:country,
   }) ;
   req.flash("success","New Listing Created!!");
   res.redirect("/listings")
}));

router.get("/:id", async(req,res)=>{
    let {id} = req.params;
    const individualdata = await listing.findById(id).populate("review");
    res.render("showlisting.ejs",{data : individualdata})
})

router.get("/:id/edit", async(req,res)=>{
    let {id} = req.params;
    const updatedata = await listing.findById(id)
    res.render("updatelisting.ejs",{data : updatedata})

})

router.patch ("/:id", validatelisting ,asyncwrap(async(req,res)=>{
    let {id} = req.params;
    let{title , description,image,price,location,country} = req.body;
    await listing.findByIdAndUpdate(id, { title, description, image, price, location, country });
    req.flash("success","Listing Edited Successfully!!");
    res.redirect(`/listings/${id}`)
}))

router.get("/:id/delete", async(req,res)=>{
    let {id} = req.params;
    const deletedata = await listing.findById(id);
    res.render("deletelisting.ejs",{data : deletedata});

})

router.delete("/:id",async(req,res)=>{
    let {id} = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted Successfully!!");
    res.redirect("/listings")
}) 

module.exports = router;