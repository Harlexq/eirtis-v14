const settings = require("../../configs/settings.json")
const moment = require("moment")
moment.locale("tr")
const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["hesap"],
        name: "hesap",
        help: "Ekonomi Hesabı Kurar/Siler",
        category: "ekonomi",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        if (!args[0]) return message.reply({
            embeds: [embed.setDescription(`
        **${settings.prefix}hesap kur** : Ekonomi sistemi için hesap kurarsın.
        **${settings.prefix}hesap sil** : Ekonimi sistemindeki hesabınızı silersiniz.
        `)]
        })

        if (args[0] === "kur") {
            let isim = args[1]

            if (!isim) return message.reply(`Lütfen Hesap adı belirtiniz`)

            if (db.get(`hesap_${message.author.id}`)) {
                return message.reply(`Zaten bir hesabınız bulunmaktadır.`)
            }

            db.set(`hesap_${message.author.id}`, isim)
            db.set(`coin_${message.author.id}`, 500)
            message.reply(`Hesabınız başarılı bir şekilde kurulmuştur. Hesabınıza 500 coin hediye edilmiştir`)
        }

        if (args[0] === "sil") {
            let kontrol = db.fetch(`hesap_${message.author.id}`)

            if (!kontrol) return message.reply(`Zaten Hesabınız Yok`)
            db.delete(`hesap_${message.author.id}`)
            let kontrol2 = db.fetch(`coin_${message.author.id}`)

            if (kontrol2) db.delete(`coin_${message.author.id}`)

            message.reply(`Hesabınız başarılı bir şekilde sıfırlanmıştır.`)
        }
    },
}