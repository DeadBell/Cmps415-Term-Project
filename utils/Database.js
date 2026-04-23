// utils/Database.js
const mongoose = require("mongoose");

class Database {
  constructor() {
    if (Database.instance) return Database.instance;
    Database.instance = this;
  }

  async connect(uri) {
    if (this.connection) return this.connection;
    this.connection = await mongoose.connect(uri);
    return this.connection;
  }
}

module.exports = new Database();
