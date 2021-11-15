const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, images, url, description, cluster, projectName } = req.body;
    let edit_date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const selectedProjectSQL = await pool.query(
      "SELECT * FROM projects where projectid = $1",
      [id]
    ); // Search the project that you want to update

    // Check to see if the project that you want to update is yours (you can't update other people's projects)
    if (
      selectedProjectSQL.rows[0].user_id ==
      userId /*req.user.userid temporary set to userId*/
    ) {
      //  The project belongs to the logged user.

      const updateProduct = await pool.query(
        "UPDATE projects SET user_id = $1, edit_date = $2, images = $3, url = $4,description = $5, cluster_id = $6,  name = $7 WHERE projectid = $8",
        [userId, edit_date, images, url, description, cluster, projectName, id]
      );

      res.sendCustomStatus(
        200,
        `The project "${selectedProjectSQL.rows[0].name}" with id ${id} is updated!`
      );
    } else {
      //  The project does not exists or don't belongs to the logged user.
      res.sendCustomStatus(400);
    }
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
