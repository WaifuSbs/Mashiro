const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "neko",
	aliases: ["nekos","catgirl"],
    type: "Image",
    argument: cmd_info.neko.argument,      
    description: cmd_info.neko.description,       
}

const Discord = require("discord.js");
const Neko = require("nekos.life");
const neko = new Neko();
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    var body = await neko.sfw.neko();
    const embed = new Discord.MessageEmbed()
	.setColor(config.main_color)
	.setImage(`${body.url}`)
	.setDescription(`~Nekos~ Cute~ :heart_eyes:`);
	message.channel.send(embed);
}
