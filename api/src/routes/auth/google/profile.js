
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
    res.send(req.session.passport.user);
 });


  module.exports = router;
