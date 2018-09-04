const botconfig = require("./botconfig.json");
const tokenfile = require("./token.json");
const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/Monika", {
  useNewUrlParser: true
});
const Money = require("./models/money.js")
bot.commands = new Discord.Collection();
let xp = require("./xp.json");
let purple = botconfig.purple;
let cooldown = new Set();
let cdseconds = 5;


fs.readdir("./commands/", (err, files) => {

  if (err) console.log(err);
  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    console.log("Couldn't find commands.");
    return;
  }

  jsfile.forEach((f, i) => {
    let props = require(`./commands/${f}`);
    console.log(`${f} loaded!`);
    bot.commands.set(props.help.name, props);
  });
});

bot.on("ready", async () => {

  console.log(`${bot.user.username} is online on ${bot.guilds.size} servers!`);
  bot.user.setActivity("Your Reality", {
    type: "WATCHING"
  });
});


bot.on("message", async message => {

  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  let prefixes = JSON.parse(fs.readFileSync("./prefixes.json", "utf8"));
  if (!prefixes[message.guild.id]) {
    prefixes[message.guild.id] = {
      prefixes: botconfig.prefix
    };
  }

  let xpAdd = Math.floor(Math.random() * 7) + 8;
  console.log(xpAdd);

  if (!xp[message.author.id]) {
    xp[message.author.id] = {
      xp: 0,
      level: 1
    };
  }


  let curxp = xp[message.author.id].xp;
  let curlvl = xp[message.author.id].level;
  let nxtLvl = xp[message.author.id].level * 300;
  xp[message.author.id].xp = curxp + xpAdd;
  if (nxtLvl <= xp[message.author.id].xp) {
    xp[message.author.id].level = curlvl + 1;
  }
  fs.writeFile("./xp.json", JSON.stringify(xp), (err) => {
    if (err) console.log(err)
  });
  let prefix = prefixes[message.guild.id].prefixes;
  if (cooldown.has(message.author.id)) {
    message.delete();
    return message.reply("You have to wait " + cdseconds + " seconds between commands.")
  }
  if (!message.member.hasPermission("ADMINISTRATOR")) {
    cooldown.add(message.author.id);
  }


  let messageArray = message.content.split(" ");
  let cmd = messageArray[0];
  let args = messageArray.slice(1);

  if (message.content.startsWith(prefix)) {
    let commandfile = bot.commands.get(cmd.slice(prefix.length));
    if (commandfile) commandfile.run(bot, message, args);
  } else {
    let coinstoadd = Math.ceil(Math.random() * 10) + 1;
    console.log(coinstoadd + " coins");
    Money.findOne({
      userID: message.author.id,
      serverID: message.guild.id
    }, (err, money) => {
      if (err) console.log(err);
      if (!money) {
        const newMoney = new Money({
          userID: message.author.id,
          serverID: message.guild.id,
          money: coinstoadd
        })
        newMoney.save().catch(err => console.log(err));
      } else {
        money.money = money.money + coinstoadd;
        money.save().catch(err => console.log(err));
      }
    });

  }


  setTimeout(() => {
    cooldown.delete(message.author.id)
  }, cdseconds * 1000)

});

bot.login(tokenfile.token);