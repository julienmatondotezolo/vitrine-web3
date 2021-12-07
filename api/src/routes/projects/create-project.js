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

router.post("/", parser.single("uploaded_file"), async (req, res) => {
  try {
    let { name, description, url, images, cluster } = req.body;
    let NewuserId = req.user.userid;

    const file = req.file;
    // SAVE FILE PATH IN DB
    console.log(req.file);
    // SAVE FILE PATH IN DB
    console.log(req.file.path);

    cloudinary.uploader.upload(images, {
      folder: "projecten",
      chunk_size: 6000000,
    });

    let values = [name, description, url, req.file.path, cluster, NewuserId];
    console.log("HERE are the value of projects " + values);
    const newProject = await pool.query(
      "INSERT INTO projects(name, description, url, images, cluster_id,user_id) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      values
    );
    res.sendCustomStatus(200);
  } catch (err) {
    console.error(err.message);
    res.sendCustomStatus(500);
  }
});

module.exports = router;
