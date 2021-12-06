const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post('/', 
  passport.authenticate('local', { failureMessage: 'You have nog been logged in', failureFlash: true ,successFlash: 'You have succesfully logged in!',session:true}),
  function(req, res) {
    res.send(req.session)
  });

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.session)
    res.send(req.session)
    return;
  }

  res.sendCustomStatus(400);
});

router.get("/error", (req, res) => {
  res.sendCustomStatus(400);
});
module.exports = router;
