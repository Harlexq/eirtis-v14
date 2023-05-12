const { SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('capsengel')
        .setDescription('Sunucudaki Büyük Harf Kullanımını Açar/Kapatır')
        .addStringOption(option => option
            .setName('arguman')
            .setDescription('Caps engelleme özelliğini açmak veya kapatmak için "aç" veya "kapat" argümanını belirtin.')
            .setRequired(true)),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has('ADMINISTRATOR')) {
            return interaction.reply({
                content: 'Bu komutu kullanabilmek için `YÖNETİCİ` iznine sahip olmalısın.',
                ephemeral: true
            });
        }

        const arg = interaction.options.getString('arguman').toLowerCase();
        if (arg !== 'aç' && arg !== 'kapat') {
            return interaction.reply({
                content: 'Lütfen geçerli bir argüman belirtin: `aç` veya `kapat`.'
            });
        }

        const guildId = interaction.guild.id;
        let guildSettings = db.get(`sunucuayarlar_${guildId}`) || {};
        guildSettings.capsEngel = arg === 'aç';
        db.set(`sunucuayarlar_${guildId}`, guildSettings);

        interaction.reply({ content: `Caps engelleme başarıyla ${arg}ıldı.` });
    },
};
