// Last update: 15/01/2026
// Made by .pointer

const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ustaw-kanal')
    .setDescription('Ustaw kanał do przypomnień o bumpach')
    .addChannelOption(opt =>
      opt.setName('kanal')
        .setDescription('Wybierz kanał')
        .setRequired(true)
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Nie masz uprawnień administratora', ephemeral: true });
    }

    const channel = interaction.options.getChannel('kanal');

    await fs.writeFile('./kanal.txt', channel.id);

    await interaction.reply({ content: '✅ Ustawiono kanał do przypomnień!', ephemeral: true });
    await channel.send('🔔 Ten kanał został ustawiony jako kanał przypomnień o bumpach.');
  }
};
