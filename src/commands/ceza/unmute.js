const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["un-mute"],
        name: "unmute",
        help: "Etiketlenen Kullanıcının Mutesini Kaldırır",
        category: "ceza",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;
        let kontrol = db.fetch(`mute_rol_${message.guild.id}`);
        let kontrolkanal = db.fetch(`mute_kanal_${message.guild.id}`);
        let kontrolmuteytkrol = db.fetch(`mute_yetkilirol_${message.guild.id}`);

        if (!kontrol)
            return message.reply(
                `Mute Rolü Ayarlanmamış. Ayarlamak için **${settings.prefix}mute-ayar rol @Rol**`
            );
        if (!kontrolkanal)
            return message.reply(
                `Mute Log Ayarlanmamış. Ayarlamak için **${settings.prefix}mute-ayar log #Kanal**`
            );
        if (!kontrolmuteytkrol)
            return message.reply(
                `Mute Yetkilisi Rolünü Ayarlayınız. Ayarlamak için **${settings.prefix}mute-ayar mute-yetkilisi @Yetkili** `
            );

        if (
            ![kontrolmuteytkrol].some((role) =>
                message.member.roles.cache.get(role)
            ) &&
            !message.member.permissions.has("ADMINISTRATOR")
        )
            return message
                .reply({
                    content:
                        "Bu Komudu Sadece Ayarlanan **Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir",
                })
                .then((e) => setTimeout(() => e.delete(), 5000));

        let user = message.mentions.users.first();

        if (!user) return message.reply("Lütfen bir kişi etiketleyiniz");

        const butonlar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("unmute_red")
                .setLabel("İptal")
                .setEmoji("1086393445574262836")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("unmute_onay")
                .setLabel("Onayla")
                .setEmoji("1086393444315975820")
                .setStyle(ButtonStyle.Success)
        );

        const msgbutton = await message.reply({
            embeds: [embed.setDescription(`${user}, İsimli Kişinin Mutesini Kaldırmak İstediğinize emin misiniz?`)],
            components: [butonlar],
        });

        const collector = message.channel.createMessageComponentCollector({
            filter: (button) => button.user.id === message.author.id,
            time: 99000,
        });

        collector.on("collect", async (button) => {
            if (button.customId === "unmute_onay") {
                const muterol = message.guild.roles.cache.find(
                    (r) => r.id === kontrol
                );
                if (!muterol)
                    return message.reply({
                        content: "Mute Rolü ayarlı değil",
                    });

                let logkanal = message.guild.channels.cache.get(kontrolkanal);
                if (!logkanal)
                    return message.reply({
                        content: "Mute Log kanalı ayarlı değil",
                    });

                try {
                    let member = message.guild.members.cache.get(user.id);
                    member.roles.remove(muterol.id);
                    logkanal.send({
                        embeds: [embed.setDescription(
                            `Mutesi Kaldırılan Kullanıcı: ${user}\nMute Yetkilisi: ${message.author}\nSebep: Komutla Kaldırıldı`
                        )]
                    });
                    msgbutton.delete();
                    message.reply({
                        content: `Başarıyla ${user} adlı kullanıcının mutesi kaldırıldı.`,
                        ephemeral: true,
                    });
                } catch (err) {
                    msgbutton.delete();
                    button.reply({
                        content: `Bir hata oluştu: ${err.message}`,
                        ephemeral: true,
                    });
                }
            } else if (button.customId === "unmute_red") {
                msgbutton.delete();
                button.reply({
                    content: "İşlem iptal edildi.",
                    ephemeral: true,
                });
            }
        });
    },
};