const { ButtonBuilder, ActionRowBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('oylama')
        .setDescription('Sorduğunuz Sorunun Altında Oy Butonları Çıkartır')
        .addStringOption(option =>
            option.setName('soru')
                .setDescription('Oylama için soru')
                .setRequired(true)),
    async execute(interaction, client, embed) {
        const question = interaction.options.getString('soru');

        const approveButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Success)
            .setEmoji("1086393444315975820")
            .setCustomId("approve");

        const denyButton = new ButtonBuilder()
            .setStyle(ButtonStyle.Danger)
            .setEmoji("1086393445574262836")
            .setCustomId("deny");

        const row = new ActionRowBuilder().addComponents([approveButton, denyButton]);

        await interaction.reply({
            embeds: [embed.setTitle("Oylama")
                .setDescription(question)], components: [row]
        });

        const filter = (interaction) => {
            return interaction.isButton() && ["approve", "deny"].includes(interaction.customId) && interaction.message.id === interaction.message.id;
        };

        const interactionSet = new Set();

        const collector = interaction.channel.createMessageComponentCollector({ filter });

        const votes = {
            approve: new Set(),
            deny: new Set(),
        };

        collector.on("collect", async (interaction) => {
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

            await interaction.update({
                embeds: [embed.setTitle("Oylama")
                    .setDescription(question)
                    .addFields({ name: "Evet", value: `${approveCount} kişi (${approvePercentage}%)`, inline: true })
                    .addFields({ name: "Hayır", value: `${denyCount} kişi (${denyPercentage}%)`, inline: true })], components: [row]
            });
        });
    },
};