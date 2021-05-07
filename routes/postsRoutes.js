const express = require("express");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;

// -- Models -- //
const Posts = require("../models/Posts.model");
const Users = require("../models/Users.model");

const router = express.Router();

router.get("/", function (req, res) {
  Posts.find({}, function (err, foundPosts) {
    if (!err) {
              // const fullpost = {
              //   title: foundPosts.title,
              //   constent: foundPosts.content,
              //   postusername: foundPosts.postusername,
              //   postimgname: foundPosts.postimgname,
              // };

              res.render("posts", {
                username: req.session.username,
                imgname: req.session.imgname,
                color: "#F6931F",
                posts: foundPosts,
              });
    } else {
      res.redirect("/");
      console.log(err);
    }
  });
});

router.get("/create", function (req, res) {
  if(req.session.loggedin){
    res.render("compose", { username:req.session.username, imgname: req.session.imgname, color: "#D26D7D" });
  } else {
    res.redirect("/")
  }
});

router.get("/:postId", function (req, res) {
  Posts.findOne({}, function (err, foundPost) {
    res.render("post", { post: foundPost, username: req.session.username, });
  });
});



router.post("/create", function (req, res) {
  if(req.session.loggedin){
    Posts.insertMany(
      {
        title: req.body.posttitle,
        content: req.body.postcontent,
        postcolor: req.body.postcolor,
        postusername: req.session.username,
        postimgname: req.session.imgname
      },
      function (err, insertedpost) {
        if (!err) {
          res.redirect("/posts")
        } else {
          res.redirect("posts/create")
          console.log(err)
        }
      }
    );
  } else {
    res.redirect("/")
  }
});
module.exports = router;
