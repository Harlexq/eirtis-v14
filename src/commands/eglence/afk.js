const db = require("nrc.db")
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["afk"],
        name: "afk",
        help: "AFK Moduna Sokar",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let user = message.author

        let sebep = args.join(" ")

        if (!sebep) return message.reply(`<@${user.id}> \'AFK\' Olmak İçin Bir Sebep Yazmalısın ${settings.emoji.red}`)

        db.set(`afk_${user.id}`, sebep)

        return message.reply({ content: `${user} Başarıyla \'AFK\' Moduna Geçiş Yaptın Sebep : **${sebep}**` })

    },
}