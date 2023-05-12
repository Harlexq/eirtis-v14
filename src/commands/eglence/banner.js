const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const axios = require('axios');

module.exports = {
    conf: {
        aliases: ["afiş"],
        name: "banner",
        help: "Etiketlenen Kullanıcının Veya Sizin Bannerinizi Gösterir",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {

        if (!message.guild) return;

        const üye = args.length > 0 ? message.mentions.users.first() || await client.users.fetch(args[0]) || message.author : message.author
        async function bannerXd(user, client) {
            const response = await axios.get(`https://discord.com/api/v9/users/${user}`, { headers: { 'Authorization': `Bot ${client.token}` } });
            if (!response.data.banner) return `https://media.discordapp.net/attachments/938786568175513660/972982817359274024/Banner_bulunmamakta.png`
            if (response.data.banner.startsWith('a_')) return `https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.gif?size=512`
            else return (`https://cdn.discordapp.com/banners/${response.data.id}/${response.data.banner}.png?size=512`)

        }

        let banner = await bannerXd(üye.id, client)

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel("Tarayıcıda Aç")
                    .setStyle(ButtonStyle.Link)
                    .setURL(`${banner}`)
            );

        const banners = new EmbedBuilder()
            .setTitle(`${üye.username}'in Banneri`)
            .setImage(`${banner}`)
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

        message.reply({
            embeds: [banners], components: [row3]
        })
    },
}