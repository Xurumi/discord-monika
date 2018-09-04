const mongoose = require("mongoose");

const xpSchema = mongoose.Schema({
  userID: String,
  serverID: String,
  xp: Number

})

module.exports = mongoose.model("XP", xpSchema);