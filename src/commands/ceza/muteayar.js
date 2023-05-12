const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db")
const settings = require("../../configs/settings.json")


module.exports = {
    conf: {
        aliases: ["mute-ayar", "mutedayar", "muted-ayar"],
        name: "muteayar",
        help: "Mute Sistemini Ayarlar",
        category: "ceza",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has("ADMINISTRATOR")) return message.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")

        const muteyardım = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
**${settings.prefix}mute-ayar rol** : Mute atılan kişiye verilecek rolü belirtlersiniz.
**${settings.prefix}mute-ayar log** : Mute atılınca logun tutulacağı yeri Ayarlarsınız.
**${settings.prefix}mute-ayar mute-yetkilisi** : Mute atabilecek rolü Ayarlarsınız.
`)


        if (!args[1]) return message.reply({ embeds: [muteyardım] })

        if (args[0] == "rol") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen bir **Mute** rolü belirleyiniz`)

            db.set(`mute_rol_${message.guild.id}`, rol.id)

            message.reply(`Mute atıldığında kişinin tüm rollerini alıp ${rol} isimli rolü vericeğim.`)
        }

        if (args[0] == "mute-yetkilisi") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen bir **Mute Yetkilisi** rolü belirleyiniz`)

            db.set(`mute_yetkilirol_${message.guild.id}`, rol.id)

            message.reply(`Mute Yetkilisi ${rol} Olarak Ayarlandı`)
        }


        if (args[0] == "log") {

            let kanal = message.mentions.channels.first();

            if (!kanal) return message.reply(`Lütfen bir **Mute Log** kanalı belirleyiniz`)

            db.set(`mute_kanal_${message.guild.id}`, kanal.id)

            message.reply(`Mute atıldığında artık ${kanal} isimli kanalda log tutucam`)
        }
    },
}