const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "ping",
	aliases: ["howlag","latency"],
    type: "Utility",
    argument: cmd_info.ping.argument,      
    description: cmd_info.ping.description,      
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    message.channel.send(":ping_pong: Pinging...").then(async msg => {
        msg.edit("<a:ping_pong_animated:828634971567816775> Pong!");
        var ping = msg.createdTimestamp - message.createdTimestamp;
        var api_ping = client.ws.ping;
        const embed = new Discord.MessageEmbed()
        .setDescription("**Here is bot latency!**")
        .addField(`Ping`,`${ping}ms`)
        .addField(`API Ping:`,`${api_ping}ms`);
        var value = (ping + api_ping) / 2;
        var status;
        if (value < 150) {
            embed.setColor("#07f213");
            embed.addField(`Status`,`Good (Average of ${value.toFixed(0)}ms)`);
        } else if (value < 300) {
            embed.setColor("#f5ed0c");
            embed.addField(`Status`,`Ok (Average of ${value.toFixed(0)}ms)`);
        } else {
            embed.setColor("#ff0f2b");
            embed.addField(`Status`,`Bad (Average of ${value.toFixed(0)}ms)`);
        }
        message.channel.send(embed);
    })
}
