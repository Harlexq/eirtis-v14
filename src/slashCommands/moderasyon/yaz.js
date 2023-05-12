const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('yaz')
        .setDescription('Bota yazı yazdırır.')
        .addStringOption(option =>
            option.setName('mesaj')
                .setDescription('Yazdırılacak mesaj.')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) {
            return interaction.reply({
                content: 'Bu komudu kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekiyor.',
                ephemeral: true
            });
        }

        const message = interaction.options.getString('mesaj');

        return interaction.reply({
            content: message
        });
    },
};