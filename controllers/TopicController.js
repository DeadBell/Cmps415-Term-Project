const User = require("../models/User");
const Topic = require("../models/Topic");
const Message = require("../models/Message");
const topicNotifier = require("../observers/TopicStatsObserver");

module.exports = {
  async dashboard(req, res) {
    try {
      const user = await User.findById(req.session.userId).populate("subscribedTopics");

      if (!user) {
        return res.redirect("/login");
      }

      const topics = user.subscribedTopics;
      const topicMessages = {};

      for (const topic of topics) {
        topicNotifier.update("TOPIC_VIEWED", { topicId: topic._id });

        const messages = await Message.find({ topic: topic._id })
          .sort({ createdAt: -1 })
          .limit(2);

        topicMessages[topic._id] = messages;
      }

      res.render("dashboard", { user, topics, topicMessages });
    } catch (err) {
      console.log(err);
      res.redirect("/login");
    }
  },

  async listAll(req, res) {
    try {
      const topics = await Topic.find({});
      res.render("topics", { topics });
    } catch (err) {
      console.log(err);
      res.redirect("/dashboard");
    }
  },

  async create(req, res) {
    try {
      const userId = req.session.userId;

      const topic = await Topic.create({
        title: req.body.title,
        createdBy: userId,
        accessCount: 0
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { subscribedTopics: topic._id }
      });

      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/dashboard");
    }
  },

  async subscribe(req, res) {
    try {
      await User.findByIdAndUpdate(req.session.userId, {
        $addToSet: { subscribedTopics: req.params.id }
      });

      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/topics");
    }
  },

  async unsubscribe(req, res) {
    try {
      await User.findByIdAndUpdate(req.session.userId, {
        $pull: { subscribedTopics: req.params.id }
      });

      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/dashboard");
    }
  },

  async topicStats(req, res) {
    try {
      const topics = await Topic.find({}, "title accessCount").sort({
        accessCount: -1
      });

      res.render("stats", { topics });
    } catch (err) {
      console.log(err);
      res.redirect("/dashboard");
    }
  }
};
