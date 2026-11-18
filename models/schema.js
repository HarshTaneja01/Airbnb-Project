const mongoose = require("mongoose");
const { stringify } = require("node:querystring");
const { Schema } = mongoose.Schema;
let Review = require("./review.js");
const { string } = require("joi");

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
        url: String,
        filename: String
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
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates : {
            type : [Number],
            required : true
        },
    }
})
listingSchema.post("findOneAndDelete", async (listing) => {
        if (listing) {
            await Review.deleteMany({ _id: { $in: listing.review } })
        }
    })

let listing = mongoose.model("listing", listingSchema)

module.exports = listing;
