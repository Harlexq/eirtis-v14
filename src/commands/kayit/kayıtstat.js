const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["kayıt-bilgi", "kayıt-stat"],
        name: "kayıtstat",
        help: "Kayıt Yetkilisinin İstatistiklerini Gösterir",
        category: "kayıt",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;
        let kayıt_ytk = db.fetch(`kayıt_yetkili_${message.guild.id}`);
        let kayıt_erkek = db.fetch(`kayıt_erkek_rol_${message.guild.id}`);
        let kayıt_kız = db.fetch(`kayıt_kız_rol_${message.guild.id}`);
        let kayıtsız = db.fetch(`kayıt_kayıtsız_rol_${message.guild.id}`);
        let kayıt_log = db.fetch(`kayıt_kayıt_log_${message.guild.id}`);
        let kayıt_kanal = db.fetch(`kayıt_kayıt_kanal_${message.guild.id}`);

        if (!kayıt_ytk) return message.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`);
        if (![kayıt_ytk].some(role => message.member.roles.cache.get(role)) && (!message.member.permissions.has("ADMINISTRATOR")))
            return message.reply({ content: `Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (!kayıt_erkek) return message.reply(`**Erkek** rolü ayarlanmamış.`);
        if (!kayıt_kız) return message.reply(`**Kız** rolü ayarlanmamış.`);
        if (!kayıtsız) return message.reply(`**Kayıtsız** rolü ayarlanmamış.`);
        if (!kayıt_log) return message.reply(`**Kayıt Log** kanalı ayarlanmamış.`);
        if (!kayıt_kanal) return message.reply(`**Kayıt** kanalı ayarlanmamış.`);

        let member = message.mentions.users.first() || message.author;
        let kayıt = db.fetch(`kayıt_yetkili_${message.guild.id}_${member.id}`);

        message.reply({
            embeds: [embed.setTitle("Kayıt İstatistikleri")
                .setDescription(`Kayıt İşlemlerini Yapan Kişi: ${member}\nYaptığı Kayıt Sayısı: **${kayıt ? kayıt : "0"}**`)]
        });
    },
};
