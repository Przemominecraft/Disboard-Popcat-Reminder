// Last update: 16/01/2026
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

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

const rest = new REST({ version: '10' }).setToken(config.TOKEN);

// ===== KOMENDY =====
client.commands = new Collection();
const commandFiles = fs.readdirSync('./commands').filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.data.name, command);
}

// ===== REJESTRACJA GLOBALNA =====
client.once(Events.ClientReady, async () => {
  console.log(`✅ Zalogowano jako ${client.user.tag}`);

  try {
    await rest.put(
      Routes.applicationCommands(config.CLIENT_ID),
      { body: client.commands.map(cmd => cmd.data.toJSON()) }
    );
    console.log('🌍 Globalne komendy zarejestrowane');

    // JSON do top.gg
    const json = client.commands.map(cmd => cmd.data.toJSON());
    fs.writeFileSync('./slash-commands.json', JSON.stringify(json, null, 2));
    console.log('📄 Wygenerowano plik slash-commands.json do top.gg');

  } catch (err) {
    console.error('❌ Błąd rejestracji:', err);
  }
});

// ===== OBSŁUGA KOMEND =====
client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const cmd = client.commands.get(interaction.commandName);
  if (!cmd) return;

  try {
    await cmd.execute(interaction);
  } catch (e) {
    console.error(e);
    if (!interaction.replied) {
      await interaction.reply({ content: '❌ Błąd komendy', ephemeral: true });
    }
  }
});

// ===== REMINDER =====
global.client = client;
require('./reminder.js');

// ===== LOGIN =====
client.login(config.TOKEN);
