const { EmbedBuilder, SlashCommandBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warnings")
        .setDescription("Sizin veya etiketlenen kullanıcının uyarılarını listeler")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Uyarıları listelenecek kullanıcı")),
    async execute(interaction, client, embed) {
        let user = interaction.options.getUser("user");

        if (!user) user = interaction.user;

        const uyarilar = db.get(`${interaction.guild.id}_uyarilar_${user.id}`) || [];

        if (uyarilar.length === 0) {
            return interaction.reply({ embeds: [embed.setDescription("Kullanıcının herhangi bir uyarısı yok.")] });
        }

        const embedxx = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(
                `${user} kullanıcısının toplam ${uyarilar.length} uyarısı var:`
            );
        uyarilar.forEach((uyari, index) => {
            embedxx.addField(
                `${index + 1}. Uyarı`,
                `• Sebep: **${uyari.sebep}**\n• Moderator: **${uyari.moderator}**\n• Tarih: **${new Date(
                    uyari.tarih
                ).toLocaleDateString()}**`
            );
        });
        interaction.reply({ embeds: [embedxx] });
    },
};