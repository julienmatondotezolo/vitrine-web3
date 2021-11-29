
const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get("/", (req, res) => {
    res.send(`Welcome ${JSON.stringify(req.session)}`);
  });


  module.exports = router;
