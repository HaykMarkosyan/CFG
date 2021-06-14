const express = require("express");
const nodemailer = require("nodemailer");
const Users = require("../models/Users.model");

const router = express.Router();

router.get("/", function (req, res) {
  res.render("forgetpassword");
});

router.post("/", function (req, res) {
  const email = req.body.email;

  Users.findOne({ email: email }, function (err, foundUser) {
    if (foundUser) {
      const fvcode = Math.floor(Math.random() * (9999 - 1000) + 1000);
      req.session.fvcode = fvcode;

      var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: "cfg.codeforgame@gmail.com",
          pass: "Code!For?Game1!",
        },
      });

      var mailOptions = {
        from: "cfg.codeforgame@gmail.com",
        to: email,
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
      req.session.loggedin = true;
      req.session.usesrname = foundUser.username;
      req.session.imgname = foundUser.imgname;
      res.redirect("/verify");
    } else {
      res.send("<center><br><h1>User not found ((</h1></center>");
    }
  });
});

router.get("/:email", function (req, res) {});

module.exports = router;
