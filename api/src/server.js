if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const pool = require("./db/db");
const bodyParser = require("body-parser");

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});

const getFavoritesByUser = require("./routes/favorites/getByUser");
const storeOrDestroyFavorite = require("./routes/favorites/storeOrDestroy");
const getLikesByUser = require("./routes/likes/getByUser");
const storeOrDestroyLike = require("./routes/likes/storeOrDestroy");

app.use("/likes", getLikesByUser);
app.use("/likes", storeOrDestroyLike);
app.use("/favorite", getFavoritesByUser);
app.use("/favorite", storeOrDestroyFavorite);
