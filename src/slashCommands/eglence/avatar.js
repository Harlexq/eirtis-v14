const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Etiketlenen Kullanıcının Veya Sizin Avatarınızı Gösterir")
    .addUserOption(option =>
      option
        .setName("kişi")
        .setDescription("Avatarına bakmak istediğiniz üyeyi belirtiniz.")
    ),
  async execute(interaction, client, embed) {
    const member = interaction.options.getUser('kişi') || interaction.member;
    const fetchUser = await client.users.fetch(member.id);
    await fetchUser.fetch();

    const row2 = new ActionRowBuilder()
      .addComponents(
        new ButtonBuilder()
          .setLabel("Tarayıcıda Aç")
          .setStyle(ButtonStyle.Link)
          .setURL(`${fetchUser.displayAvatarURL({ dynamic: true })}`)
      );

    const avp = new EmbedBuilder()
      .setTitle(`${fetchUser.username}'in Avatarı`)
      .setImage(`${fetchUser.displayAvatarURL({ dynamic: true, size: 4096 })}`)
      .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
      .setColor("White")
      .setTimestamp()
      .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })

    interaction.reply({
      embeds: [avp], components: [row2]
    })

  }
};