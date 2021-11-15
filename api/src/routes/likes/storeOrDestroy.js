const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  let { projectId } = req.body;
  let userId = 1;
  // let values = [projectId, userId];

  if (await check(projectId, userId)) {
    try {
      const likeProject = await pool.query(
        "INSERT INTO likes(project_id, user_id) VALUES($1, $2) RETURNING *",
        [projectId, userId]
      );
      res.send("Like added"); // res.sendCustomStatus(200, "Like added");
    } catch (err) {
      console.error(err.message);
      res.send("Error : " + err); // res.sendCustomStatus(500);
    }
  }

  async function check(projectId, userId) {
    try {
      const alreadyLikeProject = await pool.query(
        `SELECT * FROM likes where user_id = $1  and project_id = $2 `,
        [userId, projectId]
      );

      // return allVotedProjects.rows ? true : false;

      if (alreadyLikeProject.rowCount) {
        try {
          console.log(alreadyLikeProject.rows);
          let likeId = alreadyLikeProject.rows[0].id;
          await pool.query("DELETE FROM likes WHERE id = $1", [likeId]);
        } catch (err) {
          res.send("Error : " + err); // res.sendCustomStatus(500);
          return false;
        }
        res.send("Like Deleted"); //  res.sendCustomStatus(200, "Like deleted");
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
