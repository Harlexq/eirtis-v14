const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('galeri')
        .setDescription('Etiketlediğiniz Kanalı Sıfırlar')
        .addChannelOption(option => option
            .setName('kanal')
            .setDescription('Nuke işleminin uygulanacağı kanalı etiketleyin.')
            .setRequired(true)),
    async execute(interaction, client, embed) {
        const channel = interaction.options.getChannel('kanal');

        if (!interaction.member.permissions.has('MANAGE_GUILD')) {
            return interaction.reply('Bu komutu kullanmak için sunucuyu yönetme yetkisine sahip olmalısın.');
        }

        if (!channel) {
            return interaction.reply('Lütfen bir kanal belirtin: `!galeri #kanal`');
        }

        const channelId = channel.id;
        const dbKey = `gallery_${interaction.guild.id}`;

        await db.set(dbKey, channelId);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('clear')
                    .setLabel('Temizle')
                    .setStyle(ButtonStyle.Danger)
            );

        interaction.reply({
            content: `Galeri kanalı başarıyla ${channel} olarak ayarlandı.`,
            components: [row]
        });
    },
};