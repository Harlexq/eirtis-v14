module.exports = {
    conf: {
        aliases: ["herkesedm"],
        name: "duyuru",
        help: "Sunucuda Bulunan Herkese Bot DM'den Mesaj Atar",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.member.permissions.has("ADMINISTRATOR")) {
            return message.reply(
                "Bu komutu kullanabilmek için `Yönetici` yetkisine sahip olmalısın."
            );
        }

        const msg = args.join(" ");
        if (!msg) return message.reply("DM'de gönderilecek mesajı belirtmelisin!");

        message.guild.members.cache.forEach(member => {
            if (member.id === client.user.id) return;
            member.send((`
**${message.guild.name}** Sunucusunda ${message.author} Tarafından Sunucuda Bulunan Herkese Bu Mesaj İletilmiştir
            
**Gönderilen Mesaj**: ${msg}
            `)).catch(err => {
            });
        });

        message.reply(`Sunucudaki herkese başarıyla \`${msg}\` mesajı gönderildi.`);

    },
};
