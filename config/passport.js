const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const { pool } = require("./db");

module.exports = function (passport) {
  passport.use(
    new LocalStrategy((username, password, done) => {
      pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username],
        (err, user) => {
          if (err) {
            return done(err);
          }
          // no errors with select
          if (user.rows.length > 0) {
            // username found compare password
            let userDetails = user.rows[0];
            bcrypt.compare(password, user.rows[0].password, (err, res) => {
              // user password matches
              if (res) {
                return done(null, user.rows[0], {
                  message: "Logged in successfully!",
                });
              } else {
                return done(null, false, { message: "Wrong password" });
              }
            });
          } else {
            return done(null, false, {
              message: "Username doesn't exist. Sign up now!",
            });
          }
        }
      );
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.username);
  });

  passport.deserializeUser((username, cb) => {
    pool.query(
      "SELECT username FROM users WHERE username = $1",
      [username],
      (err, results) => {
        if (err) {
          console.log(err.message);
          return cb(err);
        }

        cb(null, results.rows[0]);
      }
    );
  });
};
