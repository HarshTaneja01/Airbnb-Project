const express = require("express");
const router = express.Router();
const User = require("../models/user.js")
let asyncwrap = require("../utils/asyncwrap.js")
const passport = require("passport");
const { saveredirectUrl } = require("../middleware.js");
const usercontroller = require("../controllers/users.js")

router.route("/signup")
    .get(usercontroller.rendersignupform)
    .post(asyncwrap(usercontroller.signup));

router.route("/login")
    .get(usercontroller.renderloginform)
    .post(saveredirectUrl,
        passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }),
        usercontroller.login)

router.get("/logout", usercontroller.logout)

module.exports = router;