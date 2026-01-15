// Last update: 15/01/2026
// Made by 777popcat777
require('dotenv').config();
const config = process.env;
const { Events, EmbedBuilder } = require('discord.js');
const fs = require('fs').promises;

// Funkcja sleep
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Embed przypomnienia
const embed = new EmbedBuilder()
    .setColor(0x8000ff)
    .setTitle('🔔 Przypomnienie o bumpie')
    .setDescription('Hej! Bump na Disboardzie jest znowu aktywny!\nUżyj komendy </bump:947088344167366698>, żeby podbić serwer')
    .setTimestamp();

// Nasłuchiwanie wiadomości Disboarda
client.on(Events.MessageCreate, async (msg) => {
    try {
        if (msg.author.id !== config.DISBOARD_ID) return;
        if (!msg.embeds[0]?.description) return;
        if (!msg.embeds[0].description.includes('Podbito serwer!')) return;

        // Sprawdź czy przypomnienia są włączone
        const state = await fs.readFile('./bump.txt', 'utf-8').catch(() => 'on');
        if (state.trim() !== 'on') return;

        // Wczytaj kanał
        const channelId = await fs.readFile('./kanal.txt', 'utf-8');
        const channel = await client.channels.fetch(channelId).catch(() => null);
        if (!channel) return;

        // Odczekaj i wyślij przypomnienie
        await wait(Number(config.MINUTES) * 60 * 1000);
        await channel.send({ content: '@everyone', embeds: [embed] });

    } catch (err) {
        console.error('Błąd reminder.js:', err);
    }
});
