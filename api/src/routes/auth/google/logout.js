const express = require("express");
const router = express.Router();

router.get("/", function (req, res) {
  req.logout();
  res.send("you have succesfully logged out")
});
module.exports = router;