module.exports = {
  ensureAuthenticated: (req, res, next) => {
    // for all post routes, allow only if logged in
    if (req.isAuthenticated()) {
      return next();
    }
    res.sendStatus(401);
  },
  forwardAuthenticated: (req, res, next) => {
    // for the login and register routes, allow only if user is not logged in
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/posts");
  },
};
