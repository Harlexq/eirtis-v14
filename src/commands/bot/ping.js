const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")

module.exports = {
    conf: {
        aliases: ["ping"],
        name: "ping",
        help: "Botun Anlık Pingini Gösterir",
        category: "bot",
    },

    run: async (client, message, args, embed) => {

        if (!message.guild) return;

        const butonlar = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('pings')
                    .setLabel('Pingi Göster')
                    .setEmoji("1086621220235133049")
                    .setStyle(ButtonStyle.Primary)
            );

        let msg = await message.reply({ embeds: [embed.setDescription(`Botun Pingini Görmek İçin Aşşağıdaki Butona Basınız`)], components: [butonlar] })
        var filter = (menu) => menu.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter })

        collector.on("collect", async (menu) => {
            if (menu.customId === "pings") {
                await menu.reply({ embeds: [embed.setDescription(`Botun Pingi: ${Math.round(message.client.ws.ping)} MS`)], ephemeral: true });
            }
        })
    },
}