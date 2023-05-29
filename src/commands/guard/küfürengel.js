const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { Permissions } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["küfür-engel"],
        name: "küfürengel",
        help: "Küfür Engel Sistemini Açar/Kapatır",
        category: "guard",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
            return message.reply(
                "Bu Komutu Kullanmak İçin `YÖNETİCİ` Yetkisine Sahip Olmalısın"
            );
        }

        if (args[0] === "aç") {
            db.set(`küfür_${message.guild.id}`, true);
            message.reply("Küfür Engelleme Sistemi Başarıyla Açıldı");
        } else if (args[0] === "kapat") {
            db.set(`küfür_${message.guild.id}`, false);
            message.reply("Küfür Engelleme Sistemi Başarıyla Kapatıldı");
        } else {
            message.reply(
                `Geçerli bir işlem belirtmelisiniz! (${settings.prefix}küfürengel aç/kapat)`
            );
        }
    },
};
