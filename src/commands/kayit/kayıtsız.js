const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");
const db = require("nrc.db")

module.exports = {
    conf: {
        aliases: ["kayitsiz"],
        name: "kayıtsız",
        help: "Etiketlenen Kişiyi Kayıtsız Rolüne Atar",
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
        let kayıtsizİsim = db.fetch(`kayıt_kayıtsız_isim_${message.guild.id}`) || '• İsim | Yaş';

        if (!kayıt_ytk) return message.reply(`**Kayıt Yetkilisi** rolü ayarlanmamış.`)
        if (![kayıt_ytk].some(role => message.member.roles.cache.get(role)) && (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)))
            return message.reply({ content: `Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
        if (!kayıt_erkek) return message.reply(`**Erkek** rolü ayarlanmamış.`)
        if (!kayıt_kız) return message.reply(`**Kız** rolü ayarlanmamış.`)
        if (!kayıtsız) return message.reply(`**Kayıtsız** rolü ayarlanmamış.`)
        if (!kayıt_log) return message.reply(`**Kayıt Log** kanalı ayarlanmamış.`)
        if (!kayıt_kanal) return message.reply(`**Kayıt** kanalı ayarlanmamış.`)

        let member = message.mentions.members.first()
        if (!member) return message.reply(`Lütfen kayıtsıza düşürülecek kişiyi etiketleyiniz.`)

        let üye = message.guild.members.cache.get(member.id)

        if (üye.roles.cache.has(kayıtsız)) return message.reply("Bu kullanıcı zaten kayıtsızda.");

        await üye.roles.add(kayıtsız);
        await üye.setNickname(kayıtsizİsim);
        await üye.roles.remove(kayıt_erkek);
        await üye.roles.remove(kayıt_kız);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId("kayitsizadüstü")
                    .setLabel("Kayıtsıza Düşürüldü")
                    .setStyle(ButtonStyle.Secondary)
                    .setEmoji("1086393444315975820")
                    .setDisabled(true)
            );

        message.reply({
            embeds: [embed.setDescription(`
        Kayıtsıza düşürülen kişinin bilgileri;
        
        Düşürülen kişi : ${member}
        
        Kayıt yetkilisin bilgileri;
        Kayıtsız yapan kişi : ${message.author}
        `)], components: [row]
        })
        client.channels.cache.get(kayıt_log).send({
            embeds: [embed.setDescription(`
        Kayıtsıza düşürülen kişinin bilgileri;
        
        Düşürülen kişi : ${member}
        
        Kayıt yetkilisin bilgileri;
        Kayıtsız yapan kişi : ${message.author}
        `)], components: [row]
        })
    },
}