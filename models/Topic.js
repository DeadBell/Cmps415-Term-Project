// models/Topic.js
const mongoose = require("mongoose");

const topicSchema = new mongoose.Schema({
  title: { type: String, unique: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  accessCount: { type: Number, default: 0 },
});

module.exports = mongoose.model("Topic", topicSchema);
