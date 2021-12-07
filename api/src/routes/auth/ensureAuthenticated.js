module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    } else {
      console.log('Your are not logged in')
      res.sendCustomStatus(401);
    }
  },
};