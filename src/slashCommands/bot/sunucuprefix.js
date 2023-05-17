const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("sunucuprefix")
        .setDescription("Botun Davet Linkini Gösterir"),
    async execute(interaction, client, embed) {

        const guildPrefix = db.get(`prefix_${interaction.guild.id}`);
        const prefix = guildPrefix !== null ? guildPrefix : "Özel prefix ayarlanmamış ayarlamak için e.prefix ayarla <yeniprefix>";
        return interaction.reply(`Sunucu için ayarlanmış prefix: \`${prefix}\``);

    }
};