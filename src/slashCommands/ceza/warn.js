const { SlashCommandBuilder } = require('discord.js');;
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Etiketlenen Kullanıcıyı DM'den Uyarır")
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Uyarılacak kullanıcı')
                .setRequired(true))
        .addStringOption(option =>
            option.setName('sebep')
                .setDescription('Uyarı sebebi')
                .setRequired(false)),
    async execute(interaction, client, embed) {
        if (!interaction.guild) return;

        if (!interaction.member.permissions.has("KICK_MEMBERS") && !interaction.member.permissions.has("BAN_MEMBERS")) {
            return interaction.reply({ content: "Uyarı yetkiniz yok.", ephemeral: true });
        }

        const user = interaction.options.getMember('kullanıcı');
        if (!user) {
            return interaction.reply({ content: "Lütfen bir kullanıcı etiketleyin.", ephemeral: true });
        }

        const reason = interaction.options.getString('sebep') || "Sebep belirtilmedi.";
        try {
            await user.send({
                embeds: [embed.setTitle(`Sunucudan Uyarıldınız`)
                    .setDescription(`**${interaction.guild.name}** sunucusunda uyarıldınız.`)
                    .addFields({ name: "Sebep", value: reason })]
            });
        } catch (error) {
            return interaction.reply({ content: "Kullanıcının DM kutusu kapalı veya uyarılamadı.", ephemeral: true });
        }

        let uyarilar = db.get(`${interaction.guild.id}_uyarilar_${user.id}`) || [];
        uyarilar.push({
            sebep: reason,
            moderator: interaction.user.tag,
            tarih: new Date().getTime()
        });
        db.set(`${interaction.guild.id}_uyarilar_${user.id}`, uyarilar);

        const uyarilarCount = uyarilar.length;

        interaction.reply({
            embeds: [embed.setTitle(`Uyarı`)
                .setDescription(`${user} kullanıcısı uyarıldı.`)
                .addFields({ name: "Sebep", value: reason })
                .addFields({ name: "Uyarı Sayısı", value: uyarilarCount.toString() })]
        });
    },
};
