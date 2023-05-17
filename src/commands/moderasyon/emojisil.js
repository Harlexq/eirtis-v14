const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["removeemoji", "emojiremove"],
        name: "emojisil",
        help: "Sunucuda bir emojiyi siler",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;
        if (!message.member.permissions.has('ADMINISTRATOR') && !message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return;
        }

        const silindi = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("silindi")
                    .setLabel("Emoji Silindi")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1086393444315975820")
                    .setDisabled(true)
            );

        const emojiIdentifier = args[0];
        if (!emojiIdentifier) {
            message.reply({ content: `Lütfen silmek istediğiniz emojiyi belirtin.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return;
        }

        let emoji = message.guild.emojis.cache.find(e => e.name === emojiIdentifier || e.id === emojiIdentifier.replace(/[^0-9]/g, ''));
        if (!emoji) {
            message.reply({ content: `Belirtilen isim veya ID'ye sahip bir emoji bulunamadı.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return;
        }

        try {
            await emoji.delete();
            message.reply({ content: `Emoji başarıyla silindi: ${emoji}`, components: [silindi] });
        } catch (error) {
            message.reply({ content: `Emoji silinirken bir hata oluştu: ${error}` });
        }
    },
};