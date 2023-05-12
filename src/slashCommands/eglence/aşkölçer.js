const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('aşkölçer')
    .setDescription('Etiketlediğiniz Veya Random Biriyle Aşk Ölçer')
    .addUserOption(option =>
      option
        .setName("kişi")
        .setDescription("Aşk ölçmek istediğiniz kişiyi seçin.")
    ),
  async execute(interaction, client, embed) {
    const user = interaction.options.getUser('kişi');
    let target = user ? user : interaction.guild.members.cache.filter(member => member.id !== interaction.user.id).random().user;

    if (user.id === interaction.user.id) {
      return interaction.reply({ content: "Kendinle eşleşemezsin!" });
    }

    const tahmin = Math.floor(Math.random() * 99) + 1;
    let kalp, yorum;

    if (tahmin <= 25) {
      kalp = `❤️ 🖤 🖤 🖤 🖤 🖤 `;
      yorum = 'Bu iş olmaz sen bunu unut.';
    } else if (tahmin >= 25 && tahmin < 50) {
      kalp = `❤️ ❤️ 🖤 🖤 🖤 🖤 `;
      yorum = 'Azıcıkta olsa bir şeyler hissediyor sana :)';
    } else if (tahmin >= 50 && tahmin < 75) {
      kalp = `❤️ ❤️ ❤️ 🖤 🖤 🖤 `;
      yorum = 'Eh biraz biraz bir şeyler var gibi.';
    } else if (tahmin >= 75 && tahmin < 85) {
      kalp = `❤️ ❤️ ❤️ ❤️ 🖤 🖤 `;
      yorum = 'Biraz daha uğraşırsan bu iş olacak gibi :)';
    } else if (tahmin >= 85 && tahmin < 100) {
      kalp = `❤️ ❤️ ❤️ ❤️ ❤️ 🖤 `;
      yorum = 'Oluyor gibi :))';
    } else if (tahmin === 100) {
      kalp = `❤️ ❤️ ❤️ ❤️ ❤️ ❤️ `;
      yorum = 'Sizi evlendirelim <3';
    }

    return interaction.reply({
      embeds: [
        embed.setTitle('Aşk Ölçer')
          .setDescription(`Aşk Yüzdesi: **%${tahmin}**\n\n${kalp}\n\n${interaction.user} ile ${target} eşleştiniz. ${yorum}\n\n`)
      ]
    });
  }
};