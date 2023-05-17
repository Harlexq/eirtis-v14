const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const moment = require("moment");
moment.locale("tr");

module.exports = {
    conf: {
        aliases: ["çek"],
        name: "çek",
        help: "Etiketlediğiniz Kullanıcıyı Sesde Yanınıza Çeker",
        category: "moderasyon"
    },

    run: async (client, message, args, embed) => {
        let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;

        if (!message.member.voice.channel) {
            return message.reply({ content: "Bir ses kanalında olmalısın!" });
        }
        if (!member) {
            return message.reply({ content: "Bir üye etiketle ve tekrardan dene!" });
        }
        if (!member.voice.channel) {
            return message.reply({ content: "Bu kullanıcı herhangi bir ses kanalında bulunmuyor!" });
        }
        if (message.member.voice.channel === member.voice.channel) {
            return message.reply({ content: "Zaten aynı kanaldasınız!" });
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

        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            member.voice.setChannel(message.member.voice.channel.id);
            message.react("1086393444315975820")
            message.reply({
                embeds: [embed.setDescription(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)]
            });
        } else {

            let msg = await message.reply({ content: `${member}`, embeds: [embed.setDescription(`${member}, ${message.author} \`${message.member.voice.channel.name}\` seni odasına çekmek istiyor. Kabul ediyor musun?`)], components: [row] })
            var filter = button => button.user.id === member.user.id;
            let collector = await msg.createMessageComponentCollector({ filter, time: 30000 })

            collector.on("collect", async (button) => {
                if (button.customId === "onay") {
                    await button.deferUpdate();
                    member.voice.setChannel(message.member.voice.channel.id);
                    msg.edit({ embeds: [embed.setDescription(`${message.author}, ${member} kişisini yanınıza taşıdınız.`)], components: [row2] })
                }

                if (button.customId === "red") {
                    await button.deferUpdate();

                    msg.edit({ embeds: [embed.setDescription(`${message.author}, ${member} yanına taşıma işlemi iptal edildi.`)], components: [row3] })
                }

            });
        }
    }
}