// observers/TopicStatsObserver.js
const ITopicObserver = require("./ITopicObserver");
const Topic = require("../models/Topic");

class TopicStatsObserver extends ITopicObserver {
  async update(eventType, payload) {
    if (eventType === "TOPIC_VIEWED") {
      await Topic.findByIdAndUpdate(payload.topicId, {
        $inc: { accessCount: 1 },
      });
    }
  }
}
module.exports = new TopicStatsObserver();
