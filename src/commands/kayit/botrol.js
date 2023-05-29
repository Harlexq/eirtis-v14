const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["bot-rol"],
        name: "botrol",
        help: "Sunucuya Giren Kişiye Verilcek Rolü Ayarlar",
        category: "kayıt",
    },

    run: async (client, message, args, prefix) => {
        if (!message.guild) return;

        let bos = args[0]

        if (!bos) return message.reply(`Lütfen Komudu Doğru Kullanınız. **Doğru Kullanım: ${prefix}botrol kanal #kanal / ${prefix}botrol rol @rol**`)

        if (args[0] == "rol") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen Bir Rol Belirtiniz`)

            db.set(`botrol_rol_${message.guild.id}`, rol.id)
            message.reply(`Başarılı bir şekilde ${rol} isimli rolü gelen yeni kişilere vereceğim.`)
        }

        if (args[0] == "kanal") {
            let kanal = message.mentions.channels.first();

            if (!kanal) return message.reply(`Lütfen bir kanal belirtiniz.`)
            db.set(`botrol_kanal_${message.guild.id}`, kanal.id)
            message.reply(`Başarılı bir şekilde ${kanal} isimli kanala rol verdiğim kişileri yazıcam`)
        }

        if (args[0] == "sıfırla") {

            db.delete(`botrol_kanal_${message.guild.id}`)
            db.delete(`botrol_rol_${message.guild.id}`)
            message.reply(`Sistem başarılı bir şekilde sıfırlandı / kapatıldı.`)

        }
    },
}