const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  let user_id = 1;
  const allFavorites = await pool.query(
    `SELECT * FROM favorites where user_id = $1`[user_id]
  );
  res.send(allFavorites.rows);
});

module.exports = router;
