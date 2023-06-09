const db = require("nrc.db")
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["sayaç"],
        name: "sayaç",
        help: "Sayaç Sistemini Ayarlar",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        if (!args[0]) return message.reply({
            embeds: [embed.setDescription(`
**${settings.prefix}sayaç log :** Sayaş Logunu Ayaralarsınız.
**${settings.prefix}sayaç hedef :** Sayaş Hedefini Belirlersiniz.
        `)]
        })

        if (args[0] === "log") {
            let kanal = message.mentions.channels.first();

            if (!kanal) return message.reply(`Lütfen Log Kanalını belirtiniz.`)
            db.set(`sayaç_log_${message.guild.id}`, kanal.id)
            message.reply(`Başarılı bir şekilde sayaç log ${kanal} olarak belirlendi.`)
        }

        if (args[0] === "hedef") {
            let hedef = args[1]

            if (!hedef) return message.reply(`Hedef üye sayısını belirtiniz.`)
            if (isNaN(hedef)) return message.reply(`Hedef sayı ile olmalıdır.`)

            db.set(`sayaç_hedef_${message.guild.id}`, hedef)
            message.reply(`Sayaç hedefi **${hedef}** olarak ayarlandı.`)
        }

        if (args[0] === "sıfırla") {
            let kontrol1 = db.fetch(`sayaç_log_${message.guild.id}`)
            let kontrol2 = db.fetch(`sayaç_hedef_${message.guild.id}`)

            if (!kontrol1 && !kontrol2) return message.reply(`Zaten ayarlanmamış.`)
            if (kontrol1) db.delete(`sayaç_log_${message.guild.id}`)
            if (kontrol2) db.delete(`sayaç_hedef_${message.guild.id}`)
            message.reply(`Sayaç ayarlamaları sıfırlanmıştır.`)
        }
    },
}