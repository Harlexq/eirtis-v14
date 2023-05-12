const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const { t } = require("i18next");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("davet")
        .setDescription("Botun Davet Linkini Gösterir"),
    async execute(interaction, client, embed) {

        let button1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel(`${t("davet.davetbuton", { lng: interaction.locale })}`)
                    .setEmoji("1086621220235133049")
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=1099740758623395860&permissions=8&scope=bot%20applications.commands')
            );
        interaction.reply({ embeds: [embed.setDescription(`${t("davet.davetembed", { lng: interaction.locale })}`)], components: [button1] })

    }
};