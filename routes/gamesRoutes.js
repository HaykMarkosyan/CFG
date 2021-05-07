const express = require("express");
const Users = require("../models/Users.model");
const Games = require("../models/Games.model.js");

const router = express.Router();

router.get("/", function (req, res) {
  if (req.session.loggedin) {
    Games.find({}, function(err, foundGames) {
      if(!err) {
        console.log(foundGames)
              res.render("games", {
                username: req.session.username,
                imgname: req.session.imgname,
                games: foundGames,
                color: "#D677D6",
              })
      } else {
        res.redirect("/")
      }
    })
  } else {
    res.redirect("/");
  }
});

router.get("/:gameId", function (req, res) {
  if (req.session.loggedin) {
    const requestedgameId = req.params.gameId;
    Games.findOne({ _id: requestedgameId }, function (err, foundgame) {
          res.render("game", {
            username: req.session.username,
            color: "#3FAAD6",
            game: foundgame,
            imgname: req.session.imgname,
          });
    });
  } else {
    res.redirect("/")
  }
});


router.get("/WindowsOS/BallGame1.zip", (req, res) => {
  if(req.session.loggedin){

  } else {
    res.redirect("/")
  }
})

module.exports = router;