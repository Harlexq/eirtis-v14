const db = require("nrc.db")
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["oto-rol"],
        name: "otorol",
        help: "Sunucuya Giren Kişiye Verilcek Rolü Ayarlar",
        category: "kayıt",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        let bos = args[0]

        if (!bos) return message.reply(`Lütfen Komudu Doğru Kullanınız. **Doğru Kullanım: ${settings.prefix}otorol kanal #kanal / ${settings.prefix}otorol rol @üye **`)

        if (args[0] == "rol") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen Bir Rol Belirtiniz`)

            db.set(`otorol_rol_${message.guild.id}`, rol.id)
            message.reply(`Başarılı bir şekilde ${rol} isimli rolü gelen yeni kişilere vereceğim.`)
        }

        if (args[0] == "kanal") {
            let kanal = message.mentions.channels.first();

            if (!kanal) return message.reply(`Lütfen bir kanal belirtiniz.`)
            db.set(`otorol_kanal_${message.guild.id}`, kanal.id)
            message.reply(`Başarılı bir şekilde ${kanal} isimli kanala rol verdiğim kişileri yazıcam`)
        }

        if (args[0] == "sıfırla") {

            db.delete(`otorol_kanal_${message.guild.id}`)
            db.delete(`otorol_rol_${message.guild.id}`)
            message.reply(`Sistem başarılı bir şekilde sıfırlandı / kapatıldı.`)

        }
    },
}