const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
  data: new SlashCommandBuilder()
    .setName("banner")
    .setDescription("Etiketlenen Kullanıcının Veya Sizin Avatarınızı Gösterir")
    .addMentionableOption(option =>
      option
        .setName("kişi")
        .setDescription("Bannerına bakmak istediğiniz üyeyi belirtiniz.")
    ),
  async execute(interaction, client, embed) {
    const member = interaction.options.getMentionable('kişi')?.id || interaction.member.id;
    try {
      await client.users.fetch(member);
    } catch (e) {
      return interaction.reply({
        content: ':x: Böyle bir kullanıcı bulunamadı.',
        ephemeral: true,
      });
    }

    const fetchUser = await client.users.fetch(member);
    await fetchUser.fetch();

    async function bannerXd(user, client) {
      const response = await axios.get(`https://discord.com/api/v9/users/${user}`, {
        headers: { Authorization: `Bot ${client.token}` },
      });
      if (!response.data.banner)
        return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`;
      if (response.data.banner.startsWith('a_'))
        return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`;
      else
        return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`;
    }

    let banner = await bannerXd(fetchUser.id, client);

    const row3 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Tarayıcıda Aç")
          .setStyle(ButtonStyle.Link)
          .setURL(`${banner}`)
      );

    const banners = new EmbedBuilder()
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
      .setColor("White")
      .setTimestamp()
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })
      .setTitle(`${fetchUser.username}'in Banneri`)
      .setImage(`${banner}`);

    interaction.reply({ embeds: [banners], components: [row3] });
  }
};
