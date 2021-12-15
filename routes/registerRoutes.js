const express = require("express");
const nodemailer = require("nodemailer");
const Users = require("../models/Users.model");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("singup");
});

router.get("/:email", function (req, res) {
  const email = req.params.email;

  Users.findOne({ email: email }, function (err, foundEmail) {
    if (!err) {
      if (foundEmail) {
        res.send("You already registrated");
      } else {
        if(req.session.singupuser){
          res.render("vertify", { email: req.params.email, color: "#fff" });
        } else {
          res.redirect("/")
        }
      }
    } else {
      res.render("err", { color: "#fff" });
    }
  });
});

let password = ""

router.post("/", function (req, res) {
  Users.findOne({ email: req.body.email }, function (err, foundemail) {
    if (!err) {
      if (!foundemail) {
        Users.findOne({username: req.body.username}, function(err, foundUser) {
          if(foundUser){
            res.redirect("/register")
          } else {
            const singupuser = {
              email: req.body.email,
              username: req.body.username,
              bio: "",
              imgname: `Profile-${req.body.gender}-standart.png`,
              gender: req.body.gender,
            };
            
            password = req.body.password
    
            req.session.singupuser = singupuser;
    
            const vcode = Math.floor(Math.random() * (9999 - 1000) + 1000);
            req.session.vcode = vcode;
    
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "cfg.codeforgame@gmail.com",
                pass: "password",
              },
            });
    
            var mailOptions = {
              from: "cfg.codeforgame@gmail.com",
              to: singupuser.email,
              subject: "Verification code",
              html: `<h1>Hi, ${req.body.username}.</h1><br><p>Your verification code is <strong>${vcode}</strong>.</p>`,
            };
    
            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
                console.log("esa error@: ----------------> " + error);
              } else {
                console.log("Email sent: " + info.response);
              }
            });
            res.redirect(`/register/${req.body.email}`);
          }
        })
      } else {
        res.redirect("/register");
      }
    } else {
      res.redirect("/register");
    }
  });
});

router.post("/:email", function (req, res) {
  if (req.body.vcode == req.session.vcode) {
    console.log(req.session.singupuser);
    Users.register(
      {
        email: req.session.singupuser.email,
        username: req.session.singupuser.username,
        bio: req.session.singupuser.bio,
        imgname: req.session.singupuser.imgname,
        gender: req.session.singupuser.gender,
      },
      password,
      function (err, user) {
        if (err) {
          console.log(err);
          res.redirect("/register");
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    res.redirect("/register")
    req.session.singupuser = null
  }
});

module.exports = router;
