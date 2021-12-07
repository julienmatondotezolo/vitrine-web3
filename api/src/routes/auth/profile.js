
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    console.log(req.session)
    res.send(req.session.passport.user);
    return;
  }else{
    res.sendCustomStatus(400);

  }
});


  module.exports = router;
