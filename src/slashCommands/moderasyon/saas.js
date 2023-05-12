const { SlashCommandBuilder } = require('discord.js');
const db = require("nrc.db")

module.exports = {
    data: new SlashCommandBuilder()
        .setName('saas')
        .setDescription('Sa-As Sistemini Açar/Kapatır'),
    async execute(interaction, client, embed) {

        let saas = db.fetch(`saas_${interaction.guild.id}`)

        if (!saas) {
            db.set(`saas_${interaction.guild.id}`, true)
            interaction.reply(`Sa As Sistemi Başarılı Bir Şekilde Aktif Edildi.`)
            return;
        }
        db.delete(`saas_${interaction.guild.id}`)

        interaction.reply(`Sa As sistemi başarılı bir şekilde kapatıldı.`)

    },
};