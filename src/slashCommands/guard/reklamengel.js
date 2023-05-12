const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reklamengel')
        .setDescription('Sunucudaki Reklam Engel Sistemini Açar/Kapatır')
        .addStringOption(option =>
            option.setName('arguman')
                .setDescription('Açmak veya kapatmak istediğiniz işlemi belirtin.')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply(
                "Bu Komutu Kullanmak İçin `YÖNETİCİ` Yetkisine Sahip Olmalısın"
            );
        }

        const arguman = interaction.options.getString('arguman');

        if (arguman === "aç") {
            db.set(`reklam_${interaction.guild.id}`, true);
            interaction.reply("Reklam Engelleme Sistemi Başarıyla Açıldı");
        } else if (arguman === "kapat") {
            db.set(`reklam_${interaction.guild.id}`, false);
            interaction.reply("Reklam Engelleme Sistemi Başarıyla Kapatıldı");
        } else {
            interaction.reply(
                `Geçerli bir işlem belirtmelisiniz! (/reklamengel aç/kapat)`
            );
        }
    },
};