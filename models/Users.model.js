const mongoose = require("mongoose")
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {type: String, required: true},
    username: {type: String, required: true},
    password: String,
    bio: String,
    imgname: String,
    gender: String,
});
  
userSchema.plugin(passportLocalMongoose);
  
const Users = mongoose.model("Users", userSchema);

passport.use(Users.createStrategy());

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Users.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = Users