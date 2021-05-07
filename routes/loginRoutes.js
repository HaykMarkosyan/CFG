const express = require("express");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;

// -- Models -- //
const Users = require("../models/Users.model");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("login");
});

router.post("/", function (req, res) {
  const newuser = new Users({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(newuser, function (err) {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, function () {
        req.session.loggedin = true;
        req.session.username = newuser.username;
        Users.findOne({username: req.session.username}, function(err, founduser){
            if(founduser) {
              req.session.imgname = founduser.imgname;
              res.redirect("/")
            }
        })
      });
    }
  });
});


module.exports = router;