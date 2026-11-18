let listing = require("../models/schema.js");
const mongoose = require("mongoose");

const mbxgeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingclient = mbxgeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
    const data = await listing.find()
    res.render("listing.ejs", { data })
}

module.exports.rendernewform = (req, res) => {
    res.render("newlisting.ejs")
}

module.exports.createlisting = async (req, res) => {

    let response = await geocodingclient.forwardGeocode({
        query: req.body.listing.location,
        limit: 1
    })
    .send()

    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = { url, filename }
    newListing.geometry = response.body.features[0].geometry;
    let savedlisting = await newListing.save();
    console.log(savedlisting)
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
    const listings = await listing.findById(id)
    originalimageurl = listings.image.url
    originalimageurl = iginalimageurl.replace("/upload", "/upload/h_300/w_250")
    res.render("updatelisting.ejs", { data: listings })

}

module.exports.editlisting = async (req, res) => {
    let { id } = req.params;
    const { image, ...fields } = req.body.listing;   // ignore any stray "image" text

    const curlisting = await listing.findById(id);
    curlisting.set(fields);

    if (req.file) {
        curlisting.image = { url: req.file.path, filename: req.file.filename };
    }

    await curlisting.save();
    req.flash("success", "Listing Edited Successfully!!");
    res.redirect(`/listings/${id}`);
};

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

