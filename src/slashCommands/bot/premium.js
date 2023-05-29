const { SlashCommandBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("premium")
        .setDescription("Premium Özelliklerini Benzersiz Avantajlarla Keşfedin"),
    async execute(interaction, client, embed) {

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Premium Üye Ol")
                    .setURL("https://discord.com/users/801069133810237491")
            );

        interaction.reply({
            embeds: [embed.setTitle("Premium Sistemi Hakkında")
                .setDescription("Merhaba! Premium üyelik sistemimiz hakkında bilgi almak istiyorsanız, aşağıdaki butona tıklayınız")],
            components: [row]
        });

    }
};
