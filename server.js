const express = require("express");
const app = express();
const {connectMongoose, User} = require("./database.js");
const ejs = require("ejs");
const passport = require("passport");
const { initializingPassport, isAuthenticated } = require("./passportConfig.js");
const expressSession = require("express-session");

connectMongoose();

initializingPassport(passport);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({secret: "secret", resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.use(express.static("./public"));

app.get("/", (req, res) => {
    res.render("index");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/register", async (req, res) =>{
    const user = await User.findOne({username: req.body.username});
    if(user) return res.status(400).send("User already exists")
    const newUser = await User.create(req.body);
    res.status(201).send(newUser);
});

app.post("/login", passport.authenticate("local", {failureRedirect: "/login", successRedirect: "/profile"}));

app.get("/profile", isAuthenticated, (req, res) => {
    // res.send(req.user);
    res.render("profile", {userInfo: (req.user.name)});
});

app.get("/logout", (req, res) => {
    req.logOut((err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error logging out");
      } else {
        res.render("logout")
      }
    });
  });

app.listen(3000, () => {
    console.log("Listening on port http://localhost:3000")
});