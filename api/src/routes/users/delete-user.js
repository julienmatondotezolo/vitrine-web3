const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const status = require("../status/status");

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const selectedUserSQL = await pool.query(
      "SELECT * FROM users where userid = $1",
      [id]
    ); // Search the project that you want to delete

    if (selectedUserSQL.rows[0].userid == id) {
      // TODO:  // Check for admin rights
      const deleteUser = await pool.query("DELETE FROM users WHERE userid = $1", [
        id,
      ]);

      res.sendCustomStatus(200);

    }
  } catch (err) {
    res.sendCustomStatus(400);
  }
});

module.exports = router;