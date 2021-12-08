const express = require("express");
const router = express.Router();
const pool = require("../../db/db");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
// const cloudinary = require('cloudinary')
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "projecten",
  },
});

const parser = multer({
  storage: storage,
});

router.post("/", parser.array("uploaded_file"), async (req, res) => {
  console.log(req.body)
  try {
    const file = req.files;

    let { name, description, url, cluster } = req.body;
    let newUserId = req.user ? req.user : 44

    let values = [name, description, url, file[0].path, cluster, newUserId];

    const newProject = await pool.query(
      "INSERT INTO projects(name, description, url, images, cluster_id, user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      values
    );
    
    // ADD MOCKUP IMAGES TO DATABSE
    let newProjectId = newProject.rows[0].projectid
    if(newProjectId) {
      addMockups(newProjectId, file)
    }

    console.log(`Project ${name} is succesfully uploaded !`)
    res.sendCustomStatus(200, `Project ${name} is succesfully uploaded !`);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500, "Impossible to upload images.");
  }
});

// FUNCTION TO SAVE MOCKUPS IN DATABASE
async function addMockups(projectId, images) {

  for (let i = 1; i < images.length; i++) {
    let values = [projectId, images[i].path];

    const newMockup = await pool.query(
      "INSERT INTO mockups(project_id, images) VALUES($1, $2) RETURNING *",
      values
    );

    if(newMockup) {
      console.log(`Mockup Image [${i}] is uploaded.`)
    } else {
      console.log(`Impossible to upload Mockup Image [${i}].`)
    }
  }

}

module.exports = router;
