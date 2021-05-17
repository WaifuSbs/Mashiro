const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "info",
	aliases: ["botinfo"],
    type: "Utility",
    argument: cmd_info.info.argument,
    description: cmd_info.info.description,
}

const Discord = require("discord.js");
const config = require("../config.json");
const package = require("../package.json");
const prefix = config.prefix;

module.exports.run = async (client, message, args) => {
    const kaomoji = require("../lib/kaomoji.json");
    var i = Math.floor(Math.random() * kaomoji.kaomoji.length);

    const embed = new Discord.MessageEmbed()
    .setAuthor(kaomoji.kaomoji[i], client.user.displayAvatarURL(), 'https://mashiro.weebs.life')
    .setTitle("Mashiro Discord Bot")
    .setColor(config.main_color)
    .setDescription(`<a:bumping_heart:827923724904169483> **A powerful discord bot for anime lovers.**\n
    > **Website:** [Click here](https://mashiro.weebs.life)
    > **Invite:** [Click here](https://mashiro.weebs.life/invite)
    > **Anime:** Sakurasou no Pet na Kanojo - [Fandom](https://sakurasou.fandom.com/wiki/Sakurasou_Wiki)`)
    .setImage("https://c4.wallpaperflare.com/wallpaper/143/922/439/shiina-mashiro-sakurasou-no-pet-na-kanojo-sakura-blossom-blonde-wallpaper-preview.jpg")
    .setFooter('A project by Weebs.life - https://weebs.life/', config.bot_logo);
    message.channel.send(embed);
}
