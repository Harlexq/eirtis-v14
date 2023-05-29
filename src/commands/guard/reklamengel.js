const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["reklam-engel"],
        name: "reklamengel",
        help: "Reklam Engel Sistemini Açar/Kapatır",
        category: "guard",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply(
                "Bu Komutu Kullanmak İçin `YÖNETİCİ` Yetkisine Sahip Olmalısın"
            );
        }

        if (args[0] === "aç") {
            db.set(`reklam_${message.guild.id}`, true);
            message.reply("Reklam Engelleme Sistemi Başarıyla Açıldı");
        } else if (args[0] === "kapat") {
            db.set(`reklam_${message.guild.id}`, false);
            message.reply("Reklam Engelleme Sistemi Başarıyla Kapatıldı");
        } else {
            message.reply(
                `Geçerli bir işlem belirtmelisiniz! (${settings.prefix}reklamengel aç/kapat)`
            );
        }
    },
}
