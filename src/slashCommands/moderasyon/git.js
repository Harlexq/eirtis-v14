const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('git')
        .setDescription('Etiketlediğiniz Kullanıcının Sesde Yanına Gider')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Bir kullanıcı etiketleyin')
                .setRequired(true)),
    async execute(interaction, client, embed) {

        const member = interaction.options.getMember('kullanıcı');

        if (!interaction.member.voice.channel) {
            return interaction.reply({ content: "Bir ses kanalında olmalısın!", ephemeral: true });
        }
        if (!member) {
            return interaction.reply({ content: "Bir üye etiketle ve tekrardan dene!", ephemeral: true });
        }
        if (!member.voice.channel) {
            return interaction.reply({ content: "Bu kullanıcı herhangi bir ses kanalında bulunmuyor!", ephemeral: true });
        }
        if (interaction.member.voice.channel === member.voice.channel) {
            return interaction.reply({ content: "Zaten aynı kanaldasınız!", ephemeral: true });
        }

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("onay")
                    .setLabel("Kabul Et")
                    .setStyle(ButtonStyle.Success)
                    .setEmoji("1086393444315975820"),

                new ButtonBuilder()
                    .setCustomId("red")
                    .setLabel("Reddet")
                    .setStyle(ButtonStyle.Danger)
                    .setEmoji("1086393445574262836"),
            );

        const row2 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("redd")
                    .setLabel("İşlem Başarısız")
                    .setStyle(ButtonStyle.Danger)
                    .setDisabled(true),
            );

        const row3 = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("onayy")
                    .setLabel("İşlem Başarılı")
                    .setStyle(ButtonStyle.Success)
                    .setDisabled(true),
            );

        if (interaction.member.permissions.has("ADMINISTRATOR")) {
            interaction.member.voice.setChannel(member.voice.channel.id)
            interaction.reply({ embeds: [embed.setDescription(`${interaction.user}, ${member} kişisini yanınıza gittiniz.`)] })
        } else {

            await interaction.reply({
                content: `${member}`, embeds: [embed.setDescription(`
            ${member}, ${interaction.author} \`${interaction.member.voice.channel.name}\` odasına gelmek istiyor. Kabul ediyor musun?

            Lütfen 30 saniye içerisinde işlem iptal edilecektir.
            `)], components: [row]
            })
            var filter = button => button.user.id === interaction.user.id;
            let collector = await interaction.channel.createMessageComponentCollector({ filter, time: 30000 })

            collector.on("collect", async (button) => {

                if (button.customId === "onay") {
                    await button.deferUpdate();
                    interaction.member.voice.setChannel(member.voice.channel.id)
                    await interaction.editReply({
                        embeds: [embed.setDescription(`${interaction.author}, ${member} kişisinin yanına başarıyla gittiniz.`)],
                        components: [row2]
                    })

                }

                if (button.customId === "red") {
                    await button.deferUpdate();
                    await interaction.editReply({
                        embeds: [embed.setDescription(`${interaction.author}, ${member} yanına gitme işlemi iptal edildi.`)],
                        components: [row3]
                    })
                }

            });

        }
    },
};
