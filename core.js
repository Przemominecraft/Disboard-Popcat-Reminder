// Last update: 16/01/2026
// Made by 777popcat777
require('dotenv').config();
const { 
  Client, 
  Collection, 
  Events, 
  GatewayIntentBits, 
  Routes, 
  REST 
} = require('discord.js');
const fs = require('fs');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

// Załaduj komendy z folderu commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Rejestracja GLOBALNYCH komend
(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(process.env.CLIENT_ID),
      { body: client.commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log('🌍 Globalne komendy zarejestrowane');
  } catch (error) {
    console.error('Błąd rejestracji komend:', error);
  }
})();

// Obsługa slash komend
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(err);
    if (!interaction.replied) {
      await interaction.reply({ content: '❌ Błąd komendy', ephemeral: true });
    }
  }
});

// Reminder
global.client = client;
require('./reminder.js');

// Start
client.once(Events.ClientReady, () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);
});

client.login(process.env.TOKEN);
