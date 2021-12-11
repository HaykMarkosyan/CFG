require('dotenv').config();
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const path = require("path");
const ejs = require("ejs");
const mongoose = require("mongoose");
const multer = require("multer");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");
const LocalStrategy = require("passport-local").Strategy;
const nodemailer = require("nodemailer");

// -- Models -- //
const Posts = require("./models/Posts.model")
const Users = require("./models/Users.model")
const Games = require("./models/Games.model")

// -- Routes -- //
const registerRoutes = require("./routes/registerRoutes")
const loginRoutes = require("./routes/loginRoutes")
const gamesRoutes = require("./routes/gamesRoutes")
const postsRoutes = require("./routes/postsRoutes")
const foregetRoutes = require("./routes/forgetpasswordRoutes")

const app = express();

const storage = multer.diskStorage({
  destination: "./public/uploads/",
  filename: function (req, file, cb) {
    cb(null, "Profile-" + req.session.username + ".png");
    //file.fieldname + '-' + Date.now() + path.extname(file.originalname)
  },
});

// Init Upload
const upload = multer({
  storage: storage,
  limits: { fileSize: 1000000 },
}).single("myImage");

//Check File Type

//-------

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(
    bodyParser.urlencoded({
    extended: false,
  })
);

app.use(
  session({
    secret: "My little secret.",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect(
  "mongodb+srv://admin-hayk:<password>@cluster0.d8y9j.mongodb.net/cfgDB",
  function () {
    console.log("mongoDB is connected )).");
  }
);

let posts = [];

let games = [];




// -- register -- //
app.use("/register", registerRoutes)

// -- login -- //
app.use("/login", loginRoutes)

// -- games -- //
app.use("/games", gamesRoutes)

// -- posts -- //
app.use("/posts", postsRoutes)





//-----GET-----//

app.get("/", function (req, res) {
  if (req.session.loggedin) {
    res.redirect("/home");
  } else {
    // console.log(res.status)
    res.redirect("/login");
  }
});

app.get("/home", function (req, res) {
  // if (req.session.loggedin) {
  //   Users.findOne(
  //     { username: req.session.username },
  //     function (err, founduser) {
  //       if (!err) {
  //         if (founduser) {
  //           Games.find({limit:3}, function(err, foundgames) {
  //             if(!err) {
  //               if(foundgames) {
  //                 res.render("home", {
  //                   username: req.session.username,
  //                   color: "#3FB654",
  //                   imgname: founduser.imgname,
  //                   games: foundgames,
  //                 });
  //               } else {
  //                 res.render("home", {
  //                   username: req.session.username,
  //                   color: "#3FB654",
  //                   imgname: founduser.imgname,
  //                   games: null,
  //                 })
  //               }
  //             } else {
  //               res.redirect("/")
  //             }
  //           })
  //         } else {
  //           res.redirect("/")
  //         }
  //       } else {
  //         res.redirect("/")
  //         console.log(err);
  //       }
  //     }
  //   );
  // } else {
  //   res.render("home", {
  //     username: req.session.username,
  //     color: "#3FB654",
  //     games: null,
  //   });
  // }



  Games.find({}, function(err, foundGames) {
    if(!err) {
            res.render("home", {
              username: req.session.username,
              imgname: req.session.imgname,
              games: foundGames,
              color: "#3FB654",
            })
    } else {
      res.redirect("/")
    }
  })
  .limit(3)
});


app.get("/edit", function (req, res) {
  if (req.session.loggedin) {
    Users.findOne(
      { username: req.session.username },
      function (err, foundItem) {
        if (foundItem) {
          res.render("edit", {
            username: foundItem.username,
            bio: foundItem.bio,
            imgname: foundItem.imgname,
            gender: foundItem.gender,
            color: "#9A5EF4"
          });
        } else {
          res.send("<h1>w</h1><br><h1>W</h1>");
        }
      }
    );
  } else {
    res.redirect("/")
  }
});


app.get("/about", function (req, res) {
  res.render("about", { username: req.session.username, imgname: req.session.imgname, color: "#4E90CD" });
});


app.get("/logout", function(req, res) {
  req.session.loggedin = false
  if(req.session.loggedin == false){
    req.session.username = ""
    req.session.imgname = ""
  }
  res.redirect("/")
})

app.get("/myposts", function(req, res) {
  Posts.find({postusername: req.session.username}, function(err, foundposts) {
    res.render("myposts", {username: req.session.username, imgname: req.session.imgname, color: "#F6931F", posts: foundposts})
  })
})


app.get("/:username", function (req, res) {
const requestedUsername = req.params.username;

if(req.session.loggedin){
        Users.findOne({ username: requestedUsername }, function (err, foundUser) {
          if (!err) {
            if (foundUser) {
              if (req.session.username == requestedUsername) {
                res.render("profile", {
                  username: req.session.username,
                  Pusername: foundUser.username,
                  Pimgname: foundUser.imgname,
                  bio: foundUser.bio,
                  imgname: req.session.imgname,
                  gender: foundUser.gender,
                  edit: true,
                  color: "#F71F4D"
                });
              } else {
                res.render("profile", {
                  username: req.session.username,
                  Pusername: foundUser.username,
                  Pimgname: foundUser.imgname,
                  bio: foundUser.bio,
                  imgname: req.session.imgname,
                  gender: foundUser.gender,
                  edit: false,
                  color: "#F71F4D"
                });
              }
            } else {
              res.render("nouserf", {
                username: req.session.username,
                imgname: req.session.imgname,
                color: "#fff",
              });
            }
          } else {
            res.redirect("/");
          }
        });
} else {
  res.redirect("/")
}

  
});



//-----POST-----//



app.post("/addimg", function (req, res) {
  if (req.session.loggedin) {
    upload(req, res, function (err) {
      if (err) {
        res.redirect("/");
        console.log(err);
      } else {
        console.log(req.file, req.file.filename);
        res.redirect(`/${req.session.username}`);
        Users.updateOne(
          { username: req.session.username },
          { imgname: req.file.filename },
          function (err, imgname) {
            if (!err) {
              if (imgname) {
                console.log(imgname);
              } else {
                console.log("Gna DB-t stugi");
              }
            } else {
              console.log(`vay qu ara \n \n ${err}`);
            }
          }
        );
      }
    });
  } else {
    res.redirect("/")
  }
});

app.post("/rename", function (req, res) {
  if(req.session.loggedin){
    Users.findOne({username: req.body.username}, function(err, foundUser) {
      if(!err) {
        if(!foundUser || foundUser.username != req.session.username) {
          Posts.find({postusername: req.session.username}, function(err, foundPosts) {
            if(foundPosts){
              for(let i = 0; i<foundPosts.length; i++) {
                Posts.findOneAndUpdate({postusername: foundPosts[i].postusername}, {postusername: req.body.username})
              }
              Users.findOneAndUpdate({username: req.session.username}, {username: req.body.username, bio:req.body.bio}, function() {req.session.username = req.body.username; res.redirect("/")})
            } else {

            }
          })
          
        } else {
          res.send(`<center><h1 class="display-1">Username already taken</h1><br><a href="/edit">Go back</a></center>`)
        }
      } else {
        res.redirect("/edit")
      }
    })
  } else {
    res.redirect("/")
  }
});

// app.use(function (req, res) {
//   if(res.status() == 404){
//     res.render("errors/error404")
//   } else if(res.status() == 500){
//     res.render("errors/error404")
//   } else if(res.status() == 400){
//     res.render("errors/error404")
//   } else if(res.status() == 401) {
//     res.render("errors/error404")
//   } else if(res.status() == undefined){
//     res.redirect("/")
//   } else {
//     res.render("errors/error404")
//   }
//   // res.status()
// })

let port = process.env.PORT;
if (port == null || port == "") {
    port = 3000;
}

app.listen(port, function () {
    console.log("Server has started successfully.");
});

module.exports = app
