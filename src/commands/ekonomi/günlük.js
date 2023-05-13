const db = require("nrc.db")
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js")
const moment = require("moment")
moment.locale("tr")

module.exports = {
    conf: {
        aliases: ["daily"],
        name: "günlük",
        help: "Günlük 200 Ve 1000 Arasında Coin Verir",
        category: "ekonomi",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        let userx = message.mentions.users.first() || message.author;
        let account = db.fetch(`hesap_${userx.id}`);

        if (!account) return message.reply(`Kullanıcının hesabı yok. Lütfen önce bir hesap oluşturun. \`e.hesap kur [isim]\``);

        let reward1 = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("reward1")
            .setEmoji("1092725184718442496")

        let reward2 = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("reward2")
            .setEmoji("1092725184718442496")

        let reward3 = new ButtonBuilder()
            .setStyle(ButtonStyle.Secondary)
            .setCustomId("reward3")
            .setEmoji("1092725184718442496")

        const reward = new ActionRowBuilder()
            .addComponents([reward1, reward2, reward3]);

        const rewardx = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setImage("https://cdn.discordapp.com/attachments/1039631941462413453/1086639384503267358/dhd.jpg")

        let kontrol = Number(db.fetch(`günlük_${message.author.id}`))
        if (kontrol > moment.utc().format("X")) {
            message.reply(`Bir Sonraki Günlük Ödül için Süreniz: <t:${kontrol}:R> (<t:${kontrol}:F>)`)
        } else {

            let msg = await message.reply({ content: `Günlük Ödülünüzü Almak İçin Aşağıdakı Butonlardan Herhangi Tıklayınız`, embeds: [rewardx], components: [reward] })

            var filter = (interaction) => interaction.user.id === message.author.id;
            const collector = msg.createMessageComponentCollector({ filter })

            collector.on("collect", async (interaction) => {
                if (interaction.customId === "reward1") {
                    await interaction.deferUpdate();
                    let coinMiktarı = Math.floor(Math.random() * 801) + 200;
                    let kontrol2 = Number(db.fetch(`coin_${message.author.id}`))
                    if (!kontrol2) db.set(`coin_${message.author.id}`, 0)

                    db.add(`coin_${message.author.id}`, coinMiktarı)
                    db.set(`günlük_${message.author.id}`, moment.utc().add(1, 'day').format("X"))
                    msg.edit({ content: `Başarılı bir şekilde ${coinMiktarı} coin günlük ödülünüzü aldınız`, embeds: [], components: [] });
                }
                if (interaction.customId === "reward2") {
                    await interaction.deferUpdate();
                    let coinMiktarı = Math.floor(Math.random() * 801) + 200;
                    let kontrol2 = Number(db.fetch(`coin_${message.author.id}`))
                    if (!kontrol2) db.set(`coin_${message.author.id}`, 0)

                    db.add(`coin_${message.author.id}`, coinMiktarı)
                    db.set(`günlük_${message.author.id}`, moment.utc().add(1, 'day').format("X"))
                    msg.edit({ content: `Başarılı bir şekilde ${coinMiktarı} coin günlük ödülünüzü aldınız`, embeds: [], components: [] });
                }
                if (interaction.customId === "reward3") {
                    await interaction.deferUpdate();
                    let coinMiktarı = Math.floor(Math.random() * 801) + 200;
                    let kontrol2 = Number(db.fetch(`coin_${message.author.id}`))
                    if (!kontrol2) db.set(`coin_${message.author.id}`, 0)

                    db.add(`coin_${message.author.id}`, coinMiktarı)
                    db.set(`günlük_${message.author.id}`, moment.utc().add(1, 'day').format("X"))
                    msg.edit({ content: `Başarılı bir şekilde ${coinMiktarı} coin günlük ödülünüzü aldınız`, embeds: [], components: [] });
                }
            })
        }
    }
}
