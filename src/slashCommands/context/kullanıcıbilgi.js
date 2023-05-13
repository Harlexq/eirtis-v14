const { ContextMenuCommandBuilder, ApplicationCommandType, EmbedBuilder } = require("discord.js");
const moment = require('moment');
require('moment-duration-format');
moment.locale('tr');


module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Kullanıcı Bilgi")
        .setType(ApplicationCommandType.User),

    async execute(interaction, client, embed) {

        const user = interaction.options.getUser("user");

        const members = [
            ...interaction.guild.members.cache.filter((x) => !x.user.bot).values(),
        ].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);

        await interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(user.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) }).addFields({
                        name: `Kullanıcı Bilgisi`, value: `
    **__\`Hesap Adı:\`__** ${user}
    **__\`Kullanıcı ID:\`__** **\`${user.id}\`**
    **__\`Kuruluş Tarihi:\`__** <t:${Math.floor(user.createdTimestamp / 1000)}:R>
    `},
                        {
                            name: `Sunucu Bilgisi`, value: `
    **__\`Sunucu İsmi:\`__**: **\`${interaction.guild.name}\`**
    **__\`Katılım Tarihi:\`__** <t:${Math.floor(user.joinedAt / 1000)}:R>
    **__\`Katılım Sırası:\`__** ${(interaction.guild.members.cache.filter(a => a.joinedTimestamp <= user.joinedTimestamp).size).toLocaleString()}/${(interaction.guild.memberCount).toLocaleString()}
    `},
                    ),
            ],
        });
    }
};