const cmd_info = require("../lib/commands_info.json");
module.exports.config = {
	name: "akinator",
	aliases: ["aki","guessmyanswer"],
    type: "Fun",
    argument: cmd_info.akinator.argument,
    description: cmd_info.akinator.description,
}

const Discord = require("discord.js");
const config = require("../config.json");
const prefix = config.prefix;
const { Aki } = require('aki-api');
const on_going_games = new Set();

module.exports.run = async (client, message, args) => {
    
    if (on_going_games.has(message.channel.id)) {
        let channel = message.guild.channels.cache.get(message.channel.id);
        message.author.send(`There is already an on-going Akinator game in this channel!\n> **Channel ID:** ${message.channel.id}\n> **Channel name:** ${channel.name}`);
        return;
    }
    // Check if there is args[0]
    if (!args[0]) {
        const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setTitle("Akinator")
        .setDescription('Please choose game thematic! `' + config.prefix + 'akinator [theme]`')
        .addField('1. Character',`> Think about a person or an anime character\n> *Aliases*: char, person, 1`)
        .addField('2. Object',`> Think about an object or something related\n> *Aliases*: stuff, 2`)
        .addField('3. Animal',`> Think about an animal\n> *Aliases*: ani, 3`)
        .setFooter(`Akinator Game - https://akinator.com`)
        return message.channel.send(embed);
    }
    // Theme check
    let theme;
    if (args[0].toLowerCase() == "character" || args[0].toLowerCase() == "char" || args[0].toLowerCase() == "person" || args[0] == "1") { 
        theme = 'en';
    } else if (args[0].toLowerCase() == "object" || args[0].toLowerCase() == "stuff" || args[0] == "2") {
        theme = 'en_objects';
    } else if (args[0].toLowerCase() == "animal" || args[0].toLowerCase() == "ani" || args[0] == "3") {
        theme = 'en_animals';
    } else return message.channel.send(`Sorry! There is no theme with the name: **${args[0]}**`);

    var game_count = 1;
    const region = theme;
    const aki = new Aki(region);

    on_going_games.add(message.channel.id);

    message.channel.send("Please wait! Starting up an Akinator game...").then(async msg => {
        // Akinator
        await aki.start();
        msg.delete().catch();
        aki_game();
    })
    
    async function call_aki_game() {
        if (aki.progress >= 70 || aki.currentStep >= 78) {
            await aki.win();
            var answer = aki.answers[0].name;
            var answer_desc = aki.answers[0].description;
            var answer_pic = `https://photos.clarinea.fr/BL_2_en/600/${aki.answers[0].picture_path}`;
            const embed = new Discord.MessageEmbed()
            .setColor(config.main_color)
            .setAuthor(`Akinator`)
            .setTitle(`I think of ${answer}`)
            .setDescription(answer_desc)
            .setImage(answer_pic)
            .addField(`Is my guess correct?`,`> ✅ Yes\n> ❌ No`)
            .setFooter(`Akinator Game - https://akinator.com\nPlease wait while the bot is reacting.`)
            message.channel.send(embed).then(async correct => {
                await correct.react('✅');
                await correct.react("❌");

                const filter = (reaction, user) => user.id != client.user.id && user.id == message.author.id;
                var collector = correct.createReactionCollector(filter, { time: 15000 });
                var rec = "no";
                collector.on("collect", async (reaction, user) => {
                    if (reaction.emoji.name == "✅") {
                        aki_end_yes(answer, answer_desc, answer_pic);
                        correct.delete().catch();
                        rec = "yes";
                        collector.stop();
                    }
                    if (reaction.emoji.name == "❌") {
                        aki_end_no();
                        correct.delete().catch();
                        rec = "yes";
                        collector.stop();
                    }
                })

                collector.on("end", async () => {
                    if (rec == "no") {
                        correct.delete().catch();
                        const embed = new Discord.MessageEmbed()
                        .setColor(config.main_color)
                        .setAuthor(`Akinator`)
                        .setTitle('No reply was provided. I guess I was right.')
                        .setDescription(`> **${answer}**\n> ${answer_desc}`)
                        .setImage(answer_pic)
                        .setFooter(`Akinator Game - https://akinator.com`)
                        message.channel.send(embed);             
                        release_channel();
                    } else return;
                })
            })
        } else {
            aki_game();
        }
    }

    function aki_game() {
        const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setAuthor(`Progress: ${parseFloat(aki.progress).toFixed(0)} / Question: ${game_count}`)
        .setTitle(`Akinator`)
        // .setThumbnail(aki_thumbnail())
        .setDescription(aki.question)
        .addField(`Choose your answer by reacting to those:`,`> ✅ Yes\n> ❌ No\n> ❔ Don't know\n> 👍 Probably\n> 👎 Probably not`)
        .setFooter(`Akinator Game - https://akinator.com\nPlease wait while the bot is reacting.`)
        message.channel.send(embed).then(async answer => {
            await answer.react('✅');
            await answer.react("❌");
            await answer.react("❔");
            await answer.react("👍");
            await answer.react("👎");

            const filter = (reaction, user) => user.id != client.user.id && user.id == message.author.id;
            var collector = answer.createReactionCollector(filter, { time: 30000 });
            var rec = "no";
            collector.on("collect", async (reaction, user) => {
                if (reaction.emoji.name == "✅") {
                    await aki.step(0);
                    answer.delete().catch();
                    game_count = parseFloat(game_count) + 1;
                    rec = "yes";
                    call_aki_game();
                    collector.stop();
                }
                if (reaction.emoji.name == "❌") {
                    await aki.step(1);
                    answer.delete().catch();
                    game_count = parseFloat(game_count) + 1;
                    rec = "yes";
                    call_aki_game();
                    collector.stop();
                }
                if (reaction.emoji.name == "❔") {
                    await aki.step(2);
                    answer.delete().catch();
                    game_count = parseFloat(game_count) + 1;
                    rec = "yes";
                    call_aki_game();
                    collector.stop();
                }
                if (reaction.emoji.name == "👍") {
                    await aki.step(3);
                    answer.delete().catch();
                    game_count = parseFloat(game_count) + 1;
                    rec = "yes";
                    call_aki_game();
                    collector.stop();
                }
                if (reaction.emoji.name == "👎") {
                    await aki.step(4);
                    answer.delete().catch();
                    game_count = parseFloat(game_count) + 1;
                    rec = "yes";
                    call_aki_game();
                    collector.stop();
                }
            });

            collector.on("end", async () => {
                if (rec == "no") {
                    message.channel.send(`No answers were provided. Ending game...`);
                    answer.delete().catch();
                    release_channel();
                    await aki.win();
                } else return;
            })
        })
    }

    function aki_end_yes(answer, answer_desc, answer_pic) {
        const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setAuthor(`Akinator`)
        .setTitle('Great, guessed right one more time!')
        .setDescription(`> **${answer}**\n> ${answer_desc}`)
        .setImage(answer_pic)
        .setFooter(`Akinator Game - https://akinator.com`)
        message.channel.send(embed);
        release_channel();
    }

    function aki_end_no() {
        const embed = new Discord.MessageEmbed()
        .setColor(config.main_color)
        .setAuthor(`Akinator`)
        .setTitle('Bravo! You have defeated me!')
        .setFooter(`Akinator Game - https://akinator.com`)
        message.channel.send(embed);
        release_channel();
    }

    function release_channel() {
        on_going_games.delete(message.channel.id);
    }

    // function aki_thumbnail() {
    //     const thumbnail = ["defi.png", "inspiration_legere.png","serein.png","etonnement.png","vrai_decouragement.png","inspiration_forte.png","confiant.png","mobile.png"];
    //     var i = Math.floor(Math.random() * thumbnail.length);
    //     return `https://en.akinator.com/bundles/elokencesite/images/akitudes_670x1096/${thumbnail[i]}`;
    // }
}

