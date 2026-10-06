const mongoose = require("mongoose");
const { stringify } = require("node:querystring");
const { Schema } = mongoose.Schema;
let Review = require("./review.js")

let listingSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    image: {
        type: String,
        trim: true
    },
    price: {
        type: Number,
        required: true,
        trim: true
    },
    location: {
        type: String,
        required: true,
        trim: true
    },
    country: {
        type: String,
        required: true,
        trim: true
    },
    review: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "review"
    }]
})

listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await Review.deleteMany({ _id: { $in: listing.review } })
    }
})

let listing = mongoose.model("listing", listingSchema)

module.exports = listing;
