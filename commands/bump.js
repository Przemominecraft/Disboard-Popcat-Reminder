const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bump')
    .setDescription('Włącz lub wyłącz przypomnienia o bumpie')
    .addStringOption(opt =>
      opt.setName('toggle')
        .setDescription('on = włącz, off = wyłącz')
        .setRequired(true)
        .addChoices(
          { name: 'on', value: 'on' },
          { name: 'off', value: 'off' }
        )
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has(PermissionFlagsBits.Administrator)) {
      return interaction.reply({ content: '❌ Tylko administrator może to ustawić.', ephemeral: true });
    }

    const state = interaction.options.getString('toggle');

    if (state === 'on') {
      await fs.writeFile('./bump.txt', 'on');
      return interaction.reply({ content: '🔔 Przypomnienia o bumpie **włączone**.', ephemeral: true });
    }

    if (state === 'off') {
      await fs.writeFile('./bump.txt', 'off');
      return interaction.reply({ content: '🔕 Przypomnienia o bumpie **wyłączone**.', ephemeral: true });
    }
  }
};
