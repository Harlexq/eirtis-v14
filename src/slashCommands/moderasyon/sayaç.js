const { SlashCommandBuilder } = require('discord.js');
const db = require('nrc.db');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('sayaç')
        .setDescription('Sayaç Sistemini Ayarlar')
        .addSubcommand(subcommand =>
            subcommand
                .setName('log')
                .setDescription('Sayaç logunu ayarlar')
                .addChannelOption(option =>
                    option
                        .setName('kanal')
                        .setDescription('Sayaç log kanalını belirtin')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('hedef')
                .setDescription('Sayaç hedefini belirler')
                .addIntegerOption(option =>
                    option
                        .setName('sayı')
                        .setDescription('Sayaç hedef sayısını belirtin')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sıfırla')
                .setDescription('Sayaç ayarlamalarını sıfırlar')
        ),
    async execute(interaction, client, embed) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'log') {
            const kanal = interaction.options.getChannel('kanal');
            db.set(`sayaç_log_${interaction.guildId}`, kanal.id);
            interaction.reply(`Başarılı bir şekilde sayaç log ${kanal} olarak belirlendi.`);
        }

        if (subcommand === 'hedef') {
            const hedef = interaction.options.getInteger('sayı');
            db.set(`sayaç_hedef_${interaction.guildId}`, hedef);
            interaction.reply(`Sayaç hedefi **${hedef}** olarak ayarlandı.`);
        }

        if (subcommand === 'sıfırla') {
            const kontrol1 = db.fetch(`sayaç_log_${interaction.guildId}`);
            const kontrol2 = db.fetch(`sayaç_hedef_${interaction.guildId}`);

            if (!kontrol1 && !kontrol2) {
                interaction.reply('Zaten ayarlanmamış.');
            } else {
                if (kontrol1) db.delete(`sayaç_log_${interaction.guildId}`);
                if (kontrol2) db.delete(`sayaç_hedef_${interaction.guildId}`);
                interaction.reply('Sayaç ayarlamaları sıfırlanmıştır.');
            }
        }
    },
};