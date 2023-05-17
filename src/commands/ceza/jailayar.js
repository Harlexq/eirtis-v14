const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("nrc.db")
const settings = require("../../configs/settings.json")


module.exports = {
    conf: {
        aliases: ["jail-ayar"],
        name: "jailayar",
        help: "Jail Sistemini Ayarlar",
        category: "ceza",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")

        const jailyardım = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
**${settings.prefix}jail-ayar rol** : Jail atılan kişiye verilecek rolü belirtlersiniz.
**${settings.prefix}jail-ayar log** : Jail atılınca logun tutulacağı yeri Ayarlarsınız.
**${settings.prefix}jail-ayar jail-yetkilisi** : Jail atabilecek rolü Ayarlarsınız.
`)


        if (!args[1]) return message.reply({ embeds: [jailyardım] })

        if (args[0] == "rol") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen bir **Jail** rolü belirleyiniz`)

            db.set(`jail_rol_${message.guild.id}`, rol.id)

            message.reply(`Jail atıldığında kişinin tüm rollerini alıp ${rol} isimli rolü vericeğim.`)
        }

        if (args[0] == "jail-yetkilisi") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen bir **Jail Yetkilisi** rolü belirleyiniz`)

            db.set(`jail_yetkilirol_${message.guild.id}`, rol.id)

            message.reply(`Jail Yetkilisi ${rol} Olarak Ayarlandı`)
        }

        if (args[0] == "log") {

            let kanal = message.mentions.channels.first();

            if (!kanal) return message.reply(`Lütfen bir **Jail Log** kanalı belirleyiniz`)

            db.set(`jail_kanal_${message.guild.id}`, kanal.id)

            message.reply(`Jail atıldığında artık ${kanal} isimli kanalda log tutucam`)
        }
    },
}