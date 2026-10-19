const mongoose = require("mongoose");
let listing = require("./models/schema");
const initData= require("./data.js")

main()
.then(()=>{
    console.log("connection successful")
})
.catch(()=>{
    console.log("connection denied");
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

let initdb = async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj , owner:"6ad2227034e58279f6bf3f50"}));
    await listing.insertMany(initData.data);
    console.log("Data was initialized");
}

initdb();

