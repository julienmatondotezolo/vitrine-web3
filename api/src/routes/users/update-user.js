const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const bcrypt = require("bcrypt");
const status = require("../status/status");

router.put("/", async (req, res) => {
  try {
    const {
      email,
      password,
      password2,
      username,
      avatar,
      academic_year,
      banner,
      description,
    } = req.body;
    if (checkCredentials(username, email, password, password2)) {
      encryptPasswordAndEditUserInDb(
        username,
        email,
        password,
        avatar,
        academic_year,
        banner,
        description
      );
    } else {
      res.sendCustomStatus(400);
    }

    function encryptPasswordAndEditUserInDb(
      username,
      email,
      password,
      avatar,
      academic_year,
      banner,
      description
    ) {
      bcrypt.genSalt(10, (err, salt) =>
        bcrypt.hash(password, salt, (err, hash) => {
          if (err) throw err;
          //save pass to hash
          password = hash;
          editUserInDb(
            username,
            email,
            password,
            avatar,
            academic_year,
            banner,
            description
          );
        })
      );
    }

    async function editUserInDb(
      username,
      email,
      password,
      avatar,
      academic_year,
      banner,
      description
    ) {
      console.log("USER ID FROM REQ:", req.user)
      let user_id = req.user.userid
      let edit_date = new Date().toISOString().slice(0, 19).replace("T", " ");

      const updateUser = await pool.query(
        "UPDATE users SET email = $1, password = $2, username = $3, avatar = $4, edit_date = $5,academic_year= $6, banner = $7,description = $8 WHERE userid = $9",
        [
          email,
          password,
          username,
          avatar,
          edit_date,
          academic_year,
          banner,
          description,
          user_id
        ]
      );
      res.sendCustomStatus(200, `Hi ${username} your account has been updated!`);
    }

    function checkCredentials(username, email, password, password2) {
      let errors = [];
      // console.log(
      //   " username:" + username + " email :" + email + " pass:" + password
      // );
      if (!username || !email || !password || !password2) {
        errors.push({ msg: "Please fill in all fields" });
      }

      //check if match
      if (password !== password2) {
        errors.push({ msg: "passwords dont match" });
      }

      //check if password is more than 6 characters
      if (password.length < 6) {
        errors.push({ msg: "password atleast 6 characters" });
      }
      if (errors.length > 0) {
        //here code if not pass
        console.log("errors, not passed!");
        console.log(errors);
        return false;
      }
      return true;
    }
  } catch (err) {
    res.sendCustomStatus(400, err);
  }
});

module.exports = router;
