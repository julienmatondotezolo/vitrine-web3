const express = require("express");
const router = express.Router();
const passport = require("passport");

router.get(
  "/profile",
  passport.authenticate("google", { scope: ["email", "profile"] }),
  function (req, res) {
    console.log(req)
    // Successful authentication, redirect home.
   // res.redirect("/");
  }
);


router.get(
  "/callback",
  passport.authenticate("google", {
    failureMessage: "You have not been logged in",
    successMessage: "You have succesfully been logged in",
  }),
  function (req, res) {
    console.log(req)
    // Successful authentication, redirect home.
   // res.redirect("/");
  }
);
router.post('/', 
  passport.authenticate('google', { failureMessage: 'You have nog been logged in', failureFlash: true ,successFlash: 'You have succesfully logged in!'}),
  function(req, res) {
    if(req.user){
      res.send(req.session)

    }else{
       res.status(400).send('Authentication failed!');

    }
  });


router.get("/success", (req, res) => {
  if (req.user) {
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      //   cookies: req.cookies
    });
  }
});

router.get("/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

module.exports = router;