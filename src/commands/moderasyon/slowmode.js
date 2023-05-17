const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["yavaşmod", "yavasmod", "yavaşmode"],
        name: "slowmode",
        help: "Kanaldaki Mesaj Yazma Süresini Ayarlarsınız",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return;
        }

        const channel = message.channel;
        const time = parseInt(args[0]);

        if (isNaN(time)) {
            return message.reply({ content: "Lütfen geçerli bir sayı girin (0-21600 arası)." });
        }

        if (time < 0 || time > 21600) {
            return message.reply({ content: "Lütfen geçerli bir sayı girin (0-21600 arası)." });
        }

        await channel.setRateLimitPerUser(time, "Yavaş mod ayarlandı.");
        message.reply({ content: `Kanalın yavaş mod süresi ${time} saniye olarak ayarlandı.` });
    }
}
