const { SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('botkoruma')
        .setDescription('Sunucuya Eklenen Botları Banlar')
        .addStringOption(option => option
            .setName('arguman')
            .setDescription('Bot koruma özelliğini açmak veya kapatmak için "aç" veya "kapat" argümanını belirtin.')
            .setRequired(true))
        .addChannelOption(option => option
            .setName('kanal')
            .setDescription('Bot koruma loglarının gönderileceği kanal')
            .setRequired(false)),
    async execute(interaction, client, embed) {
        if (interaction.user.id !== interaction.guild.ownerId) {
            return interaction.reply("Bu komutu kullanabilmek için sunucu sahibi olmalısın.");
        }

        const arg = interaction.options.getString('arguman');
        const channel = interaction.options.getChannel('kanal');

        if (arg !== 'aç' && arg !== 'kapat') {
            return interaction.reply({
                content: 'Lütfen geçerli bir argüman belirtin: `aç` veya `kapat`.',
                ephemeral: true
            });
        }

        if (arg === 'aç' && !channel) {
            return interaction.reply({
                content: 'Lütfen log kanalını etiketleyin.',
                ephemeral: true
            });
        }

        if (arg === 'aç') {
            db.set(`botkoruma_${interaction.guild.id}`, channel.id);
            return interaction.reply({
                content: `Bot koruma başarıyla \`${channel.name}\` kanalına açıldı.`
            });
        }

        if (arg === 'kapat') {
            db.delete(`botkoruma_${interaction.guild.id}`);
            return interaction.reply({
                content: 'Bot koruma başarıyla kapatıldı.'
            });
        }
    },
};