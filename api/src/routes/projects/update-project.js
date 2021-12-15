const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { images, url, description, cluster, name } = req.body;
    const userId = req.session.passport.user.userid;
    console.log("the user "+JSON.stringify(req.user));

    let edit_date = new Date().toISOString().slice(0, 19).replace("T", " ");

    const selectedProjectSQL = await pool.query(
      "SELECT * FROM projects where projectid = $1",
      [id]
    ); // Search the project that you want to update
  console.log('project user '+ JSON.stringify(selectedProjectSQL.rows[0]))
    // Check to see if the project that you want to update is yours (you can't update other people's projects)
    if (selectedProjectSQL.rows.length) {
      if (
        selectedProjectSQL.rows[0].user_id ==
        userId /*req.user.userid temporary set to userId*/
      ) {
        //  The project belongs to the logged user.

        const updateProduct = await pool.query(
          "UPDATE projects SET name= $1,description= $2,url= $3,images= $4,user_id = $5, cluster_id = $6, edit_date = $7 WHERE projectid = $8",
          [
            name,
            description,
            url,
            images,
            userId,
            cluster,
            edit_date,
            id,
          ]
        );

        res.sendCustomStatus(
          200,
          `The project "${selectedProjectSQL.rows[0].name}" with id ${id} is updated!!`
        );
      } else {

        res.sendCustomStatus(400,"The project does not exists or don't belongs to the logged user");
      }
    } else {
      res.sendCustomStatus(400, "Project doesn't exists.");
    }
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
