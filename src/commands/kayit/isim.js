const db = require("nrc.db")
const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["name"],
        name: "isim",
        help: "Etiketlenen Kişinin İsmini Değiştirir",
        category: "kayıt",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let kayıt_ytk = db.fetch(`kayıt_yetkili_${message.guild.id}`)
        let kayıt_erkek = db.fetch(`kayıt_erkek_rol_${message.guild.id}`)
        let kayıt_kız = db.fetch(`kayıt_kız_rol_${message.guild.id}`)
        let kayıtsız = db.fetch(`kayıt_kayıtsız_rol_${message.guild.id}`)
        let kayıt_log = db.fetch(`kayıt_kayıt_log_${message.guild.id}`)
        let kayıt_kanal = db.fetch(`kayıt_kayıt_kanal_${message.guild.id}`)


        if (!kayıt_ytk) return message.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
        if (![kayıt_ytk].some(role => message.member.roles.cache.get(role)) && (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)))
            return message.reply({ content: `Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (!kayıt_erkek) return message.reply(`**Erkek** rolü ayarlanmamış.`)
        if (!kayıt_kız) return message.reply(`**Kız** rolü ayarlanmamış.`)
        if (!kayıtsız) return message.reply(`**Kayıtsız** rolü ayarlanmamış.`)
        if (!kayıt_log) return message.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
        if (!kayıt_kanal) return message.reply(`**Kayıt** kanalı ayarlanmamış.`)


        let member = message.mentions.members.first()
        let isim = args[1]
        let yas = args[2]

        if (!member) return message.reply(`Lütfen İsmi Değiştirlecek kişiyi Belirtiniz.`)
        if (!isim) return message.reply(`Yeni Adını belirtiniz.`)
        if (!yas) return message.reply(`Yeni Yaşını belirtiniz.`)

        let üye = message.guild.members.cache.get(member.id)

        if (!üye.roles || üye.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply("Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.");
        }

        if (!message.member.roles || member.roles.highest.position >= message.member.roles.highest.position) {
            return message.reply("Belirttiğiniz kişi botun yetkisiyle aynı veya daha üst bir yetkiye sahip.");
        }

        await üye.setNickname(`${isim} | ${yas}`);

        message.reply({
            embeds: [embed.setDescription(`
        İsmi Değiştirilen Kişi: ${member}
        
        Yeni İsmi: **${isim}**
        Yeni Yaşı : **${yas}**
        
        Kayıt yetkilisin bilgileri;
        Kayıtsız yapan kişi : ${message.author}
        `)]
        })
        client.channels.cache.get(kayıt_log).send({
            embeds: [embed.setDescription(`
        İsmi Değiştirilen Kişi: ${member}
        
        Yeni İsmi: **${isim}**
        Yeni Yaşı : **${yas}**
        
        Kayıt yetkilisin bilgileri;
        Kayıtsız yapan kişi : ${message.author}
        `)]
        })

    },
}