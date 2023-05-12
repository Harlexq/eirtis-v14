const { SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('afk')
    .setDescription('AFK moduna geçer.')
    .addStringOption(option =>
      option.setName('sebep')
        .setDescription('AFK olma sebebiniz.')
        .setRequired(true)
    ),
  async execute(interaction, client, embed) {
    const user = interaction.user;
    const sebep = interaction.options.getString('sebep');

    db.set(`afk_${user.id}`, sebep);

    await interaction.reply({ content: `${user} Başarıyla 'AFK' moduna geçiş yaptın. Sebep: **${sebep}**` });
  },
};
