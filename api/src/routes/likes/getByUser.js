const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  const user_id = 1;
  const allLikes = await pool.query(`SELECT * FROM likes where user_id = $1`, [
    user_id,
  ]);
  res.send(allLikes.rows);
});

module.exports = router;
