const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["bot-koruma"],
        name: "botkoruma",
        help: "Sunucuya Eklenen Botları Banlar",
        category: "guard",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (message.author.id !== message.guild.ownerId) {
            return message.reply("Bu komutu kullanabilmek için sunucu sahibi olmalısın.");
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

        if (args[0] === "aç") {
            const channel = message.mentions.channels.first();
            if (!channel) return message.reply("Lütfen bir kanal etiketleyin.");

            db.set(`botkoruma_${message.guild.id}`, channel.id);
            message.reply(`Bot koruma başarıyla \`${channel.name}\` kanalına açıldı.`);
        } else if (args[0] === "kapat") {
            db.delete(`botkoruma_${message.guild.id}`);
            message.reply(`Bot koruma başarıyla kapatıldı.`);
        } else {
            message.reply("Lütfen geçerli bir argüman belirtin: `aç` veya `kapat`.");
        }
    },
};
