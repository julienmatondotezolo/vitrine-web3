
const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:userid", async (req, res) => {
  try {
    const selectedUser = req.params;
    const selectedUserSQL = await pool.query(
      `SELECT * FROM users where userid = '${selectedUser.userid}'`
    );
    console.log(selectedUserSQL.rows)

      res.status(200).json(selectedUserSQL.rows);

  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;