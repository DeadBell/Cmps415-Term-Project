const User = require("../models/User");
const Topic = require("../models/Topic");
const Message = require("../models/Message");
const topicNotifier = require("../observers/TopicStatsObserver");

module.exports = {
  async dashboard(req, res) {
    try {
      const user = await User.findById(req.session.userId).populate(
        "subscribedTopics"
      );

      if (!user) {
        return res.redirect("/login");
      }

      const topics = user.subscribedTopics;
      const topicMessages = {};

      for (const topic of topics) {
        // Observer pattern (T6 + T8)
        topicNotifier.update("TOPIC_VIEWED", { topicId: topic._id });

        // Last 2 messages (T2.1 requirement)
        const recentMessages = await Message.find({ topic: topic._id })
          .sort({ createdAt: -1 })
          .limit(2);

        // Full chat history (your enhancement)
        const allMessages = await Message.find({ topic: topic._id }).sort({
          createdAt: 1,
        }); // oldest → newest

        topicMessages[topic._id] = {
          recent: recentMessages,
          all: allMessages,
        };
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
        accessCount: 0,
      });

      await User.findByIdAndUpdate(userId, {
        $addToSet: { subscribedTopics: topic._id },
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
        $addToSet: { subscribedTopics: req.params.id },
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
        $pull: { subscribedTopics: req.params.id },
      });

      res.redirect("/dashboard");
    } catch (err) {
      console.log(err);
      res.redirect("/dashboard");
    }
  },

  async topicStats(req, res) {
  try {
    const topics = await Topic.find().lean();

    // Compute postCount + subscriberCount for each topic
    const enrichedTopics = await Promise.all(
      topics.map(async (topic) => {
        const postCount = await Message.countDocuments({ topic: topic._id });
        const subscriberCount = await User.countDocuments({
          subscribedTopics: topic._id
        });

        return {
          ...topic,
          postCount,
          subscriberCount
        };
      })
    );

    const totalTopics = topics.length;
    const totalPosts = await Message.countDocuments();
    const totalSubscriptions = await User.aggregate([
      { $project: { count: { $size: "$subscribedTopics" } } },
      { $group: { _id: null, total: { $sum: "$count" } } }
    ]);

    res.render("stats", {
      topics: enrichedTopics,
      totalTopics,
      totalPosts,
      totalSubscriptions: totalSubscriptions[0]?.total || 0
    });

  } catch (err) {
    console.error(err);
    res.redirect("/dashboard");
    }
  },
};
