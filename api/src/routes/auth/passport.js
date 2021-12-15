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
              console.log("passport HERE "+ JSON.stringify(user.rows[0]))
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
        clientID:
          "5863592506-2o7kg34d1dqssdbrqi8nkdq1tibajdcq.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "https://api.vitrine-finalshow.be/google/login/callback",
        passReqToCallback: true,
      },
      async (request, accessToken, refreshToken, profile, done) => {
        console.log("------- profile", profile);
        const newUser = {
          email: profile.emails[0].value,
          password: profile.id,
          username: profile.displayName,
          //firstName: profile.name.givenName,
          //lastName: profile.name.familyName,
          avatar: profile.photos[0].value,
        };

        const values = Object.values(newUser);
        try {
          console.log("the email " + profile.emails[0].value);
          let user = pool
            .query(
              `SELECT * FROM users where email = '${profile.emails[0].value}'`
            )
            .then(async (user) => {
              console.log("the user detail " + JSON.stringify(user));
              if (user.rows[0]) {
                done(null, user.rows[0]);
              } else {
                try {
                  const createUser = await pool.query(
                    "INSERT INTO users(email, password,username,avatar) VALUES($1, $2, $3,$4) RETURNING *",
                    values
                  );
                  done(null, values);
                } catch (err) {
                  console.log("the insert error" + err);
                }
              }
            });
        } catch (err) {
          console.error("the error " + err);
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
