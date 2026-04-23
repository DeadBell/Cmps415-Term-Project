// observers/TopicNotifier.js
class TopicNotifier {
  constructor() {
    this.observers = [];
  }
  attach(observer) {
    this.observers.push(observer);
  }
  notify(eventType, payload) {
    this.observers.forEach((o) => o.update(eventType, payload));
  }
}
module.exports = new TopicNotifier();
