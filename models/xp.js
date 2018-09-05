const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
  userID: String,
  username: String,
  serverID: String,
  xp: Number,
  level: Number

})

module.exports = mongoose.model("XP", xpSchema);