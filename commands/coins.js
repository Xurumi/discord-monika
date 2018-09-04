const Discord = require("discord.js");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Monika", {
  useNewUrlParser: true
});
const Money = require("../models/money.js");

module.exports.run = async (bot, message, args) => {
  await message.delete();
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");


  Money.findOne({
    userID: message.author.id,
    serverID: message.guild.id
  }, (err, money) => {
    if (err) console.log(err);
    let embed = new Discord.RichEmbed()
      .setAuthor(message.author.username)
      .setTitle("Coins")
      .setColor("#4000FF")
      .setThumbnail(message.author.displayAvatarURL);
    if (!money) {
      embed.addField("Coins", "0", true);
      return message.channel.send(embed).then(msg => {
        msg.delete(5000)
      });
    } else {
      embed.addField("Coins", money.money, true);
      return message.channel.send(embed).then(msg => {
        msg.delete(5000);
      });
    }
  })

}

module.exports.help = {
  name: "coins"
}