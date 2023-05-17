const { EmbedBuilder, PermissionsBitField } = require("discord.js");
const db = require("nrc.db")
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["vmute-ayar", "vmutedayar", "vmuted-ayar", "voicemute-ayar", "voicemutedayar", "voicemuted-ayar"],
        name: "voicemuteayar",
        help: "Mute Sistemini Ayarlar",
        category: "ceza",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return message.reply("Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.")

        const voicemuteyardım = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
**${settings.prefix}voicemute-ayar rol** : Voice Mute atılan kişiye verilecek rolü belirtlersiniz.
**${settings.prefix}voicemute-ayar log** : Voice Mute atılınca logun tutulacağı yeri Ayarlarsınız.
**${settings.prefix}voicemute-ayar voicemute-yetkilisi** : Voice Mute atabilecek rolü Ayarlarsınız.
`)

        if (!args[1]) return message.reply({ embeds: [voicemuteyardım] })

        if (args[0] == "rol") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen bir **Voice Mute** rolü belirleyiniz`)

            db.set(`voicemute_rol_${message.guild.id}`, rol.id)

            message.reply(`Voice Mute atıldığında kişinin tüm rollerini alıp ${rol} isimli rolü vericeğim.`)
        }

        if (args[0] == "voicemute-yetkilisi") {

            let rol = message.mentions.roles.first();

            if (!rol) return message.reply(`Lütfen bir **Voice Mute Yetkilisi** rolü belirleyiniz`)

            db.set(`voicemute_yetkilirol_${message.guild.id}`, rol.id)

            message.reply(`Voice Mute Yetkilisi ${rol} Olarak Ayarlandı`)
        }


        if (args[0] == "log") {

            let kanal = message.mentions.channels.first();

            if (!kanal) return message.reply(`Lütfen bir **Voice Mute Log** kanalı belirleyiniz`)

            db.set(`voicemute_kanal_${message.guild.id}`, kanal.id)

            message.reply(`Voice Mute atıldığında artık ${kanal} isimli kanalda log tutucam`)
        }
    },
}