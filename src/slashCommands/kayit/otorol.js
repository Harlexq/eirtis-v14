const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('otorol')
        .setDescription('Sunucuya Giren Kişiye Verilcek Rolü Ayarlar')
        .addSubcommand(subcommand =>
            subcommand
                .setName('kanal')
                .setDescription('Otorol mesajının gönderileceği kanalı ayarlar')
                .addChannelOption(option =>
                    option.setName('kanal')
                        .setDescription('Otorol mesajının gönderileceği kanalı seçin')
                        .setRequired(true)
                )
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('rol')
                .setDescription('Otorol rolünü ayarlar')
                .addRoleOption(option =>
                    option.setName('rol')
                        .setDescription('Otorol verilecek rolü seçin')
                        .setRequired(true)
                )
        ),
    async execute(interaction, client, embed) {
        const subcommand = interaction.options.getSubcommand();

        if (subcommand === 'kanal') {
            const channel = interaction.options.getChannel('kanal');
            db.set(`otorol_kanal_${interaction.guildId}`, channel.id)
            interaction.reply(`Başarılı bir şekilde ${channel} isimli kanala rol verdiğim kişileri yazıcam`)
        }

        if (subcommand === 'rol') {
            const role = interaction.options.getRole('rol');
            db.set(`otorol_rol_${interaction.guildId}`, role.id)
            interaction.reply(`Başarılı bir şekilde ${role} isimli rolü gelen yeni kişilere vereceğim.`)
        }
    },
};
