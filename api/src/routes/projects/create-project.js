const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

router.post("/", async (req, res) => {
  let { projectName, description, url, images, cluster } = req.body;
  let userId = req.session.passport.user.userid;
  const file = req.file;
  let values = [projectName, description, url, file.path, cluster, userId];

  // SAVE FILE PATH IN DB
  console.log(req.file.path);

  cloudinary.uploader.upload(file.path, {
    folder: "projecten",
    chunk_size: 6000000,
  });

  if (check(cluster)) {
    try {
      const newProject = await pool.query(
        "INSERT INTO projects(name, description, url, images, cluster_id, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        values
      );

      res.sendCustomStatus(200);
    } catch (err) {
      console.error(err.message);
      res.sendCustomStatus(500);
    }
  } else {
    res.sendCustomStatus(400);
  }

  function check(cluster) {
    let clusters = ["web", "mobile", "motion", "ar", "digital-making"];

    if (clusters.includes(cluster)) {
      return true;
    }
    return false;
  }
});

module.exports = router;
