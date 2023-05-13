const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    conf: {
        aliases: ['gallery'],
        name: 'galeri',
        help: 'Galeri Kanalını Ayarlar',
        category: 'moderasyon',
    },

    run: async (client, message, args) => {

        if (!message.member.permissions.has('MANAGE_GUILD')) {
            return message.reply('Bu komutu kullanmak için sunucuyu yönetme yetkisine sahip olmalısın.');
        }

        const channel = message.mentions.channels.first();
        if (!channel) {
            return message.reply('Lütfen bir kanal belirtin: `e.galeri #kanal`');
        }

        const channelId = channel.id;
        const dbKey = `gallery_${message.guild.id}`;

        await db.set(dbKey, channelId);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('clear')
                    .setLabel('Temizle')
                    .setStyle(ButtonStyle.Danger)
            );

        message.reply({
            content: `Galeri kanalı başarıyla ${channel} olarak ayarlandı.`,
            components: [row]
        });
    }
};