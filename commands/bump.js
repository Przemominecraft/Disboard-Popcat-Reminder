const { SlashCommandBuilder, MessageFlags } = require('discord.js');
const fs = require('fs').promises;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('bump')
    .setDescription('Zarządzanie przypomnieniami bumpa')
    .addStringOption(opt =>
      opt.setName('toggle')
        .setDescription('Włącz lub wyłącz przypomnienia')
        .setRequired(true)
        .addChoices(
          { name: 'on', value: 'on' },
          { name: 'off', value: 'off' }
        )
    ),

  async execute(interaction) {
    if (!interaction.member.permissions.has('Administrator')) {
      return interaction.reply({
        content: '❌ Tylko administrator może tym zarządzać.',
        ephemeral: true
      });
    }

    const value = interaction.options.getString('toggle');
    await fs.writeFile('./bump.txt', value);

    interaction.reply({
      content: `🔔 Przypomnienia bumpa są teraz: **${value.toUpperCase()}**`,
      ephemeral: true
    });
  }
};
