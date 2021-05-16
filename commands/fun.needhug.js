const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "needhug",
	aliases: [],
    type: "Fun",
    argument: cmd_info.needhug.argument,
    description: cmd_info.needhug.description,
}

const Discord = require("discord.js");
const Neko = require("nekos.life");
const neko = new Neko();
const config = require("../config.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    message.channel.send(`${message.author} needs a hug!`).then(async msg => {
        await msg.react("bumping_heart:827923724904169483");
        var body = await neko.sfw.hug();
        const filter = (reaction, user) => user.id != message.author.id;
		var collector = msg.createReactionCollector(filter, { time: 15000 });
        var rec = "no";
        collector.on("collect", (reaction, user) => {
            if (reaction.emoji.id == "827923724904169483") {
                var reactor = user;
                hug(reactor, body);
                rec = "yes";
                collector.stop();
            }
        });

        collector.on("end", async () => {
            msg.delete();
            if (rec == "no") {
                message.channel.send(`No one cares about ${message.author}. Sad :cry:`)
            } else return;
        })
    })
    function hug(reactor, body) {
        const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setDescription(`${reactor} hugged ${message.author}! aww :hugging:`)
        .setImage(body.url);
        message.channel.send(embed);
    }
}