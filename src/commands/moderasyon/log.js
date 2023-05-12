const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["modlog", "mod-log"],
        name: "log",
        help: "Sunucuda Olup Bitenleri Kanalda Gösterir",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply(
                "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın."
            );
        }

        const subCommand = args[0];

        if (subCommand === "sıfırla") {
            db.delete(`logChannel_${message.guild.id}`);
            return message.reply("Log kanalı sıfırlandı.");
        }

        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0]);

        if (!channel) {
            return message.reply(
                "Doğru Kullanım \`e.log #Kanal/sıfırla\`"
            );
        }

        db.set(`logChannel_${message.guild.id}`, channel.id);

        message.reply({ embeds: [embed.setDescription(`Log kanalı başarıyla ${channel} olarak ayarlandı.`)] });
    },
};
