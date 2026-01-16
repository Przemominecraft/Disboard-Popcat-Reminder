// Last update: 15/01/2026
// Made by 777popcat777

require('dotenv').config();
const config = process.env;

const { 
  Client, 
  Collection, 
  Events, 
  GatewayIntentBits, 
  Routes, 
  REST 
} = require('discord.js');

const fs = require('fs');
const rest = new REST({ version: '10' }).setToken(config.TOKEN);

// Client
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, () => {
  console.log('✅ Bot uruchomiony poprawnie');
});

// Komendy z folderu commands
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// Rejestracja globalnych komend
(async () => {
  try {
    await rest.put(
      Routes.applicationCommands(config.CLIENT_ID),
      { body: client.commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log('📌 Komendy zarejestrowane globalnie');
  } catch (err) {
    console.error('❌ Błąd rejestracji komend:', err);
  }
})();

// Obsługa interakcji
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (!interaction.replied) {
      await interaction.reply({ content: '❌ Błąd komendy', ephemeral: true });
    }
  }
});

// Logowanie
client.login(config.TOKEN);
global.client = client;

// Reminder (Disboard bump)
require('./reminder.js');
console.log(JSON.stringify(client.commands.map(cmd => cmd.data.toJSON()), null, 2));
