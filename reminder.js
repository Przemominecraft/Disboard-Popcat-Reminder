// Last update: 15/01/2026
require('dotenv').config();
const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;

function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const embed = new EmbedBuilder()
    .setColor(0x8000ff)
    .setTitle('🔔 Przypomnienie o bumpie')
    .setDescription('Hej! Bump na Disboardzie jest znowu aktywny!\nUżyj komendy </bump:947088344167366698>, żeby podbić serwer')
    .setTimestamp();

client.on(Events.MessageCreate, async (msg) => {
    if (msg.author.id !== process.env.DISBOARD_ID) return;
    if (!msg.embeds[0]) return;

    if (!msg.embeds[0].description.includes('Podbito serwer!')) return;

    const channelId = (await fs.readFile('./kanal.txt', 'utf-8')).trim();
    const channel = await msg.guild.channels.fetch(channelId).catch(() => null);
    if (!channel) return;

    await wait(process.env.MINUTES * 60 * 1000);
    await channel.send({ content: '@everyone', embeds: [embed] });
});
