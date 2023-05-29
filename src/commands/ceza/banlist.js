const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
        conf: {
                aliases: ["banliste"],
                name: "banlist",
                help: "Sunucuda Banlı Olan Kullanıcıları Gösterir",
                category: "ceza",
        },
        run: async (client, message, args) => {
                if (!message.guild) return;

                const bannedUsers = await message.guild.bans.fetch();
                const bannedList = bannedUsers.map((ban) => {
                        return {
                                name: ban.user.tag,
                                id: ban.user.id,
                                reason: ban.reason || "Belirtilmemiş.",
                        };
                });

                const PAGE_SIZE = 5;
                const pageCount = Math.ceil(bannedList.length / PAGE_SIZE);
                let currentPage = 0;

                const generateEmbed = () => {
                        const embed = new EmbedBuilder()
                                .setTitle(`Sunucuda Yasaklı Kullanıcılar (${bannedUsers.size})`)
                                .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                                .setColor("White")
                                .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                                .setTimestamp()
                                .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                                .setDescription(
                                        bannedList
                                                .slice(currentPage * PAGE_SIZE, (currentPage + 1) * PAGE_SIZE)
                                                .map(
                                                        (ban, index) =>
                                                                `**${currentPage * PAGE_SIZE + index + 1}.** **İsim** = **\`${ban.name}\`** **İD** = \`${ban.id}\` **Yasaklanma Sebebi** = ${ban.reason}`
                                                )
                                                .join("\n")
                                );

                        const row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                        .setCustomId("prev")
                                        .setEmoji("1086618667950809139")
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(currentPage === 0),
                                new ButtonBuilder()
                                        .setCustomId("next")
                                        .setEmoji("1086617551380955236")
                                        .setStyle(ButtonStyle.Primary)
                                        .setDisabled(currentPage === pageCount - 1)
                        );

                        return { embeds: [embed], components: [row] };
                };

                const messageReply = await message.reply(generateEmbed());

                const filter = (interaction) =>
                        interaction.user.id === message.author.id &&
                        ["prev", "next"].includes(interaction.customId);

                const collector = messageReply.createMessageComponentCollector({ filter });

                collector.on("collect", async (interaction) => {
                        if (interaction.customId === "prev") {
                                currentPage--;
                        } else {
                                currentPage++;
                        }

                        await interaction.update(generateEmbed());
                });

                collector.on("end", async () => {
                        const row = new ActionRowBuilder().addComponents(
                                new ButtonBuilder()
                                        .setCustomId("prev")
                                        .setEmoji("1086618667950809139")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setDisabled(true),
                                new ButtonBuilder()
                                        .setCustomId("next")
                                        .setEmoji("1086617551380955236")
                                        .setStyle(ButtonStyle.Secondary)
                                        .setDisabled(true)
                        );

                        await messageReply.edit({ components: [row] });
                });

        },
};