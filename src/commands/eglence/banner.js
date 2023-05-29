const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder, StringSelectMenuBuilder } = require("discord.js");
const axios = require('axios');
const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")

module.exports = {
    conf: {
        aliases: ["afiş"],
        name: "banner",
        help: "Banneri Gösterir",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {

        if (!message.guild) return;

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('row')
                    .setPlaceholder('Kullanıcı Hakkında Bilgi Almak İçin Tıkla')
                    .addOptions([
                        {
                            label: 'Banner',
                            value: 'banner',
                            description: "Kullanıcının Bannerini Gösterir",
                            emoji: '1017556002406674473',
                        },
                        {
                            label: 'Avatar',
                            value: 'avatar',
                            description: "Kullanıcının Avatarını Gösterir",
                            emoji: '1017556002406674473',
                        },
                        {
                            label: 'Kullanıcı Bilgi',
                            value: 'kb',
                            description: "Kullanıcının Bilgilerini Gösterir",
                            emoji: '1017556002406674473',
                        }
                    ]),
            );

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

        let msg = await message.reply({
            embeds: [banners], components: [row, row3]
        })


        var filter = (menu) => menu.user.id === message.author.id;
        const collector = await msg.createMessageComponentCollector({ filter })

        collector.on("collect", async (menu) => {
            if (menu.values[0] === "banner") {
                await menu.deferUpdate();
                msg.edit({
                    embeds: [banners], components: [row, row3]
                })
            }
            if (menu.values[0] === "avatar") {
                await menu.deferUpdate();
                const row2 = new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("Tarayıcıda Aç")
                            .setStyle(ButtonStyle.Link)
                            .setURL(`${üye.displayAvatarURL({ dynamic: true })}`)
                    );

                const emes = new EmbedBuilder()
                    .setTitle(`${üye.username}'in Avatarı`)
                    .setImage(`${üye.displayAvatarURL({ dynamic: true, size: 4096 })}`)
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })

                msg.edit({
                    embeds: [emes], components: [row, row2]
                });
            }
            if (menu.values[0] === "kb") {
                await menu.deferUpdate();
                let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
                if (üye.user.bot) return;

                const roles = üye.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
                const rolleri = []
                if (roles.length > 6) {
                    const lent = roles.length - 6
                    let itemler = roles.slice(0, 6)
                    itemler.map(x => rolleri.push(x))
                    rolleri.push(`${lent} daha...`)
                } else {
                    roles.map(x => rolleri.push(x))
                }
                const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
                let member = message.guild.members.cache.get(üye.id)

                const kbembed = new EmbedBuilder()
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(üye.user.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: üye.user.tag, iconURL: üye.user.avatarURL({ dynamic: true, size: 2048 }) })
                    .addFields({
                        name: `Kullanıcı Bilgisi`, value: `
**__\`Hesap Adı:\`__** ${üye}
**__\`Kullanıcı ID:\`__** **\`${üye.id}\`**
**__\`Kuruluş Tarihi:\`__** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
`},
                        {
                            name: `Sunucu Bilgisi`, value: `
**__\`Sunucu İsmi:\`__**: **\`${message.guild.name}\`**
**__\`Katılım Tarihi:\`__** <t:${Math.floor(üye.joinedAt / 1000)}:R>
**__\`Katılım Sırası:\`__** ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= üye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}
`})

                msg.edit({
                    embeds: [kbembed], components: [row]
                })
            }
        })
    }
}