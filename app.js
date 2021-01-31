const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const flash = require("express-flash");
const posts = require("./Routes/posts");
const users = require("./Routes/users");
const { ensureAuthenticated } = require("./config/auth");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Passport Config
require("./config/passport")(passport);

//dotenv config
require("dotenv").config();

const PORT = process.env.PORT;

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.use("/users", users);
app.use("/posts", ensureAuthenticated, posts);

app.listen(PORT, () => {
  console.log(`server listening on port ${PORT}`);
});
