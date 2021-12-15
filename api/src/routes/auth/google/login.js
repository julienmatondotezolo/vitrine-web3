const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
  failureMessage: 'You have nog been logged in', failureFlash: true ,successFlash: 'You have succesfully logged in!',session:true}
  ),
  function (req, res) {
    res.send(req.session)
  }
);
module.exports = router;
