const db = require("nrc.db");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["setprefix"],
        name: "prefix",
        help: "Sunucu İçin Çzel Bir Prefix Ayarlar",
        category: "bot"
    },

    run: async (client, message, args, embed, prefix) => {
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

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("Bu komutu kullanabilmek için **Yönetici** iznine sahip olmalısın!");

        if (!args[0]) return message.reply(`Doğru Kullanımı; **${prefix}prefix ayarla <yeniprefix>/sıfırla**`)

        if (args[0] === "ayarla") {

            if (!args[1]) return message.reply("Lütfen yeni prefixi belirtin!");
            const newPrefix = args[1];
            if (newPrefix.length < 1 || newPrefix.length > 3 || !isNaN(newPrefix)) {
                return message.reply("Prefix, minimum 1, maksimum 3 karakter uzunluğunda olmalı ve sayı içermemelidir.");
            }

            client.guildPrefixes.set(message.guild.id, newPrefix);
            db.set(`prefix_${message.guild.id}`, newPrefix);

            return message.reply(`Başarıyla sunucu için özel prefix ayarlandı: \`${newPrefix}\``);

        } else if (args[0] === 'sıfırla') {

            client.guildPrefixes.delete(message.guild.id);
            db.delete(`prefix_${message.guild.id}`);

            return message.reply("Sunucu için özel prefix sıfırlandı.");

        }
    }
}