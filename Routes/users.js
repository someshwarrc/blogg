const router = require("express").Router();
const { pool } = require("../config/db");
const bcrypt = require("bcrypt");
const LocalStrategy = require("../config/passport");
const passport = require("passport");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

router.get("/register", forwardAuthenticated, (req, res) => {
  // render user registration form
  res.sendStatus(200);
});

router.post("/register", async (req, res) => {
  try {
    const { username, name, email, password } = req.body;

    bcrypt.genSalt(10, async (err, salt) => {
      bcrypt.hash(password, salt, async (err, encrypted) => {
        // Store hash in your password DB.
        try {
          const user = await pool.query(
            "INSERT INTO users (name, username, email, password) VALUES ($1, $2, $3,$4) RETURNING *",
            [name, username, email, encrypted]
          );
          res.json(user.rows[0]);
        } catch (error) {
          console.log(error.message);
          res.send("username already exists, please choose another");
        }
      });
    });
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

router.get("/login", forwardAuthenticated, (req, res) => {
  // render user login form
  res.sendStatus(200);
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res) => {
  req.logout();
  res.send("logged out");
});

router.get("/:username", ensureAuthenticated, async (req, res) => {
  const { username } = req.params;
  if (username === req.user.username) {
    const postsByUser = await pool.query(
      "SELECT * FROM posts WHERE creator=$1",
      [username]
    );
    res.json(postsByUser.rows);
  } else {
    res.sendStatus(403);
  }
});

module.exports = router;
