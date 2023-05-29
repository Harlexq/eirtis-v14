const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["unvoice-mute"],
        name: "unvoicemute",
        help: "Kullanıcının Voice Mutesini Kaldırır",
        category: "ceza",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;
        let kontrol = db.fetch(`voicemute_rol_${message.guild.id}`);
        let kontrolkanal = db.fetch(`voicemute_kanal_${message.guild.id}`);
        let kontrolvoicemuteytkrol = db.fetch(`voicemute_yetkilirol_${message.guild.id}`);

        if (!kontrol)
            return message.reply(
                `Voice Mute Rolü Ayarlanmamış. Ayarlamak için **${settings.prefix}voicemute-ayar rol @Rol**`
            );
        if (!kontrolkanal)
            return message.reply(
                `Voice Mute Log Ayarlanmamış. Ayarlamak için **${settings.prefix}voicemute-ayar log #Kanal**`
            );
        if (!kontrolvoicemuteytkrol)
            return message.reply(
                `Voice Mute Yetkilisi Rolünü Ayarlayınız. Ayarlamak için **${settings.prefix}voicemute-ayar voicemute-yetkilisi @Yetkili** `
            );

        if (
            ![kontrolvoicemuteytkrol].some((role) =>
                message.member.roles.cache.get(role)
            ) &&
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
        )
            return message
                .reply({
                    content:
                        "Bu Komudu Sadece Ayarlanan **Voice Mute Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir",
                })
                .then((e) => setTimeout(() => e.delete(), 5000));

        let user = message.mentions.users.first();

        if (!user) return message.reply("Lütfen bir kişi etiketleyiniz");

        const butonlar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("unvoicemute_red")
                .setLabel("İptal")
                .setEmoji("1086393445574262836")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("unvoicemute_onay")
                .setLabel("Onayla")
                .setEmoji("1086393444315975820")
                .setStyle(ButtonStyle.Success)
        );

        const msgbutton = await message.reply({
            embeds: [embed.setDescription(`${user}, İsimli Kişinin Voice Mutesini Kaldırmak İstediğinize emin misiniz?`)],
            components: [butonlar],
        });

        const collector = message.channel.createMessageComponentCollector({
            filter: (button) => button.user.id === message.author.id,
            time: 99000,
        });

        collector.on("collect", async (button) => {
            if (button.customId === "unvoicemute_onay") {
                const voicemuterol = message.guild.roles.cache.find(
                    (r) => r.id === kontrol
                );
                if (!voicemuterol)
                    return message.reply({
                        content: "Voice Mute Rolü ayarlı değil",
                    });

                let logkanal = message.guild.channels.cache.get(kontrolkanal);
                if (!logkanal)
                    return message.reply({
                        content: "Voice Mute Log kanalı ayarlı değil",
                    });

                try {
                    let member = message.guild.members.cache.get(user.id);
                    member.roles.remove(voicemuterol.id);
                    logkanal.send({
                        embeds: [embed.setDescription(
                            `Voice Mutesi Kaldırılan Kullanıcı: ${user}\nVoice Mute Yetkilisi: ${message.author}\nSebep: Komutla Kaldırıldı`
                        )]
                    });
                    msgbutton.delete();
                    message.reply({
                        content: `Başarıyla ${user} adlı kullanıcının Voice Mutesi kaldırıldı.`,
                        ephemeral: true,
                    });
                } catch (err) {
                    msgbutton.delete();
                    button.reply({
                        content: `Bir hata oluştu: ${err.message}`,
                        ephemeral: true,
                    });
                }
            } else if (button.customId === "unvoicemute_red") {
                msgbutton.delete();
                button.reply({
                    content: "İşlem iptal edildi.",
                    ephemeral: true,
                });
            }
        });
    },
};