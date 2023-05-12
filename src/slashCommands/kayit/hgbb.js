const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('hg-bb')
        .setDescription('Sunucuya Giren Ve Çıkan Kişilerin Gösterileceği Kanalı Seçer')
        .addSubcommand(subcommand =>
            subcommand
                .setName('kanal')
                .setDescription('Hoşgeldin BayBay kanalını ayarlar')
                .addChannelOption(option =>
                    option.setName('kanal')
                        .setDescription('Hoşgeldin BayBay kanalı')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('sıfırla')
                .setDescription('Hoşgeldin BayBay kanalını sıfırlar')
        ),
    async execute(interaction, client, embed) {

        if (!interaction.guild) return;

        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'kanal') {
            const kanal = interaction.options.getChannel('kanal');

            db.set(`hg_bb_kanal_${interaction.guild.id}`, kanal.id);

            interaction.reply(`Başarılı Bir Şekilde Hoşgeldin BayBay kanalı ${kanal} olarak ayarlandı.`);
        } else if (subCommand === 'sıfırla') {
            db.delete(`hg_bb_kanal_${interaction.guild.id}`);

            interaction.reply(`Başarılı bir şekilde sıfırlandı.`);
        }
    },
};