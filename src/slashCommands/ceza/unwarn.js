const { SlashCommandBuilder } = require('discord.js');;
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Kullanıcının tüm uyarılarını kaldırır.")
        .addUserOption(option =>
            option.setName("user")
                .setDescription("Uyarıları silinecek kullanıcı")
                .setRequired(true)
        ),
    async execute(interaction, client, embed) {
        if (!interaction.guild) return;

        if (
            !interaction.member.permissions.has("KICK_MEMBERS") &&
            !interaction.member.permissions.has("BAN_MEMBERS")
        ) {
            return interaction.reply({ content: "Uyarı yetkiniz yok.", ephemeral: true });
        }

        const user = interaction.options.getUser("user");

        if (!user) {
            return interaction.reply({ content: "Lütfen bir kullanıcı etiketleyin.", ephemeral: true });
        }

        const uyarilar = db.get(`${interaction.guild.id}_uyarilar_${user.id}`);

        if (!uyarilar || uyarilar.length === 0) {
            return interaction.reply({ content: "Bu kullanıcının hiç uyarısı yok.", ephemeral: true });
        }

        db.delete(`${interaction.guild.id}_uyarilar_${user.id}`);

        interaction.reply({ embeds: [embed.setDescription(`${user} kullanıcısının tüm uyarıları kaldırıldı.`)] });
    },
};
