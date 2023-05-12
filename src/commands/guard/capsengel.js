const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["caps-engel"],
        name: "capsengel",
        help: "Sunucudaki Büyük Harf Kullanımını Açar/Kapatır",
        category: "guard",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply(
                "Bu komutu kullanabilmek için `YÖNETİCİ` iznine sahip olmalısın."
            );
        }

        if (!args[0]) {
            return message.reply(
                "Lütfen `aç` veya `kapat` argümanlarından birini belirtin."
            );
        }

        const arg = args[0].toLowerCase();

        if (arg !== "aç" && arg !== "kapat") {
            return message.reply(
                "Lütfen geçerli bir argüman belirtin: `aç` veya `kapat`."
            );
        }

        const guildId = message.guild.id;
        let guildSettings = db.get(`sunucuayarlar_${guildId}`) || {};

        guildSettings.capsEngel = arg === "aç";

        db.set(`sunucuayarlar_${guildId}`, guildSettings);

        message.reply(`Caps engelleme başarıyla ${arg}ıldı.`);

    },
}