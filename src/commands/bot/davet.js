const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["davet"],
        name: "davet",
        help: "Botun Davet Linkini Gösterir",
        category: "bot",
    },

    run: async (client, message, args, embed) => {

        if (!message.guild) return;

        let button1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel(`Davet Et`)
                    .setEmoji("1086621220235133049")
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=1099740758623395860&permissions=8&scope=bot%20applications.commands')
            );
        message.reply({ embeds: [embed.setDescription(`**Beni Sunucuna Davet Etmek İçin Aşağıdaki Butona Tıkla**`)], components: [button1] })
    },
}