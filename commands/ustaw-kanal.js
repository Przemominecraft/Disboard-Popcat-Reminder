// Last update: 15/01/2026
// Made by .pointer

// Paths

const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ustaw-kanal')
        .setDescription('Ustaw kanał do przypomnień o bumpach')
        .setContexts(['Guild'])

        .addChannelOption(opt =>
            opt.setName('kanal')
                .setDescription('Wybierz kanal')
                .setRequired(true)),

    async execute(intr) {

        if (!intr.member.permissions.has('Administrator')) return intr.reply({ content: 'Nie masz uprawnień do użycia tej komendy', flags: MessageFlags.Ephemeral });
        
        const channel = intr.options?.getChannel('kanal') ?? null;
        await fs.writeFile('./kanal.txt', channel.id);

        intr.reply({ content: 'Ustawiono kanał!', flags: MessageFlags.Ephemeral });
        channel.send('Oto nowy kanał do przypomnień o bumpach');
    }
};
