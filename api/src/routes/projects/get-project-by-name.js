const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:name", async (req, res) => {
  try {
    const selectedFinalWork = req.params.name;
    console.log(selectedFinalWork);
    const selectedFinalWorkSQL = await pool.query(
      `SELECT * FROM projects where name = '${selectedFinalWork}'`
    );

    res.status(200).json(selectedFinalWorkSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
