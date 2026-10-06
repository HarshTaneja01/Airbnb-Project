const express = require("express");
const app = express();
var ejsmate = require("ejs-mate");

var methodOverride = require("method-override");
app.use(methodOverride('_method'));

const mongoose = require("mongoose");
let expresserror = require("./utils/expresserror.js")
const cookieparser = require("cookie-parser")
const session = require("express-session")
const flash = require("connect-flash")
const passport = require("passport")
const localStrategy = require("passport-local");
const User = require("./models/user.js")

app.use(cookieparser());
app.use(express.urlencoded({extended :true}));
app.engine('ejs', ejsmate);
const path = require("path");
const { error } = require("console");
app.set("view engine","ejs");
app.set("views", path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "public")));

const listingRouter = require("./routes/listing.js")
const reviewRouter = require("./routes/review.js")
const userRouter = require("./routes/user.js")

main()
.then(()=>{
    console.log("connection successful")
})
.catch(()=>{
    console.log("connection denied");
})

const sessionoption = {
    secret:"mysupersecretstring",
    resave:false,
    saveUninitialized:true,
    cookie:{
    expires: Date.now()+1000*60*60*24*7,
    maxAge: 1000*60*60*24*7,
    httpOnly: true,
    }
};

app.use(session(sessionoption));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    next();
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.use("/listings" , listingRouter);
app.use("/listings/:id/review",reviewRouter);
app.use("/" , userRouter);

app.use((req,res,next)=>{
    next(new expresserror(404, "Page Not Found!"));
})

app.use((err,req,res,next)=>{
    let {statusCode = 500,message = "something went wrong"}=err;
    res.render("error.ejs", {err})
})

app.listen(3000,(req,res)=>{
    console.log("app is listening to port 3000");
})