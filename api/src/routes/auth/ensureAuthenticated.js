module.exports = {
  ensureAuthenticated: function (req, res, next) {
    console.log("AUTH USER: ")
    console.log(req.isAuthenticated());
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendCustomStatus(401, "Please log in");
  },
};
