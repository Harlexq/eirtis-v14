const { EmbedBuilder, ActionRowBuilder, StringSelectMenuBuilder, SlashCommandBuilder } = require("discord.js");
const Discord = require("discord.js");
const moment = require("moment");
require("moment-duration-format");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("istatistik")
        .setDescription("Botun İstatistik Bilgilerini Gösterir"),
    async execute(interaction, client, embed) {

        const payidarzaman = moment

            .duration(client.uptime)
            .format(" D [gün], H [saat], m [dakika], s [saniye]");
        const kısayollar = new ActionRowBuilder()
            .addComponents(
                new StringSelectMenuBuilder()
                    .setCustomId('kısayollar')
                    .setPlaceholder('Botun İstatistiklerine Bakmak İçin Tıkla')
                    .addOptions([
                        {
                            label: 'Ping',
                            description: 'Botun Pingini Gösterir',
                            value: 'ping',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Kullanıcı Sayısı',
                            description: 'Botun Bulunduğu Sunucuların Kişi Sayısı',
                            value: 'kullanici',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Sunucu Sayısı',
                            description: 'Botun Bulunduğu Sunucu Sayısı',
                            value: 'sunucu',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Kanal Sayısı',
                            description: 'Botun Bulunduğu Sunucuların Kanal Sayısı',
                            value: 'kanal',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Aktiflik',
                            description: 'Botun Ne Kadar Süre Aktif Olduğunu Gösterir',
                            value: 'aktiflik',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Node.JS Versiyon',
                            description: 'Botun Node.JS Versiyonunu Gösterir',
                            value: 'node',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Ram Kullanımı',
                            description: 'Botun RAM Kullanım Oranını Gösterir',
                            value: 'ram',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Discord.JS',
                            description: 'Botun Discord.JS Versiyonunu Gösterir',
                            value: 'discord',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Konum',
                            description: 'Botun Bulunduğu Ülkeyi Gösterir',
                            value: 'konum',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'Bot Sahibi',
                            description: 'Bot Sahibini Gösterir',
                            value: 'bot_sahibi',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'İşletim Sistemi',
                            description: 'Bot İşletim Sistemi Özelliklerini Gösterir',
                            value: 'isletim_sistemi',
                            emoji: "1028811864978751529",
                        },
                        {
                            label: 'CPU',
                            description: 'Botun CPU\'sunu Gösterir',
                            value: 'cpu',
                            emoji: "1028811864978751529",
                        },
                    ]),
            );

        const menu5 = new EmbedBuilder()
            .setAuthor({ name: 'Eirtis İstatistik Menüsü', iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
            .setColor("White")
            .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
            .setTimestamp()
            .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
            .setDescription(`Eirtis Bot İstatistiklerine Aşağıdaki Menüden Bakabilirsin`)

        await interaction.reply({ embeds: [menu5], components: [kısayollar] });

        var filter = (menu) => menu.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter });

        collector.on("collect", async (menu) => {

            if (menu.values[0] === "ping") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`Botun Pingi: ${Math.round(interaction.client.ws.ping)} MS`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "kullanici") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`**Kullanıcı Sayısı:** ${client.guilds.cache.reduce((a, b) => a + b.memberCount, 0).toLocaleString()}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "sunucu") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`**Sunucu Sayısı:** ${client.guilds.cache.size.toLocaleString()}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "kanal") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`**Kanal Sayısı:** ${client.channels.cache.size.toLocaleString()}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "aktiflik") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`**Aktiflik Süresi:** ${payidarzaman}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "node") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`**Node Versiyonu:** ${process.version}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "ram") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`**Ram Kullanımı:** ${(process.memoryUsage().heapUsed / 1024 / 512).toFixed(2) + " MB"}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "discord") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`${Discord.version}`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "konum") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`Turkey :flag_tr:`, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "bot_sahibi") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`
                    **Bot Sahibi:** <@801069133810237491>

                    **Geliştirici:** <@1001220573457813584>
                    `, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "isletim_sistemi") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`\`Windows 11 | 64 Bit\``, true);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }

            if (menu.values[0] === "cpu") {
                await menu.deferUpdate();
                const embed = new EmbedBuilder()
                    .setAuthor({ name: interaction.guild.name, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setColor("White")
                    .setThumbnail('https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png')
                    .setTimestamp()
                    .setFooter({ text: interaction.member.user.username, iconURL: 'https://cdn.discordapp.com/app-icons/985448405545386034/b6b7fe5b3006e9186cff30ecc3c64d30.png' })
                    .setDescription(`\`\`\`AMD Ryzen 5 5500u\`\`\``);

                await interaction.editReply({ ephemeral: true, embeds: [embed], components: [kısayollar] });
            }
        })

    }
};