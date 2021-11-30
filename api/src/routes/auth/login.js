const express = require("express");
const router = express.Router();
const passport = require("passport");


router.post('/', 
  passport.authenticate('local', { failureMessage: 'You have nog been logged in', failureFlash: true ,successFlash: 'You have succesfully logged in!'}),
  function(req, res) {

    res.redirect('https://vitrine-app-ehb.herokuapp.com/')
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
      return res.send({session:req.session});
    });
  })(req, res, next);
});

module.exports = router;