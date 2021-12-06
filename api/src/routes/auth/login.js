const express = require("express");
const router = express.Router();
const passport = require("passport");

router.post("/", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login/error",
    failureFlash: true,
  })(req, res, next);
});
router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send(req.session)
    return;
  }

  res.sendCustomStatus(400);
});

router.get("/error", (req, res) => {
  res.sendCustomStatus(400);
});
module.exports = router;
