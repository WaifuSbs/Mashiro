const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "bb",
	aliases: ["bigboobs","bbgirl"],
    type: "Image",
    argument: cmd_info.bb.argument,      
    description: cmd_info.bb.description,       
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const request = require("request");

module.exports.run = async (client, message, args) => {
    request(`https://api.thelt.ml/v2/image/sfw/bb`, function(err, response, body) {
        if(err) return msg.reply("err");
        var body = JSON.parse(body);
        const embed = new Discord.MessageEmbed()
		.setColor(config.main_color)
		.setImage(`${body.url}`)
		.setDescription(`What a bbcon! :joy:`);
		message.channel.send(embed);
    });
}
