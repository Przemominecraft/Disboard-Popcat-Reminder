// Last update: 15/01/2026
// Made by .pointer

require('dotenv').config();
const config = process.env;

const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;

// Functions

function wait(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };

async function get_guild(id) {
    let guild = client.guilds.cache.get(id);
    if (!guild) { try { guild = await client.guilds.fetch(id) } catch (err) { guild = null } };
    return guild;
};

async function get_channel(guild, id) {
    let channel = guild.channels.cache.get(id);
    if (!channel) { try { channel = await guild.channels.fetch(id) } catch (err) { channel = null } };
    return channel;
};

// Variables

const embed = new EmbedBuilder()
    .setColor(0x8000ff)
    .setTitle(`🔔  Przypomnienie o bumpie`)
    .setDescription(`Hej! Bump na Disboardzie jest znowu aktywny!\nUżyj komendy </bump:947088344167366698>, żeby podbić serwer`)
    .setTimestamp();

// Listener

client.on(Events.MessageCreate, async (msg) => {

    const guild = await get_guild(config.GUILD_ID);
    const channel = await get_channel(guild, await fs.readFile('./kanal.txt', 'utf-8'));

    if (!msg.author.id === config.DISBOARD_ID || msg.embeds[0]?.description) return;

    if (msg.embeds[0].description.includes('Podbito serwer!')) {

        await wait(config.MINUTES * 60 * 1000);
        await channel.send({ content: '@everyone', embeds: [embed] });
    };
});