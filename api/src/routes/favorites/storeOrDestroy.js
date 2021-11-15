const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  let { projectId } = req.body;
  let userId = 1;
  // let values = [projectId, userId];

  if (await check(projectId, userId)) {
    try {
      const favoriteProject = await pool.query(
        "INSERT INTO favorites(project_id, user_id) VALUES($1, $2) RETURNING *",
        [projectId, userId]
      );
      res.send("Favorite added"); // res.sendCustomStatus(200, "Favorite added");
    } catch (err) {
      console.error(err.message);
      res.send("Error : " + err); // res.sendCustomStatus(500);
    }
  }

  async function check(projectId, userId) {
    try {
      const alreadyFavoriteProject = await pool.query(
        `SELECT * FROM favorites where user_id = $1  and project_id = $2 `,
        [userId, projectId]
      );

      // return allVotedProjects.rows ? true : false;

      if (alreadyFavoriteProject.rowCount) {
        try {
          console.log(alreadyFavoriteProject.rows);
          let favoriteId = alreadyFavoriteProject.rows[0].id;
          await pool.query("DELETE FROM favorites WHERE id = $1", [favoriteId]);
        } catch (err) {
          res.send("Error : " + err); // res.sendCustomStatus(500);
          return false;
        }
        res.send("Favorite Deleted"); //  res.sendCustomStatus(200, "Favorite deleted");
        return false;
      } else {
        return true;
      }
    } catch (err) {
      console.log(err);
      res.send("Error : " + err); // res.sendCustomStatus(500);
      return false;
    }
  }
});

module.exports = router;
