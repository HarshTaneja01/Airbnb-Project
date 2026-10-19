const { number } = require("joi");
const mongoose = require("mongoose");
const {Schema}= mongoose.Schema;

const reviewSchema = new mongoose.Schema({
    comment : {
        type:String,
        required:true,
    },
    ratings:{
        type:Number,
        min :1,
        max :5
    },
    created_at:{
        type:Date,
        default:Date.now,
    },
    author:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

module.exports = mongoose.model("review" , reviewSchema);
