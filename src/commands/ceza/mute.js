const db = require("nrc.db")
const settings = require("../../configs/settings.json")
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js")


module.exports = {
    conf: {
        aliases: ["muted", "chatsustur"],
        name: "mute",
        help: "Etiketlenen Kullanıcıya Chat Mute Atar",
        category: "ceza",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let kontrol = db.fetch(`mute_rol_${message.guild.id}`)
        let kontrolkanal = db.fetch(`mute_kanal_${message.guild.id}`)
        let kontrolmuteytkrol = db.fetch(`mute_yetkilirol_${message.guild.id}`)


        if (!kontrol) return message.reply(`Mute Rolü Ayarlanmamış. Ayarlamak için **${settings.prefix}mute-ayar rol @Rol**`)
        if (!kontrolkanal) return message.reply(`Mute Log Ayarlanmamış. Ayarlamak için **${settings.prefix}mute-ayar log #Kanal**`)
        if (!kontrolmuteytkrol) return message.reply(`Mute Yetkilisi Rolünü Ayarlayınız. Ayarlamak için **${settings.prefix}mute-ayar mute-yetkilisi @Yetkili** `)

        if (![kontrolmuteytkrol].some(role => message.member.roles.cache.get(role)) && (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)))
            return message.reply({ content: `Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir` }).then((e) => setTimeout(() => { e.delete(); }, 5000));

        let user = message.mentions.users.first();


        if (!user) return message.reply(`Lütfen Bir Kişi Etiketleyiniz`)

        let mutesebep = args.slice(1).join(" ");

        const butonlar = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('mute_red')
                    .setLabel('İptal')
                    .setEmoji("1086393445574262836")
                    .setStyle(ButtonStyle.Danger),
                new ButtonBuilder()
                    .setCustomId('mute_onay')
                    .setLabel('Onayla')
                    .setEmoji("1086393444315975820")
                    .setStyle(ButtonStyle.Success),

            );

        message.reply({
            embeds: [embed.setDescription(`
        ${user}, İsimli Kişiye Mute Atmak İstiyormusunz
        
        Mute Sebebi: ${mutesebep ? mutesebep : "**YOK**"}
        `)], components: [butonlar]
        }).then(async function (mesaj) {

            mesaj.createMessageComponentCollector(user => user.clicker.user.id == message.author.id).on('collect', async (button) => {


                if (button.user.id !== message.author.id) return message.reply({ content: "Lütfen başkasının panelindeki butona erişmeye çalışmayın", ephemeral: true })
                let üye = message.guild.members.cache.get(user.id)
                if (button.customId === "mute_onay") {

                    let muterol = db.fetch(`mute_rol_${message.guild.id}`)
                    üye.roles.set([muterol])
                    mesaj.delete().catch(err => console.log(`Mesajı Silemedim Silinmiş Olabilir`))
                    message.reply(`Başarılı Bir Şekilde ${user} İsimli Kişiye Mute Atıldı.`)
                }

                if (button.customId === "mute_red") {
                    mesaj.delete().catch(err => console.log(`Mesajı Silemedim Silinmiş Olabilir`))
                    message.reply(`Başarılı Bir Şekilde Mute İptal Edildi`)
                }
            })
        })
    },
}