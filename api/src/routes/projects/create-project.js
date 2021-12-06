const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  try {
  let { name, description, url, images, cluster } = req.body;
  let userId = req.session.passport.user.userid;

  console.log("user id:   =============" + userId);
  let values = [name, description, url, images, cluster, userId];


    const newProject = await pool.query(
      "INSERT INTO projects(name, description, url, images, user_id,cluster_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      values
    );
    res.sendCustomStatus(200);
  } catch (err) {
    console.error(err.message);
    res.send(req.user)
    //res.sendCustomStatus(500);
  }
});

module.exports = router;
