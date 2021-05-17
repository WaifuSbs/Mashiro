const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "status",
	aliases: [],
    type: "Utility",
    argument: cmd_info.status.argument,
    description: cmd_info.status.description,
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const moment = require("moment");
require("moment-duration-format");

module.exports.run = async (client, message, args) => {
    const promises = await client.shard.broadcastEval(`[this.shard.ids[0], this.guilds.cache.size, this.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0), this.channels.cache.size, this.uptime, process.memoryUsage().heapUsed]`);
    const embed = new Discord.MessageEmbed()
    .setTitle("Bot status")
    .setColor(config.main_color)
    .setTimestamp()

    let total_shards = 0;
    let total_servers = 0;
    let total_users = 0;
    let total_channels = 0;
    let memory = 0;
    let args_value = 0;

    let details = "";
    promises.forEach((value) => {
        if (args.length != null) {
            if (value[0] == args[0]) {
                embed.addField(`<:server:843534429892902952> Shard #${value[0]}`,`> Server Counts: **${value[1].toLocaleString()}**\n> User Counts: **${value[2].toLocaleString()}**\n> Channel Counts: **${value[3].toLocaleString()}**\n> Uptime: **${moment.duration(value[4]).format("d:hh:mm:ss")}**\n> Memory Usage: **${formatBytes(value[5])}**`, true);
                args_value = 1;
            }
        }
        
        total_shards = parseFloat(total_shards) + 1;
        total_servers = parseFloat(total_servers) + parseFloat(value[1].toLocaleString());
        total_users = parseFloat(total_users) + parseFloat(value[2].toLocaleString());
        total_channels = parseFloat(total_channels) + parseFloat(value[3].toLocaleString());
        memory = memory + parseFloat(value[5]);
    })

    if (!args[0] || args_value == 0) {
        embed.setDescription(`<:network:843851788070813796> Divided into **${total_shards} shards**\n> Total Servers: **${total_servers}**\n> Total Users: **${total_users}**\n> Total Channels: **${total_channels}**\n> Total Memory: **${formatBytes(memory)}**`)
    }
    message.channel.send(embed);

    function formatBytes(a, b) {
        if (a == 0) return "0 Byte";
        let c = 1024;
        let d = b || 2;
        let e = ["B","KB","MB","GB","TB","PB","EB","ZB","YB"];
        let f = Math.floor(Math.log(a) / Math.log(c));
        return parseFloat((a / Math.pow(c, f)).toFixed(d)) + " " + e[f];
    }
}