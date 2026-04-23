// controllers/MessageController.js
const Message = require("../models/Message");

module.exports = {
  async postMessage(req, res) {
    await Message.create({
      topic: req.params.id,
      author: req.session.userId,
      content: req.body.content,
    });
    res.redirect("/dashboard");
  },
};
