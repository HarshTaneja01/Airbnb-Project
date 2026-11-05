const express = require("express");
const router = express.Router();
let asyncwrap = require("../utils/asyncwrap.js")
let listing = require("../models/schema.js");
const { isLoggedin, isOwner, validatelisting } = require("../middleware.js")
const mongoose = require("mongoose");
let listingcontroller = require("../controllers/listings.js")
const multer = require('multer')
const upload = multer({dest:'uploads/'})

router.route("/")
    //index route
    .get(asyncwrap(listingcontroller.index))

    //new.post route
    // .post(validatelisting, asyncwrap(listingcontroller.createlisting));
    .post(upload.single('listing[image]'),(req,res)=>{
        res.send(req.file);
    })

//new route
router.get("/new", isLoggedin, validatelisting, listingcontroller.rendernewform)

router.route("/:id")
    //show.get route
    .get(listingcontroller.showlisting)

    //edit.patch route
    .patch(isLoggedin, isOwner, validatelisting, asyncwrap(listingcontroller.editlisting))

    //delete.delete route
    .delete(isLoggedin, isOwner, listingcontroller.deletelisting);
    
//edit route
router.get("/:id/edit", isLoggedin, isOwner, validatelisting, listingcontroller.rendereditform)

//delete route
router.get("/:id/delete", isLoggedin, isOwner, validatelisting, listingcontroller.renderdeleteform)

module.exports = router;