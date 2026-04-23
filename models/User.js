// models/User.js
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  passwordHash: String,
  subscribedTopics: [{ type: mongoose.Schema.Types.ObjectId, ref: "Topic" }],
});

module.exports = mongoose.model("User", userSchema);
