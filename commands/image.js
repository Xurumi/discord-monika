const Discord = require("discord.js");
const errors = require("../utils/errors.js");
const fs = require('fs');
const imgresponses = ['Here ya Go!',
  'Now this... this is Epic',
  'Well Well Well',
  'Heh, kept ya waiting huh',
  '0/10 this is trash',
  'in awe at the size of this lad. absolute unit',
  'delet this',
  'I got you homie!',
  'Another one',
  'Ah, I see you\'re a man of culture as well',
  '*slaps roof of car* this bad bit can fit so much hentai',
  'skidaddle skidoodle',
  'guys literally only want one thing and it\'s fucking disgusting'
]

module.exports.run = async (bot, message, args) => {
  if (!message.member.hasPermission("MANAGE_MESSAGES")) return errors.noPerms(message, "MANAGE_MESSAGES");
  if (args[0]) {
    let num = parseInt(args[0]); //Converts into <number> format.
    if (num == "NaN" || num > 20 || num < 2)
      //Checks if <number> meets requirements. b/w 2-10
      return message.channel.send(
        "Error. Number needs to be a **valid** number (2-20).\n`~image` for random image\n`~image <number>` for generating <number> images"
      ); //Error message

    //Generates <number> random memes
    while (num > 1) {
      await freshimage();
      num--;
    }
  };
  await freshimage(); //Generates only 1 random meme if user doesn't provide <number>
  await message.delete();
  async function freshimage() {
    const folder = 'H:/Hydrus/';
    const subs = fs.readdirSync(folder)
    let randomfolder = subs[Math.floor(Math.random() * subs.length)]
    const subfolder = folder + randomfolder + '/'
    const files = fs.readdirSync(subfolder)
    let randomfile = files[Math.floor(Math.random() * files.length)]
    var response = imgresponses[Math.floor(Math.random() * imgresponses.length)];;
    let embed = {
      "title": response,
      "color": Math.floor(Math.random() * 16777214) + 1, //random color between one and 16777214 (dec)
      "image": {
        "url": "attachment://" + randomfile
      },
      "footer": {
        "text": `That took ${Math.round(bot.ping)}ms to process`
      }
    };
    return message.channel.send({
      embed,
      files: [{
        attachment: subfolder + randomfile,
        name: randomfile
      }]
    });
  };
}

module.exports.help = {
  name: "image"
}