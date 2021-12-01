const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post('/', 
  passport.authenticate('local', { failureMessage: 'You have nog been logged in', failureFlash: true ,successFlash: 'You have succesfully logged in!'}),
  function(req, res) {
    console.log(JSON.stringify(req.session))
    res.send(req.sessionID)
  });

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.sessionID)
    return;
  }

  res.sendCustomStatus(400);
});

router.get("/error", (req, res) => {
  res.sendCustomStatus(400);
});
module.exports = router;
