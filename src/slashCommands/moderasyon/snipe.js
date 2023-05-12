const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('snipe')
        .setDescription('En Son Silinen Mesajı Gösterir'),
    async execute(interaction, client, embed) {
        const snipes = db.get(`${interaction.channel.id}.snipes`) || [];
        if (snipes.length === 0) {
            return interaction.reply({
                content: 'Herhangi bir silinmiş mesaj bulunamadı!',
                ephemeral: true,
            });
        }
        const snipe = snipes[0];
        const snipeEmbed = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(interaction.user.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
\` • \` Mesaj içeriği: **${snipe.content}**
\` • \` Gönderilme tarihi: ${moment(snipe.createdAt).format("\`DD/MM/YYYY\` \`hh:mm:ss\`")}
\` • \` Silinme tarihi: ${moment(snipe.deletedAt).format("\`DD/MM/YYYY\` \`hh:mm:ss\`")}
            `)

        if (snipe.attachments.length > 0) {
            const attachment = snipe.attachments[0];
            snipeEmbed.setImage(attachment.url);
        }

        return interaction.reply({ embeds: [snipeEmbed] });
    },
};