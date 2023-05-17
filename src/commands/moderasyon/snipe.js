const { EmbedBuilder } = require('discord.js');
const db = require('nrc.db');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    conf: {
        aliases: ["snip"],
        name: "snipe",
        help: "En Son Silinen Mesajı Gösterir",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const snipes = db.get(`${message.channel.id}_snipes`) || [];
        if (snipes.length === 0) {
            return message.reply({
                content: 'Herhangi bir silinmiş mesaj bulunamadı!',
                ephemeral: true,
            });
        }
        const snipe = snipes[0];
        const snipeEmbed = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
\` • \` Mesaj içeriği: **${snipe.content}**
\` • \` Gönderilme tarihi: ${moment(snipe.createdAt).format("\`DD/MM/YYYY\` \`hh:mm:ss\`")}
\` • \` Silinme tarihi: ${moment(snipe.deletedAt).format("\`DD/MM/YYYY\` \`hh:mm:ss\`")}
            `)

        if (snipe.attachments.length > 0) {
            const attachment = snipe.attachments[0];
            snipeEmbed.setImage(attachment.url);
        }

        return message.reply({ embeds: [snipeEmbed], ephemeral: true });
    },
}