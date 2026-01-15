// Last update: 15/01/2026
// Made by 777popcat777
require('dotenv').config();

const config = process.env;
const { Client, Collection, Events, GatewayIntentBits, Routes, REST } = require('discord.js');
const rest = new REST({ version: '10' }).setToken(config.TOKEN);

// Client setup
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once(Events.ClientReady, async (c) => {
  console.log(`✅ Bot został uruchomiony jako ${c.user.tag}`);

  // Rejestracja GLOBALNYCH komend (bez guildId)
  const intr = require('./commands/ustaw-kanal.js');
  client.commands = new Collection();
  client.commands.set('ustaw-kanal', intr);

  await rest.put(
    Routes.applicationCommands(config.CLIENT_ID),
    { body: client.commands.map(cmd => cmd.data.toJSON()) }
  );

  console.log('🌍 Komendy zarejestrowane globalnie (bez GUILD_ID)');
});

client.login(config.TOKEN);
global.client = client;

// Interaction handling
client.on(Events.InteractionCreate, async (intr) => {
  const cmd = client.commands.get(intr.commandName);
  if (!cmd) return;
  if (!intr.replied) await cmd.execute(intr);
});

// Reminder setup
require('./reminder.js');
