const { ActionRowBuilder, ButtonBuilder, ButtonStyle, SlashCommandBuilder } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('çek')
        .setDescription('Etiketlediğiniz Kullanıcıyı Sesde Yanınıza Çeker')
        .addUserOption(option =>
            option.setName('kullanıcı')
                .setDescription('Bir kullanıcı etiketleyin')
                .setRequired(true)),
    async execute(interaction, client, embed) {

        const user = interaction.options.getUser('kullanıcı');

        const member = interaction.guild.members.cache.get(user.id);
        const author = interaction.member;

        if (!author.voice.channel) {
            return interaction.reply({ content: "Bir ses kanalında olmalısın!" });
        }

        if (!member) {
            return interaction.reply({ content: "Bir üye etiketle ve tekrardan dene!" });
        }

        if (!member.voice.channel) {
            return interaction.reply({ content: "Bu kullanıcı herhangi bir ses kanalında bulunmuyor!" });
        }

        if (author.voice.channel === member.voice.channel) {
            return interaction.reply({ content: "Zaten aynı kanaldasınız!" });
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
            member.voice.setChannel(author.voice.channel.id);
            interaction.reply({ embeds: [embed.setDescription(`${author}, ${member} kişisini yanınıza taşıdınız.`)] });
        } else {

            await interaction.reply({
                content: `${member}`, embeds: [embed
                    .setDescription(`
                    ${member}, ${interaction.author} \`${interaction.member.voice.channel.name}\` seni odasına çekmek istiyor. Kabul ediyor musun?

                    Lütfen 30 saniye içerisinde işlem iptal edilecektir.
                    `)], components: [row]
            })
            var filter = button => button.user.id === interaction.user.id;

            let collector = await interaction.channel.createMessageComponentCollector({ filter, time: 30000 })

            collector.on("collect", async (button) => {

                if (button.customId === "onay") {
                    await button.deferUpdate();

                    member.voice.setChannel(interaction.member.voice.channel.id);
                    await interaction.editReply({ embeds: [embed.setDescription(`${interaction.author}, ${member} kişisini yanınıza taşıdınız.`)], components: [row2] })
                }

                if (button.customId === "red") {
                    await button.deferUpdate();
                    await interaction.editReply({ embeds: [embed.setDescription(`${interaction.author}, ${member} yanına taşıma işlemi iptal edildi.`)], components: [row3] })
                }
            });
        }
    },
};
