const { ButtonBuilder, ActionRowBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["oylama"],
        name: "oylama",
        help: "Sorduğunuz Sorunun Altında Oy Butonları Çıkartır",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return;
        }

        const question = args.join(" ");
        if (!question) {
            return message.reply({ content: "Lütfen bir soru girin." });
        }

        const approveButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setEmoji("1086393444315975820")
            .setCustomId("approve");

        const denyButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji("1086393445574262836")
            .setCustomId("deny");

        const row = new ActionRowBuilder()
            .addComponents([approveButton, denyButton]);

        const msg = await message.reply({
            embeds: [embed.setTitle("Oylama")
                .setDescription(question)], components: [row]
        });

        const filter = (interaction) => {
            return interaction.isButton() && ["approve", "deny"].includes(interaction.customId) && interaction.message.id === msg.id;
        };

        const interactionSet = new Set();

        const collector = message.channel.createMessageComponentCollector({ filter });

        const votes = {
            approve: new Set(),
            deny: new Set(),
        };

        collector.on("collect", (interaction) => {
            if (interactionSet.has(interaction.user.id)) {
                return interaction.reply({ content: "Zaten oy kullanmışsınız.", ephemeral: true });
            }

            interactionSet.add(interaction.user.id);

            if (interaction.customId === "approve") {
                votes.approve.add(interaction.user.id);
            } else if (interaction.customId === "deny") {
                votes.deny.add(interaction.user.id);
            }

            const approveCount = votes.approve.size;
            const denyCount = votes.deny.size;

            const approvePercentage = ((approveCount / (approveCount + denyCount)) * 100).toFixed(2);
            const denyPercentage = ((denyCount / (approveCount + denyCount)) * 100).toFixed(2);

            interaction.update({
                embeds: [embed.setTitle("Oylama")
                    .setDescription(question)
                    .addFields({ name: "Evet", value: `${approveCount} kişi (${approvePercentage}%)`, inline: true })
                    .addFields({ name: "Hayır", value: `${denyCount} kişi (${denyPercentage}%)`, inline: true })], components: [row]
            });
        });
    },
};