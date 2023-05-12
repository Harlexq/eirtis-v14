const { ActionRowBuilder, StringSelectMenuBuilder, ButtonBuilder, EmbedBuilder, ButtonStyle } = require("discord.js");
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["help", "y", "h", "yardim"],
        name: "yardım",
        help: "Botun Yardım Komutlarını Gösterir",
        category: "bot",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const row = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('row')
                    .setPlaceholder('Komutlar Hakkında Yardım Almak İçin Tıkla')
                    .addOptions([
                        {
                            label: 'Guard Komutlar',
                            value: 'guard',
                            description: "Guard Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1092349919949508628',
                        },
                        {
                            label: 'Moderasyon Komutlar',
                            value: 'moderasyon',
                            description: "Moderasyon Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1092349917395161138',
                        },
                        {
                            label: 'Kayıt Komutlar',
                            value: 'kayıt',
                            description: "Kayıt Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1059037613257920552',
                        },
                        {
                            label: 'Ceza Komutlar',
                            value: 'ceza',
                            description: "Ceza Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1076095405772779520',
                        },
                        {
                            label: 'Ekonomi Komutlar',
                            value: 'ekonomi',
                            description: "Ekonomi Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1086619027432026162',
                        },
                        {
                            label: 'Eğlence Komutlar',
                            value: 'eglence',
                            description: "Eğlence Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1092724781805219880',
                        },
                        {
                            label: 'Bot Komutlar',
                            value: 'bot',
                            description: "Bot Yardım Komutlarını Görmek İçin Tıkla",
                            emoji: '1086621220235133049',
                        }
                    ]),
            );

        const menu1 = new EmbedBuilder()
            .setAuthor({ name: 'Eirtis Yardım Menüsü', iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`

            **Guard Komutlarını Görmek için** ${settings.emoji.guard}

            **Moderasyon Komutlarını Görmek için** ${settings.emoji.moderasyon}
            
            **Kayıt Komutlarını Görmek İçin** ${settings.emoji.kayit}
            
            **Ceza Komutlarını Görmek için** ${settings.emoji.ceza}
            
            **Ekonomi Komutlarını Görmek için** ${settings.emoji.ekonomi}
            
            **Eğlence Komutlarını Görmek için** ${settings.emoji.eglence}
            
            **Bot Komutlarını Görmek için** ${settings.emoji.bot}

`)

        const button1 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setLabel('Destek Sunucusu')
                    .setEmoji("1086621220235133049")
                    .setStyle(ButtonStyle.Link)
                    .setURL('https://discord.gg/KXNebFVhTU'),
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel('Davet Et')
                    .setEmoji("1086621220235133049")
                    .setURL('https://discord.com/api/oauth2/authorize?client_id=1099740758623395860&permissions=8&scope=bot%20applications.commands')
            );

        let msg = await message.reply({ components: [row, button1], embeds: [menu1] });
        var filter = (menu) => menu.user.id === message.author.id;
        const collector = msg.createMessageComponentCollector({ filter })

        collector.on("collect", async (menu) => {
            if (menu.values[0] === "bot") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Bot Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "bot").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
            if (menu.values[0] === "eglence") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Eğlence Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "eglence").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
            if (menu.values[0] === "ekonomi") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Ekonomi Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "ekonomi").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
            if (menu.values[0] === "guard") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Guard Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "guard").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
            if (menu.values[0] === "kayıt") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Kayıt Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "kayıt").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
            if (menu.values[0] === "moderasyon") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Moderasyon Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "moderasyon").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
            if (menu.values[0] === "ceza") {
                await menu.deferUpdate();

                const embeds = new EmbedBuilder()
                    .setTitle("Ceza Komutları")
                    .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                    .setColor("White")
                    .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                    .setTimestamp()
                    .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                    .setDescription(`${client.commands.filter(x => x.conf.category !== "-" && x.conf.category == "ceza").map(x => `**${settings.prefix}${x.conf.name}** = \`${x.conf.help}\``).join('\n')}`)

                msg.edit({
                    embeds: [embeds],
                    components: [row, button1]
                })
            }
        })
    },
}
