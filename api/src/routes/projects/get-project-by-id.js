const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.get("/:id", async (req, res) => {
  try {
    const selectedProject = req.params;
    console.log(selectedProject);
    const selectedProjectSQL = await pool.query(
      `SELECT projects.name, projects.cluster_id, projects.description, projects.images, projects.url, projects.projectid, users.username, users.email FROM projects INNER JOIN users on projects.user_id = users.userid and projectid = '${selectedProject.id}'`
    );

    res.status(200).json(selectedProjectSQL.rows);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
