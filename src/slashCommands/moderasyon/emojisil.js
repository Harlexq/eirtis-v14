const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('emojisil')
        .setDescription('Sunucudan Emoji Siler')
        .addStringOption(option =>
            option.setName('emoji')
                .setDescription('Silinecek emoji')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has('ADMINISTRATOR') && !interaction.member.permissions.has('MANAGE_EMOJIS')) {
            return interaction.reply({ content: `Yetkin bulunmamakta dostum.`, ephemeral: true });
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

        const emojiIdentifier = interaction.options.getString('emoji');

        if (!emojiIdentifier) {
            return interaction.reply({ content: `Lütfen silmek istediğiniz emojiyi belirtin.`, ephemeral: true });
        }

        let emoji = interaction.guild.emojis.cache.find(e => e.name === emojiIdentifier || e.id === emojiIdentifier.replace(/[^0-9]/g, ''));
        if (!emoji) {
            return interaction.reply({ content: `Belirtilen isim veya ID'ye sahip bir emoji bulunamadı.`, ephemeral: true });
        }

        try {
            await emoji.delete();
            return interaction.reply({ content: `Emoji başarıyla silindi: ${emoji}`, components: [silindi] });
        } catch (error) {
            return interaction.reply({ content: `Emoji silinirken bir hata oluştu: ${error}`, ephemeral: true });
        }
    },
};
