const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ContextMenuCommandBuilder, ApplicationCommandType, ButtonStyle } = require("discord.js");
const axios = require('axios');

module.exports = {
    data: new ContextMenuCommandBuilder()
        .setName("Banner")
        .setType(ApplicationCommandType.User),

    async execute(interaction, client, embed) {

        const user = interaction.options.getUser("user");
        await user.fetch();

        async function bannerXd(user, client) {
            const response = await axios.get(`https://discord.com/api/v9/users/${user}`, {
                headers: { Authorization: `Bot ${client.token}` },
            });
            if (!response.data.banner)
                return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`;
            if (response.data.banner.startsWith('a_'))
                return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`;
            else
                return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`;
        }

        let banner = await bannerXd(user.id, client);

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Tarayıcıda Aç")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`${banner}`)
            );

        const banners = new EmbedBuilder()
            .setAuthor({ name: interaction.guild.name, iconURL: interaction.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: interaction.user.tag, iconURL: interaction.user.avatarURL({ dynamic: true, size: 2048 }) })
            .setTitle(`${user.username}'in Banneri`)
            .setImage(`${banner}`);

        interaction.reply({ embeds: [banners], components: [row3] });
    }
};