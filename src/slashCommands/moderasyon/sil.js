const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sil')
        .setDescription('Yazdığınız Sayı Kadar Kanaldan Mesajı Siler')
        .addIntegerOption(option => option.setName('limit').setDescription('Kaç mesaj silineceğini belirtin.').setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("MANAGE_MESSAGES")) {
            return interaction.reply({ content: 'Üzgünüm, buna yetkin yok', ephemeral: true });
        }

        const silindi = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("silindi")
                    .setLabel("Mesajlar Silindi")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1086393444315975820")
                    .setDisabled(true)
            );

        const limit = interaction.options.getInteger('limit');

        if (limit > 100) {
            return interaction.reply({ content: '100 mesajdan fazla silmek beni zorlar abi, anlayışla karşıla, o yükü kaldıramam, daha az bir sayı yazarsan daha iyi olur. ', ephemeral: true });
        }

        if (limit < 1) {
            return interaction.reply({ content: 'En azından 1 mesaj silmen gerek.', ephemeral: true });
        }

        const messages = await interaction.channel.messages.fetch({ limit })
        try {
            await interaction.channel.bulkDelete(messages)
            interaction.channel.send({ content: `${limit} Kadar Mesaj Silindi`, components: [silindi] });
        } catch {
            await interaction.channel.send({ content: `${limit} kadar mesajı silemedim, büyük ihtimalle mesajlar 14 günden eski!`, ephemeral: true });
        }
    },
};