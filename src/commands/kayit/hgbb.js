const db = require("nrc.db")
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["hg-bb"],
        name: "hgbb",
        help: "Sunucuya Giren Ve Çıkan Kişilerin Gösterileceği Kanalı Seçer",
        category: "kayıt",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;
        let bos = args[0]


        if (!bos) return message.reply(`Lütfen Komudu Doğru Kullanınız. **Doğru Kullanım: ${settings.prefix}hg-bb kanal #kanal**`)


        if (args[0] == "kanal") {

            let kanal = message.mentions.channels.first();
            if (!kanal) return message.reply(`Lütfen Bir Kanal Etiketleyiniz **Doğru Kullanım ${settings.prefix}hg-bb kanal #kanal**`)


            db.set(`hg_bb_kanal_${message.guild.id}`, kanal.id)

            message.reply(`Başarılı Bir Şekilde Hoşgeldin BayBay kanalı ${kanal} olarak ayarlandı.`)

        }

        if (args[0] == "sıfırla") {

            db.delete(`hg_bb_kanal_${message.guild.id}`)
            message.reply(`Başarılı bir şekilde sıfırlandı.`)
        }

    },
}