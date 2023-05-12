const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kayıt-ayar')
        .setDescription('Kayıt sistemi ayarlar')
        .addRoleOption(option => option.setName('kayıt-yetkilisi').setDescription('Kayıt yetkilisi rolünü ayarlar.').setRequired(true))
        .addRoleOption(option => option.setName('erkek-rol').setDescription('Erkek üye rolünü ayarlar.').setRequired(true))
        .addRoleOption(option => option.setName('kız-rol').setDescription('Kız üye rolünü ayarlar.').setRequired(true))
        .addRoleOption(option => option.setName('kayıtsız-rol').setDescription('Kayıtsız rolünü ayarlar.').setRequired(true))
        .addChannelOption(option => option.setName('kayıt-log').setDescription('Kayıt log kanalını ayarlar.').setRequired(true))
        .addChannelOption(option => option.setName('kayıt-kanal').setDescription('Kayıt kanalını ayarlar.').setRequired(true)),
    async execute(interaction, client, embed) {
        const roleKayitYetkilisi = interaction.options.getRole('kayıt-yetkilisi');
        const roleErkek = interaction.options.getRole('erkek-rol');
        const roleKiz = interaction.options.getRole('kız-rol');
        const roleKayitsiz = interaction.options.getRole('kayıtsız-rol');
        const channelKayitLog = interaction.options.getChannel('kayıt-log');
        const channelKayitKanal = interaction.options.getChannel('kayıt-kanal');

        if (!roleKayitYetkilisi || !roleErkek || !roleKiz || !roleKayitsiz || !channelKayitLog || !channelKayitKanal) {
            return interaction.reply('Lütfen tüm seçenekleri belirtiniz.');
        }

        db.set(`kayıt_yetkili_${interaction.guild.id}`, roleKayitYetkilisi.id);
        db.set(`kayıt_erkek_rol_${interaction.guild.id}`, roleErkek.id);
        db.set(`kayıt_kız_rol_${interaction.guild.id}`, roleKiz.id);
        db.set(`kayıt_kayıtsız_rol_${interaction.guild.id}`, roleKayitsiz.id);
        db.set(`kayıt_kayıt_log_${interaction.guild.id}`, channelKayitLog.id);
        db.set(`kayıt_kayıt_kanal_${interaction.guild.id}`, channelKayitKanal.id);

        return interaction.reply('Kayıt sistemi başarıyla ayarlandı.');
    },
};