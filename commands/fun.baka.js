const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "baka",
	aliases: [],
    type: "Fun",
    argument: cmd_info.baka.argument,
    description: cmd_info.baka.description,
}

const Discord = require("discord.js");
const Neko = require("nekos.life");
const neko = new Neko();
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    const user = message.mentions.users.first();
    if (!args[0] || !user) return message.reply(`who do you want to say "baka" on? :upside_down:`)
    var body = await neko.sfw.baka();
    var reply;
    if (user.id == client.user.id) { reply = `${message.author} said I'm "baka"! You are! :angry:` } else { reply = `${message.author} said ${user} is "baka"! :upside_down:` }
    const embed = new Discord.MessageEmbed()
    .setColor(config.main_color)
    .setDescription(reply)
    .setImage(body.url);
    message.channel.send(embed);
}