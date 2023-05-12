const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db")
const settings = require("../../configs/settings.json")

module.exports = {
    conf: {
        aliases: ["kayıt-ayar"],
        name: "kayıtayar",
        help: "Kayıt Sistemini Ayarlar",
        category: "kayıt",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const menu = new EmbedBuilder()
            .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
            .setDescription(`
  **${settings.prefix}hgbb** : Sunucuya Giren Ve Çıkan Kişilerin Gösterileceği Kanalı Seçer (İsteğe Bağlı)
  **${settings.prefix}kayıtayar kayıt-yetkilisi** : Kayıt yetkilisi rolünü ayarlarsınız.
  **${settings.prefix}kayıtayar erkek-rol** : Erkek üye rolünü ayarlarsınız.
  **${settings.prefix}kayıtayar kız-rol** : Kız üye rolünü ayarlarsınız.
  **${settings.prefix}kayıtayar kayıtsız-rol** : Kayıtsız rolünü ayarlarsınız.
  **${settings.prefix}kayıtayar kayıtsız-isim** : Kayıtsız ismini ayarlarsınız (İsteğe Bağlı) \`• İsim | Yaş\` olarak ayarlı
  **${settings.prefix}kayıtayar kayıt-log** : Kayıt log kanalını ayarlarsınız.
  **${settings.prefix}kayıtayar kayıt-kanal** : Kayıt kanalını ayarlarsınız.
  `)
        if (!args[0]) return message.reply({ embeds: [menu] })

        if (args[0] === "kayıt-yetkilisi") {
            let rol = message.mentions.roles.first()

            if (!rol) return message.reply(`Lütfen **Kayıt Yetkilisi** rolünü etiketleyiniz.`)
            db.set(`kayıt_yetkili_${message.guild.id}`, rol.id)
            message.reply(`Başarılı bir şekilde **Kayıt Yetkilisi** rolü ${rol} olarak ayarlandı.`)
        }

        if (args[0] === "erkek-rol") {
            let rol = message.mentions.roles.first()

            if (!rol) return message.reply(`Lütfen **Erkek** rolünü etiketleyiniz.`)
            db.set(`kayıt_erkek_rol_${message.guild.id}`, rol.id)
            message.reply(`Başarılı bir şekilde **Erkek** rolü ${rol} olarak ayarlandı.`)
        }

        if (args[0] === "kız-rol") {
            let rol = message.mentions.roles.first()

            if (!rol) return message.reply(`Lütfen **Kız** rolünü etiketleyiniz.`)
            db.set(`kayıt_kız_rol_${message.guild.id}`, rol.id)
            message.reply(`Başarılı bir şekilde **Kız** rolü ${rol} olarak ayarlandı.`)
        }

        if (args[0] === "kayıtsız-rol") {
            let rol = message.mentions.roles.first()

            if (!rol) return message.reply(`Lütfen **Kayıtsız** rolünü etiketleyiniz.`)
            db.set(`kayıt_kayıtsız_rol_${message.guild.id}`, rol.id)
            message.reply(`Başarılı bir şekilde **Kayıtsız** rolü ${rol} olarak ayarlandı.`)
        }

        if (args[0] === "kayıtsız-isim") {
            let isim = args.slice(1).join(" ");
            const kayıtsizİsim = '• İsim | Yaş';
            if (!isim) {
                db.set(`kayıt_kayıtsız_isim_${message.guild.id}`, kayıtsizİsim);
                message.reply(`Başarılı bir şekilde **Kayıtsız** ismi **${kayıtsizİsim}** olarak ayarlandı.\n\n Değiştirmek için \`e.kayıtayar kayıtsız-isim <Kayıtsız>\``);
            } else {
                db.set(`kayıt_kayıtsız_isim_${message.guild.id}`, isim);
                message.reply(`Başarılı bir şekilde **Kayıtsız** ismi **${isim}** olarak ayarlandı.`);
            }
        }

        if (args[0] === "kayıt-log") {
            let kanal = message.mentions.channels.first()

            if (!kanal) return message.reply(`Lütfen **Kayıt Log** kanalını etiketleyiniz.`)
            db.set(`kayıt_kayıt_log_${message.guild.id}`, kanal.id)
            message.reply(`Başarılı bir şekilde **Kayıt Log** kanalı ${kanal} olarak ayarlandı.`)
        }

        if (args[0] === "kayıt-kanal") {
            let kanal = message.mentions.channels.first()

            if (!kanal) return message.reply(`Lütfen **Kayıt Kanal** kanalını etiketleyiniz.`)
            db.set(`kayıt_kayıt_kanal_${message.guild.id}`, kanal.id)
            message.reply(`Başarılı bir şekilde **Kayıt Kanal** kanalı ${kanal} olarak ayarlandı.`)
        }
    },
}