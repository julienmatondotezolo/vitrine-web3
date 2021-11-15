const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/", async (req, res) => {
  try {
    const clustersSQL = await pool.query(`SELECT * FROM cluster`);

    res.status(200).json(clustersSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
