const db = require("nrc.db");
const settings = require("../../configs/settings.json");

module.exports = {
    conf: {
        aliases: ["reklam-engel"],
        name: "reklamengel",
        help: "Sunucudaki Reklam Engel Sistemini Açar/Kapatır",
        category: "guard",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has("ADMINISTRATOR")) {
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