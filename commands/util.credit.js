const cmd_info = require("../lib/commands_info.json");
const i18n = require("i18n");
i18n.setLocale("en");
module.exports.config = {
	name: "credit",
	aliases: ["credits","cr"],
    type: "Utility",
    argument: cmd_info.credit.argument,          
    description: cmd_info.credit.description,        
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    return message.channel.send("n/a");
    const credit = require("../lib/credit.json");
    const embed = new Discord.MessageEmbed()
    .setTitle("Credit")
    .setColor(config.main_color)
    .setTimestamp()
    .setFooter(`${config.bot_name} >> ${i18n.__("credit.name")}`, config.bot_logo);
    embed.setDescription(`**Project Leader:** ${credit["Project leader"]}`)
    var dev = []; var contributors = [];
    for (i=0;i < credit.length; i++) {
        dev.push(credit.Developers[i]);
        contributors.push(credit.Contributors[i]);
    }
    embed.addField(`Developers`, `${dev}`)
    embed.addField(`Contributors`, `${contributors}`)
    message.channel.send(embed);
}
