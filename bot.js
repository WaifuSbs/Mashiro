const Discord = require('discord.js');
const client = new Discord.Client();
const config = require("./config.json");
const prefix = config.prefix;

// === // 

const fs = require("fs");

// Command Handler

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

fs.readdir("./commands/", (err, files) => {

  if(err) console.log(err);

  let jsfile = files.filter(f => f.split(".").pop() === "js");
  if (jsfile.length <= 0) {
    return console.log("[!] => Couldn't load commands since there is no commands files to load!");
  }

  jsfile.forEach((f, i) => {
    let pull = require(`./commands/${f}`);
    client.commands.set(pull.config.name.toLowerCase(), pull);
    pull.config.aliases.forEach(alias => {
      client.aliases.set(alias, pull.config.name);
    });
  });

  console.log(`=> Command: Loaded ${jsfile.length} commands.`);
}); 

// Event Handler

fs.readdir('./events/', (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
      const eventFunction = require(`./events/${file}`);
      if (eventFunction.disabled) return;

      const event = eventFunction.event || file.split('.')[0];
      const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client;
      const once = eventFunction.once;

      try {
          emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args));
      } catch (error) {
          console.error(error.stack);
      }
  });
  console.log(`=> Event: Loaded ${files.length} events.`)
});

client.on('ready', async () => {
  // Bot Status
  if (config.status.type == "STREAMING") {
    if (config.status.url == "") { console.log("=> WARN: Please set the url for Streaming status in config file!"); }
    else { client.user.setActivity(config.status.name, { type: "STREAMING" , url: config.status.url}); }
  } else {
    client.user.setActivity(config.status.name, { type: config.status.type});
  }
  console.log(`=> Client: Connected to Discord API (${client.user.tag})!`);
  // This function tests whether the bot is run with "node shard" or not.
  try {
    let values = await client.shard.broadcastEval(`[this.shard.id]`);
  } catch (err) {
    console.log(`[ERROR] Please run the bot with "node shard" instead! Destroying client...`)
    client.destroy();
    process.exit();
  }
  
});

client.on('message', async message => {
  
  // Command Executor if the message starts with prefix

  if (message.content.startsWith(prefix)) {
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0];
    let args = messageArray.slice(1);
    let command = client.commands.get(cmd.slice(prefix.length)) || client.commands.get(client.aliases.get(cmd.slice(prefix.length)));

    if (command) command.run(client, message, args);
    if (!command && message.content == prefix) {
      let info = require("./commands/util.info");
      info.run(client, message, args);
    }
  }

});

client.login(config.token);