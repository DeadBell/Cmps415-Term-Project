// controllers/AuthController.js
const User = require("../models/User");
const bcrypt = require("bcrypt");

module.exports = {
  showLogin(req, res) {
    res.render("login");
  },

  showRegister(req, res) {
    res.render("register");
  },

  async register(req, res) {
    const hash = await bcrypt.hash(req.body.password, 10);
    await User.create({ username: req.body.username, passwordHash: hash });
    res.redirect("/login");
  },

  async login(req, res) {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return res.redirect("/login");
    const ok = await bcrypt.compare(req.body.password, user.passwordHash);
    if (!ok) return res.redirect("/login");
    req.session.userId = user._id;
    res.redirect("/dashboard");
  },

  requireLogin(req, res, next) {
    if (!req.session.userId) return res.redirect("/login");
    next();
  },
};
