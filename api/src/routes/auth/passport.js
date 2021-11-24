const LocalStrategy = require("passport-local").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const bcrypt = require("bcrypt");
const pool = require("../../db/db");

module.exports = async function (passport) {
  passport.use(
    new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
      let user = pool
        .query(`SELECT * FROM users where email = '${email}'`)
        .then((user) => {
          if (!user.rows[0]) {
            return done(null, false, {
              message: "Email is not registered",
            });
          }
          //match pass
          bcrypt.compare(password, user.rows[0].password, (err, isMatch) => {
            if (err) throw err;

            if (isMatch) {
              return done(null, user.rows[0]);
            } else {
              return done(null, false, { message: "pass incorrect" });
            }
          });
        });
    })
  );

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/google/login/callback",
        passReqToCallback: true,
      },

      async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        const newUser = {
          userid: profile.id,
          username: profile.displayName,
          //firstName: profile.name.givenName,
          //lastName: profile.name.familyName,
          avatar: profile.photos[0].value,
          password: "googleAccount",
        };

        try {
          let user = pool.query(
            `SELECT * FROM users where userid = '${profile.id}'`
          );
          if (user) {
            done(null, user);
          } else {
            const createUser = await pool.query(
              "INSERT INTO users(email, password, username) VALUES($1, $2, $3) RETURNING *",
              newUser
            );
            done(null, user);
          }
        } catch (err) {
          console.error(err);
        }
      }
    )
  );

  passport.serializeUser(function (user, done) {
    done(null, user);
  });

  passport.deserializeUser(function (user, done) {
    done(null, user);
  });
};
