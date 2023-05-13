const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["premium"],
        name: "premium",
        help: "Premium Sistemi Hakkında Bilgi Verir",
        category: "bot"
    },

    run: async (client, message, args, embed) => {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Premium Üye Ol")
                    .setURL("https://discord.com/users/801069133810237491")
            );

        message.reply({
            embeds: [embed.setTitle("Premium Sistemi Hakkında")
                .setDescription("Merhaba! Premium üyelik sistemimiz hakkında bilgi almak istiyorsanız, aşağıdaki butona tıklayınız")],
            components: [row]
        });
    }
}
