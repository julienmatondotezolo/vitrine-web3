const express = require("express");
const router = express.Router();
const pool = require("../../db/db");

const cloudinary = require('cloudinary').v2
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  });

router.post("/upload", async (req, res) => {
    const image = req.body
    console.log(image)

    // var cloudinary = require('cloudinary')
    // cloudinary.uploader.upload("my_picture.jpg",
    //     function (result) {
    //         console.log(result)
    //     })

    res.send("Ok")
})

module.exports = router;