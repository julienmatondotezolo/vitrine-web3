if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const { ensureAuthenticated } = require("./routes/auth/ensureAuthenticated");

const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const pool = require("./db/db");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const status = require("./routes/status/status");

const uploadImage = require("./routes/projects/upload"); 
const getClusters = require("./routes/cluster/get-clusters");
const getProjects = require("./routes/projects/get-projects");
const getProjectByName = require("./routes/projects/get-project-by-name");
const getProjectById = require("./routes/projects/get-project-by-id");
const createProject = require("./routes/projects/create-project");
const deleteProject = require("./routes/projects/delete-project");
const updateProject = require("./routes/projects/update-project");
const getProjectsUser = require("./routes/projects/get-projects-user");

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Origin', 'https://vitrine-frontend-test.herokuapp.com/');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept');
  next();
});
app.options("*", cors({ origin: 'https://vitrine-frontend-test.herokuapp.com', optionsSuccessStatus: 200 }));

app.use(cors({
  origin: ['https://vitrine-frontend-test.herokuapp.com','https://vitrine-web3.herokuapp.com'],
  methods: "GET, HEAD, POST, PUT, DELETE, CONNECT, OPTIONS, TRACE, PATCH",
  preflightContinue: false,
  credentials: true
}));
app.use(express.json());
app.use(status);
app.use(flash());

app.use(cookieParser());

const oneDay = 1000 * 60 * 60 * 24;
app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    cookie: { maxAge: oneDay,    httpOnly: true,
      sameSite: 'none',},
    saveUninitialized: true,
    cookie: {domain: 'https://vitrine-frontend-test.herokuapp.com',secure:false}

  })
);
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.urlencoded({ extended: true })); 

require("./routes/auth/passport")(passport);

app.use("/upload", uploadImage);
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

app.get("/home", (req, res) => {
  res.redirect("https://vitrine-frontend-test.herokuapp.com");
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
const getUpdateUser = require('./routes/users/update-user')

app.use("/users/", getUsers);
app.use("/user", createUser);
app.use("/user/id", getUserByid);
app.use("/user/update", ensureAuthenticated,getUpdateUser);


const register = require('./routes/auth/register')
const login = require("./routes/auth/login");
const logout = require("./routes/auth/logout");
const profile = require("./routes/auth/profile");

app.use("/register", register);
app.use("/login", login);
app.use("/logout", logout);
app.use("/profile",ensureAuthenticated, profile);


const Googlelogin = require("./routes/auth/google/login");
const GoogleProfile = require("./routes/auth/google/profile");
const Googlelogout = require("./routes/auth/google/logout");
app.use("/google/login", Googlelogin);
app.use("/google/profile", ensureAuthenticated,GoogleProfile);
app.use("/google/logout", Googlelogout);