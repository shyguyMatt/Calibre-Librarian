const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');

dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]})

client.commands = new Collection();

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

const commandFolder = path.join(__dirname, '../commands');

const commandFiles = fs.readdirSync(commandFolder).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
  const filePath = path.join(commandFolder, file);
  const command = require(filePath);

  if ('data' in command && 'execute in command') {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const eventsPath = path.join(__dirname, '../events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.login(process.env.DISCORD_TOKEN)

const librarian = {
  sendMessage: function(message) {
    const channels = client.channels.cache.get('1239009232582348880')
    channels.send(message)
  }
}

module.exports = librarian
