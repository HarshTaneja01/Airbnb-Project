let listing = require("../models/schema.js");
const mongoose = require("mongoose");

module.exports.index = async (req, res) => {
    const data = await listing.find()
    res.render("listing.ejs", { data })
}

module.exports.rendernewform = (req, res) => {
    res.render("newlisting.ejs")
}

module.exports.createlisting = async (req, res) => {
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!!");
    res.redirect("/listings")
}

module.exports.showlisting = async (req, res) => {
    let { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    const individualdata = await listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner");
    if (!individualdata) {
        req.flash("error", "Listing does not exist");
        return res.redirect("/listings");
    }
    else {
        res.render("showlisting.ejs", { data: individualdata })
    }
}

module.exports.rendereditform = async (req, res) => {
    let { id } = req.params;
    const updatedata = await listing.findById(id)
    res.render("updatelisting.ejs", { data: updatedata })

}

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndUpdate(id, { ...req.body.listing });
    req.flash("success", "Listing Edited Successfully!!");
    res.redirect(`/listings/${id}`);
}

module.exports.renderdeleteform = async (req, res) => {
    let { id } = req.params;
    const deletedata = await listing.findById(id);
    res.render("deletelisting.ejs", { data: deletedata });

}

module.exports.deletelisting = async (req, res) => {
    let { id } = req.params;
    await listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted Successfully!!");
    res.redirect("/listings")
}

