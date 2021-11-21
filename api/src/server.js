if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const pool = require("./db/db");
const bodyParser = require("body-parser");
const status = require("./routes/status/status");
const getClusters = require("./routes/cluster/get-clusters");
const getProjects = require("./routes/projects/get-projects");
const getProjectByName = require("./routes/projects/get-project-by-name");
const getProjectById = require("./routes/projects/get-project-by-id");
const createProject = require("./routes/projects/create-project");
const deleteProject = require("./routes/projects/delete-project");
const updateProject = require("./routes/projects/update-project");
const getProjectsUser = require("./routes/projects/get-projects-user");

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
app.use(status);

app.use("/clusters", getClusters);
app.use("/projects", getProjects);
app.use("/project", createProject);
app.use("/project/name", getProjectByName);
app.use("/project/id", getProjectById);
app.use("/project", deleteProject);
app.use("/project", updateProject);
app.use("/project", updateProject);
app.use("/projects-user", getProjectsUser);

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

const getUsers = require('./routes/users/get-users')
const createUser = require('./routes/users/create-user')
const getUserByid = require('./routes/users/get-user-by-id')

app.use("/users/", getUsers);
app.use("/user", createUser);
app.use("/user/id", getUserByid);
