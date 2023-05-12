const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('küfürengel')
        .setDescription('Sunucudaki Küfür Engel Sistemini Açar/Kapatır')
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
            db.set(`küfür_${interaction.guild.id}`, true);
            interaction.reply("Küfür Engelleme Sistemi Başarıyla Açıldı");
        } else if (arguman === "kapat") {
            db.set(`küfür_${interaction.guild.id}`, false);
            interaction.reply("Küfür Engelleme Sistemi Başarıyla Kapatıldı");
        } else {
            interaction.reply(
                `Geçerli bir işlem belirtmelisiniz! (/küfürengel aç/kapat)`
            );
        }
    },
};