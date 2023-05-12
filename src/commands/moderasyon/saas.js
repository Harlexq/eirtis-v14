const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["sa-as"],
        name: "saas",
        help: "Sa-As Sistemini Açar/Kapatır",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;
        let saas = db.fetch(`saas_${message.guild.id}`)


        if (!saas) {
            db.set(`saas_${message.guild.id}`, true)
            message.reply(`Sa As Sistemi Başarılı Bir Şekilde Aktif Edildi.`)
            return;
        }
        db.delete(`saas_${message.guild.id}`)

        message.reply(`Sa As sistemi başarılı bir şekilde kapatıldı.`)

    },
}