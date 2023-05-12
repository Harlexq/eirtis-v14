const { SlashCommandBuilder } = require('discord.js');
const { shorten } = require('isgd');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('short')
    .setDescription('Yazdığınız Linki Kısaltır')
    .addStringOption(option =>
      option.setName('link')
        .setDescription('Kısaltılacak link')
        .setRequired(true)),
  async execute(interaction, client, embed) {
    const url = interaction.options.getString('link');
    if (!url) {
      return interaction.reply({ content: `Lütfen bir link girin!`, ephemeral: true });
    }

    shorten(url, async function (res, err) {
      if (err) {
        return interaction.reply({ content: `Bir hata oluştu! Lütfen daha sonra tekrar deneyin.`, ephemeral: true });
      }

      return interaction.reply({ content: `Kısaltılmış Link: **<${res}>**` });
    });
  },
};
