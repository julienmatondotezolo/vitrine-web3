const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", (req, res, next) => {
  console.log(req.user)
  passport.authenticate("local", {
    successRedirect: "/", //redirect to home page 
    failureRedirect: "/login/error",
    successFlash: 'Welcome!',
    session:true,
    failureFlash: true
  }),
  function(req,res) {
  };

});

router.get("/error", (req, res) => {
  res.sendCustomStatus(400);
});

router.get('/', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) { return res.send("your user does not exist"); }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      console.log(req.session)
      return res.send(req.user);
    });
  })(req, res, next);
});

module.exports = router;