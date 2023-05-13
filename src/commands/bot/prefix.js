const db = require("nrc.db");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["setprefix"],
        name: "prefix",
        help: "Sunucu için özel bir prefix ayarlar",
        category: "bot"
    },

    run: async (client, message, args, embed) => {
        const rows = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Premium Üye Ol")
                    .setURL("https://discord.com/users/801069133810237491")
            );

        const premiumUserID = "801069133810237491";

        if (message.author.id !== premiumUserID && !db.get(`premium_${message.author.id}`)) {
            return message.reply({ content: "Bu komutu sadece premium üyeler kullanabilir sende premium üye olmak istersen aşağıdaki butona basarak iletişime geçebilirsin", components: [rows] });
        }

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!");

        if (!args[0]) return message.reply("Lütfen yeni prefixi belirtin!");

        const newPrefix = args[0];
        client.guildPrefixes.set(message.guild.id, newPrefix);

        return message.reply(`Başarıyla sunucu için özel prefix ayarlandı: \`${newPrefix}\``);
    }
}