const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["dm"],
        name: "dm",
        help: "Etiketlenen Kullanıcıya Bot DM'den Mesaj Atar",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            return message.reply(
                "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın."
            );
        }

        const user = message.mentions.users.first();
        if (!user) return message.reply("Bir kullanıcı etiketlemelisin!");

        const msg = args.slice(1).join(" ");
        if (!msg) return message.reply("DM'de gönderilecek mesajı belirtmelisin!");

        try {
            await user.send(`
**${message.guild.name}** Sunucusunda ${message.author} Tarafından Sana Bir Mesaj Gönderiledi

**Gönderilen Mesaj**: ${msg}`
            );
            message.reply(`\`${user.tag}\` kullanıcısına başarıyla mesaj gönderildi.`);
        } catch (err) {
            message.reply(`\`${user.tag}\` kullanıcısına mesaj gönderirken bir hata oluştu: ${err}`);
        }
    },
};
