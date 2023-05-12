const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('slowmode')
        .setDescription('Kanaldaki Mesaj Yazma Süresini Ayarlarsınız')
        .addIntegerOption(option =>
            option.setName('saniye')
                .setDescription('Yavaş mod süresi')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({ content: `Bu komutu kullanabilmek için yeterli yetkiye sahip değilsiniz.`, ephemeral: true });
        }

        const channel = interaction.channel;
        const time = interaction.options.getInteger('saniye');

        if (isNaN(time)) {
            return message.reply({ content: "Lütfen geçerli bir sayı girin (0-21600 arası)." });
        }

        if (time < 0 || time > 21600) {
            return message.reply({ content: "Lütfen geçerli bir sayı girin (0-21600 arası)." });
        }

        await channel.setRateLimitPerUser(time, "Yavaş mod ayarlandı.");
        return interaction.reply({ content: `Kanalın yavaş mod süresi ${time} saniye olarak ayarlandı.` });
    }
};