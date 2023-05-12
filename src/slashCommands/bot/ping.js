const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ping")
        .setDescription("Botun Anlık Pingini Gösterir"),
    async execute(interaction, client, embed) {

        const butonlar = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pings')
                    .setLabel('Pingi Göster')
                    .setEmoji("1086621220235133049")
                    .setStyle(ButtonStyle.Primary)
            );

        await interaction.reply({ embeds: [embed.setDescription(`Botun Pingini Görmek İçin Aşşağıdaki Butona Basınız`)], components: [butonlar] })

        client.on('interactionCreate', async interaction => {

            if (interaction.customId === "pings") {
                interaction.reply({ embeds: [embed.setDescription(`Botun Pingi: ${Math.round(interaction.client.ws.ping)} MS`)], ephemeral: true });
            }

        })

    }
};