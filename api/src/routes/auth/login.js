const express = require("express");
const router = express.Router();
const passport = require("passport");


router.post('/', 
  passport.authenticate('local', { failureMessage: '/login', failureFlash: true ,successFlash: 'You succesfully logged in!'}),
  function(req, res) {
    res.send(req.session)
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