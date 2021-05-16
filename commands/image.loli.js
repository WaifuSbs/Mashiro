const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "loli",
	aliases: ["lolis"],
    type: "Image",
    argument: cmd_info.loli.argument,      
    description: cmd_info.loli.description,       
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
	// This function will be deprecated soon
	loli();
	function loli() {
		const fs = require("fs");
		fs.readFile('./files/loli.txt', function(err, data) {
			var content = data.toString().split("\n");
			var url = content[Math.floor(Math.random() * content.length)];
			const embed = new Discord.MessageEmbed()
			.setColor(config.main_color)
			.setImage(`${url}`)
			.setDescription(`Awww. Lolicon :grin:`);
			message.channel.send(embed);
		})
	}
}
