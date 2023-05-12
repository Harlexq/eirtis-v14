const { SlashCommandBuilder } = require('discord.js');
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kullanıcı-bilgi')
    .setDescription('Etiketlenen Kullanıcının Veya Sizin Bilgilerinizi Gösterir')
    .addMentionableOption((option) =>
      option
        .setName('kişi')
        .setDescription('Bilgilerine bakmak istediğiniz üyeyi belirtiniz.')
    ),
  async execute(interaction, client, embed) {
    const user = interaction.options.getMentionable('kişi') || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);

    const roles = member.roles.cache
      .filter((role) => role.id !== interaction.guild.id)
      .sort((a, b) => b.position - a.position)
      .map((role) => `<@&${role.id}>`);
    const rolleri = [];
    if (roles.length > 6) {
      const lent = roles.length - 6;
      let itemler = roles.slice(0, 6);
      itemler.map((x) => rolleri.push(x));
      rolleri.push(`${lent} daha...`);
    } else {
      roles.map((x) => rolleri.push(x));
    }
    const members = [
      ...interaction.guild.members.cache.filter((x) => !x.user.bot).values(),
    ].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
    await interaction.reply({
      embeds: [embed.addFields({
        name: `Kullanıcı Bilgisi`, value: `
**__\`Hesap Adı:\`__** ${üye}
**__\`Kullanıcı ID:\`__** **\`${üye.id}\`**
**__\`Kuruluş Tarihi:\`__** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
`},
        {
          name: `Sunucu Bilgisi`, value: `
**__\`Sunucu İsmi:\`__**: **\`${interaction.guild.name}\`**
**__\`Katılım Tarihi:\`__** <t:${Math.floor(üye.joinedAt / 1000)}:R>
**__\`Katılım Sırası:\`__** ${(interaction.guild.members.cache.filter(a => a.joinedTimestamp <= üye.joinedTimestamp).size).toLocaleString()}/${(interaction.guild.memberCount).toLocaleString()}
`})]
    });
  },
};
