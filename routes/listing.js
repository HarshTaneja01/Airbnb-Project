const express = require("express");
const router = express.Router();
let asyncwrap = require("../utils/asyncwrap.js")
let listing = require("../models/schema.js");
const { isLoggedin , isOwner , validatelisting } = require("../middleware.js")
const mongoose = require("mongoose");

router.get("/", async (req, res) => {
    const data = await listing.find()
    res.render("listing.ejs", { data })

})

router.get("/new", isLoggedin, validatelisting, (req, res) => {
    res.render("newlisting.ejs")
})

router.post("/", validatelisting, asyncwrap(async (req, res) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings")
}));

router.get("/:id", async (req, res) => {
    let { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    const individualdata = await listing.findById(id).populate({path:"review", populate:{path:"author"}}).populate("owner");
    if (!individualdata) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    else {
        res.render("showlisting.ejs", { data: individualdata })
    }
})

router.get("/:id/edit", isLoggedin, isOwner , validatelisting, async (req, res) => {
    let { id } = req.params;
    const updatedata = await listing.findById(id)
    res.render("updatelisting.ejs", { data: updatedata })

})

router.patch("/:id", isLoggedin, isOwner ,validatelisting, asyncwrap(async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Edited Successfully!!");
    res.redirect(`/listings/${id}`);
}));

router.get("/:id/delete", isLoggedin, isOwner , validatelisting, async (req, res) => {
    let { id } = req.params;
    const deletedata = await listing.findById(id);
    res.render("deletelisting.ejs", { data: deletedata });

})

router.delete("/:id", isLoggedin, isOwner , async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!!");
    res.redirect("/listings")
})

module.exports = router;