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
    failureRedirect: "/failed",
    session: true,
  }),
  function (req, res) {
    res.redirect("/google/profile");
  }
);
router.get("/failed", (req, res) => {
  res.send("Failed");
});

module.exports = router;
