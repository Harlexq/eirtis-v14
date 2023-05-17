const db = require("nrc.db")
const settings = require("../../configs/settings.json")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")


module.exports = {
    conf: {
        aliases: ["vmuted", "vmute", "sustur"],
        name: "voicemute",
        help: "Etiketlenen Kullanıcıya Voice Mute Atar",
        category: "ceza",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let kontrol = db.fetch(`voicemute_rol_${message.guild.id}`)
        let kontrolkanal = db.fetch(`voicemute_kanal_${message.guild.id}`)
        let kontrolvoicemuteytkrol = db.fetch(`voicemute_yetkilirol_${message.guild.id}`)

        if (!kontrol) return message.reply(`Voice Mute Rolü Ayarlanmamış. Ayarlamak için **${settings.prefix}voicemute-ayar rol @Rol**`)
        if (!kontrolkanal) return message.reply(`Voice Mute Log Ayarlanmamış. Ayarlamak için **${settings.prefix}voicemute-ayar log #Kanal**`)
        if (!kontrolvoicemuteytkrol) return message.reply(`Voice Mute Yetkilisi Rolünü Ayarlayınız. Ayarlamak için **${settings.prefix}voicemute-ayar voicemute-yetkilisi @Yetkili** `)

        if (![kontrolvoicemuteytkrol].some(role => message.member.roles.cache.get(role)) && (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)))
            return message.reply({ content: `Bu Komudu Sadece Ayarlanan **Voice Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));

        let user = message.mentions.users.first();


        if (!user) return message.reply(`Lütfen Bir Kişi Etiketleyiniz`)

        let voicemutesebep = args.slice(1).join(" ");

        const butonlar = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('voicemute_red')
                    .setLabel('İptal')
                    .setEmoji("1086393445574262836")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('voicemute_onay')
                    .setLabel('Onayla')
                    .setEmoji("1086393444315975820")
                    .setStyle(ButtonStyle.Success),

            );

        message.reply({
            embeds: [embed.setDescription(`
        ${user}, İsimli Kişiye Voice Mute Atmak İstiyormusunz
        
        Voice Mute Sebebi: ${voicemutesebep ? voicemutesebep : "**YOK**"}
        `)], components: [butonlar]
        }).then(async function (mesaj) {

            mesaj.createMessageComponentCollector(user => user.clicker.user.id == message.author.id).on('collect', async (button) => {


                if (button.user.id !== message.author.id) return message.reply({ content: "Lütfen başkasının panelindeki butona erişmeye çalışmayın", ephemeral: true })
                let üye = message.guild.members.cache.get(user.id)
                if (button.customId === "voicemute_onay") {

                    let voicemuterol = db.fetch(`voicemute_rol_${message.guild.id}`)
                    üye.roles.set([voicemuterol])
                    mesaj.delete().catch(err => console.log(`Mesajı Silemedim Silinmiş Olabilir`))
                    message.reply(`Başarılı Bir Şekilde ${user} İsimli Kişiye Voice Mute Atıldı.`)
                }

                if (button.customId === "voicemute_red") {
                    mesaj.delete().catch(err => console.log(`Mesajı Silemedim Silinmiş Olabilir`))
                    message.reply(`Başarılı Bir Şekilde Voice Mute İptal Edildi`)
                }
            })
        })
    },
}