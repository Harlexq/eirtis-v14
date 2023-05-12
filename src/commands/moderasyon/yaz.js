module.exports = {
    conf: {
        aliases: ["botayazdır", "bota-yazdır"],
        name: "yaz",
        help: "Bota Yazı Yazdırır",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")

        let mesaj = args.slice(0).join(' ');
        if (mesaj.length < 1) return message.reply('Yazmam için herhangi bir şey yazmalısın.');
        message.delete();
        message.reply(mesaj);
    },
}