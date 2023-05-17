const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")
const cekilis = require("../../schemas/cekilis");
const settings = require("../../configs/settings.json")
const ms = require("ms")

module.exports = {
    conf: {
        aliases: ["cekilis", "giveaway"],
        name: "çekiliş",
        help: "Sunucuda Çekiliş Başlatır",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;
        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
            message.reply({ content: `Yetkin bulunmamakta dostum.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
            return
        }

        let zaman = args[0]
        let kazanan = args[1]
        let odul = args.slice(2).join(" ");
        let arr = [];
        if (!zaman) return message.reply({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        if (!kazanan) return message.reply({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        if (isNaN(kazanan)) return message.reply({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        if (kazanan > 1) return message.reply({ content: `\`HATA!\` Şuanlık sadece 1 kazanan belirleyebilirsiniz!` })
        if (!odul) return message.reply({ content: `\`HATA!\` Lütfen komutu doğru kullanın! \`.çekiliş 10m 1 Netflix\`` })
        let sure = ms(zaman)
        let kalan = Date.now() + sure
        if (message) message.delete();
        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("katil")
                    .setEmoji("1092724781805219880")
                    .setStyle(ButtonStyle.Primary)
            )
        let msg = await message.channel.send({
            embeds: [embed.setTitle(`${odul}`)
                .setDescription(`
          Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
          Çekilişi Başlatan : ${message.author}
          Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>

          Kazanacak kişi sayısı: ${kazanan}
                  `)], components: [row], content: `${settings.emoji.giveway} **ÇEKİLİŞ** ${settings.emoji.giveway}`
        })

        setTimeout(() => {
            if (arr.length <= 1) {
                if (msg) msg.edit({
                    embeds: [embed
                        .setTitle(`${odul}`)
                        .setDescription(`
          Çekilişe katılım olmadığından çekiliş iptal edildi!
          `)], components: []
                })
                return;
            }
            let random = arr[Math.floor(Math.random() * arr.length)]
            message.channel.send({ content: `Tebrikler <@${random}> Çekilişimizi Kazanmış Bulunmaktadır Çekiliş Ödülünü Almak İçin ${message.author} İle İletişime Geçebilirsin ${settings.emoji.giveway} ${settings.emoji.giveway} ${settings.emoji.giveway}` })
            if (msg) msg.edit({
                embeds: [embed
                    .setTitle(`${odul}`)
                    .setDescription(`
          Çekiliş sonuçlandı! 
          Çekilişi Başlatan : ${message.author} 
          Kazanan : <@${random}>

          ${arr.length} Katılımcı
                              `)], components: [], content: `${settings.emoji.giveway} **ÇEKİLİŞ SONRA ERDİ** ${settings.emoji.giveway}`
            })
        }, sure)

        let collector = await msg.createMessageComponentCollector({})
        collector.on("collect", async (button) => {
            button.deferUpdate(true)
            if (button.customId == "katil") {
                let tikdata = await cekilis.findOne({ messageID: button.message.id })
                if (tikdata?.katilan.includes(button.member.id)) return;
                await cekilis.findOneAndUpdate({ messageID: button.message.id }, { $push: { katilan: button.member.id } }, { upsert: true })
                arr.push(button.member.id)
                if (msg) msg.edit({
                    embeds: [embed.setTitle(`${odul}`)
                        .setDescription(`
          Çekiliş başladı! Aşağıdaki butona basarak katılabilirsiniz!
          Çekilişi Başlatan : ${message.author}
          Katılan kişi sayısı : ${tikdata?.katilan.length + 1 || 1}
          Bitiş Zamanı : <t:${Math.floor(kalan / 1000)}:R>

          Kazanacak kişi sayısı: ${kazanan}
                                      `)]
                })
            }
        })
    }
}