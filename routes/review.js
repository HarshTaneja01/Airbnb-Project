const express = require("express");
const router = express.Router({mergeParams: true});
let asyncwrap= require("../utils/asyncwrap.js")
let listing = require("../models/schema.js");
let review = require("../models/review.js");
const {validatereview, isLoggedin , isreviewAuthor} = require("../middleware.js");
let reviewcontroller = require("../controllers/reviews.js")

//create review
router.post("/", validatereview , isLoggedin ,asyncwrap(reviewcontroller.createreview))

//delete review
router.delete("/:review_id", isLoggedin , isreviewAuthor, asyncwrap(reviewcontroller.deletereview))

module.exports = router