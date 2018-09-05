const Discord = require("discord.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Monika", {
  useNewUrlParser: true
});
const XP = require("../models/xp.js");

module.exports.run = async (bot, message, args) => {
  await message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");


  XP.findOne({
    userID: message.author.id,
    username: message.author.username,
    serverID: message.guild.id
  }, (err, xp) => {
    if (err) console.log(err);
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setTitle("XP")
      .setColor("#4000FF")
      .setThumbnail(message.author.displayAvatarURL);
    if (!xp) {
      embed.addField("XP", "0", true)
        .addField("Level", "1", true);
      return message.channel.send(embed).then(msg => {
        msg.delete(5000)
      });
    } else {
      embed.addField("XP", xp.xp, true)
        .addField("Level", xp.level, true);
      return message.channel.send(embed).then(msg => {
        msg.delete(5000);
      });
    }
  })

}

module.exports.help = {
  name: "level"
}