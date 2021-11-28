const express = require("express");
const router = express.Router();
const passport = require("passport");
const { ensureAuthenticated } = require("./../ensureAuthenticated");

router.get(
  "/",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

router.get(
  "/callback",
  passport.authenticate("google", {
    failureRedirect: '/failed',

  }),
  function (req, res) {
    res.redirect('/google/login/success')

}
);
router.get("/failed", (req, res) => {
  res.send("Failed")
})
router.get("/success",ensureAuthenticated,(req, res) => {
  res.send(`Welcome ${JSON.stringify(req.session)}`)
})

module.exports = router;
