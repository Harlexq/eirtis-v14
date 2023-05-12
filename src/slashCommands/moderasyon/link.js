const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('link')
        .setDescription('Sunucunun Özel Url Kullanımını Gösteririr'),
    async execute(interaction, client, embed) {
        const guild = interaction.guild;
        if (!guild.vanityURLCode)
            return interaction.reply({ content: "Sunucuda Bir Özel Url Yok" });
        const url = await guild.fetchVanityData();

        interaction.reply({
            embeds: [embed.setTitle(`${guild.name} Sunucusunun Özel URL Kullanımı`)
                .setDescription(
                    `**URL:** discord.gg/${guild.vanityURLCode}\n**Toplam Kullanım:** ${url.uses}`
                )]
        });
    },
};