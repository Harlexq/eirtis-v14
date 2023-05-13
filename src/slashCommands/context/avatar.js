const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ButtonStyle } = require("discord.js");

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Avatar")
        .setType(ApplicationCommandType.User),

    async execute(interaction, client, embed) {

        const user = interaction.options.getUser("user");
        await user.fetch();

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Tarayıcıda Aç")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`${user.displayAvatarURL({ dynamic: true })}`)
            );

        const avp = new EmbedBuilder()
            .setTitle(`${user.username}'in Avatarı`)
            .setImage(`${user.displayAvatarURL({ dynamic: true, size: 4096 })}`)
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })

        interaction.reply({
            embeds: [avp], components: [row2]
        })
    }
};