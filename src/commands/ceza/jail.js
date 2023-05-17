const db = require("nrc.db")
const settings = require("../../configs/settings.json")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")


module.exports = {
    conf: {
        aliases: ["jailed", "karantina", "ceza", "cezalı", "cezali"],
        name: "jail",
        help: "Etiketlenen Kullanıcıyı Jaile Atar",
        category: "ceza",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let kontrol = db.fetch(`jail_rol_${message.guild.id}`)
        let kontrolkanal = db.fetch(`jail_kanal_${message.guild.id}`)
        let kontroljailytkrol = db.fetch(`jail_yetkilirol_${message.guild.id}`)


        if (!kontrol) return message.reply(`Jail Rolü Ayarlanmamış. Ayarlamak için **${settings.prefix}jail-ayar rol @Rol**`)
        if (!kontrolkanal) return message.reply(`Jail Log Ayarlanmamış. Ayarlamak için **${settings.prefix}jail-ayar log #Kanal**`)
        if (!kontroljailytkrol) return message.reply(`Jail Yetkilisi Rolünü Ayarlayınız. Ayarlamak için **${settings.prefix}jail-ayar jail-yetkilisi @Yetkili** `)

        if (![kontroljailytkrol].some(role => message.member.roles.cache.get(role)) && (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)))
            return message.reply({ content: `Bu Komudu Sadece Ayarlanan **Jail Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));

        let user = message.mentions.users.first();

        if (!user) return message.reply(`Lütfen Bir Kişi Etiketleyiniz`)

        let jailsebep = args.slice(1).join(" ");

        const butonlar = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('jail_red')
                    .setLabel('İptal')
                    .setEmoji("1086393445574262836")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('jail_onay')
                    .setLabel('Onayla')
                    .setEmoji("1086393444315975820")
                    .setStyle(ButtonStyle.Success),
            );

        message.reply({
            embeds: [embed.setDescription(`
        ${user}, İsimli Kişiye Jail Atmak İstiyormusunz

        Jail Sebebi: ${jailsebep ? jailsebep : "**YOK**"}
        `)], components: [butonlar]
        }).then(async function (mesaj) {

            mesaj.createMessageComponentCollector(user => user.clicker.user.id == message.author.id).on('collect', async (button) => {


                if (button.user.id !== message.author.id) return message.reply({ content: "Lütfen başkasının panelindeki butona erişmeye çalışmayın", ephemeral: true })
                let üye = message.guild.members.cache.get(user.id)
                if (button.customId === "jail_onay") {
                    let jailrol = db.fetch(`jail_rol_${message.guild.id}`)
                    üye.roles.set([jailrol])
                    mesaj.delete().catch(err => console.log(`Mesajı Silemedim Silinmiş Olabilir`))
                    message.reply(`Başarılı Bir Şekilde ${user} İsimli Kişiye Jail Atıldı.`)
                }

                if (button.customId === "jail_red") {
                    mesaj.delete().catch(err => console.log(`Mesajı Silemedim Silinmiş Olabilir`))
                    message.reply(`Başarılı Bir Şekilde Jail İptal Edildi`)
                }
            })
        })
    },
}