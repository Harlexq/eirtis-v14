const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, PermissionsBitField } = require("discord.js");

module.exports = {
    conf: {
        aliases: ["unjail"],
        name: "unjail",
        help: "Etiketlenen Kullanıcının Jailini Kaldırır",
        category: "ceza",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;
        let kontrol = db.fetch(`jail_rol_${message.guild.id}`);
        let kontrolkanal = db.fetch(`jail_kanal_${message.guild.id}`);
        let kontroljailytkrol = db.fetch(`jail_yetkilirol_${message.guild.id}`);

        if (!kontrol)
            return message.reply(
                `Jail Rolü Ayarlanmamış. Ayarlamak için **${settings.prefix}jail-ayar rol @Rol**`
            );
        if (!kontrolkanal)
            return message.reply(
                `Jail Log Ayarlanmamış. Ayarlamak için **${settings.prefix}jail-ayar log #Kanal**`
            );
        if (!kontroljailytkrol)
            return message.reply(
                `Jail Yetkilisi Rolünü Ayarlayınız. Ayarlamak için **${settings.prefix}jail-ayar jail-yetkilisi @Yetkili** `
            );

        if (
            ![kontroljailytkrol].some((role) =>
                message.member.roles.cache.get(role)
            ) &&
            !message.member.permissions.has(PermissionsBitField.Flags.Administrator)
        )
            return message
                .reply({
                    content:
                        "Bu Komudu Sadece Ayarlanan **Jail Yetkilisi** Veya Sunucuyu Yönet Yetkisine Sahip Olan Kişiler Kullanabilir",
                })
                .then((e) => setTimeout(() => e.delete(), 5000));

        let user = message.mentions.users.first();

        if (!user) return message.reply("Lütfen bir kişi etiketleyiniz");

        const butonlar = new ActionRowBuilder().addComponents(
            new ButtonBuilder()
                .setCustomId("unjail_red")
                .setLabel("İptal")
                .setEmoji("1086393445574262836")
                .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
                .setCustomId("unjail_onay")
                .setLabel("Onayla")
                .setEmoji("1086393444315975820")
                .setStyle(ButtonStyle.Success)
        );

        const msgbutton = await message.reply({
            embeds: [embed.setDescription(`${user}, İsimli Kişinin Jailini Kaldırmak İstediğinize emin misiniz?`)],
            components: [butonlar],
        });

        const collector = message.channel.createMessageComponentCollector({
            filter: (button) => button.user.id === message.author.id,
            time: 99000,
        });

        collector.on("collect", async (button) => {
            if (button.customId === "unjail_onay") {
                const jailrol = message.guild.roles.cache.find(
                    (r) => r.id === kontrol
                );
                if (!jailrol)
                    return message.reply({
                        content: "Jail Rolü ayarlı değil",
                    });

                let logkanal = message.guild.channels.cache.get(kontrolkanal);
                if (!logkanal)
                    return message.reply({
                        content: "Jail Log kanalı ayarlı değil",
                    });

                try {
                    let member = message.guild.members.cache.get(user.id);
                    member.roles.remove(jailrol.id);
                    logkanal.send({
                        embeds: [embed.setDescription(
                            `Jaili Kaldırılan Kullanıcı: ${user}\nJail Yetkilisi: ${message.author}\nSebep: Komutla Kaldırıldı`
                        )]
                    });
                    msgbutton.delete();
                    message.reply({
                        content: `Başarıyla ${user} adlı kullanıcının jaili kaldırıldı.`,
                        ephemeral: true,
                    });
                } catch (err) {
                    msgbutton.delete();
                    button.reply({
                        content: `Bir hata oluştu: ${err.message}`,
                        ephemeral: true,
                    });
                }
            } else if (button.customId === "unjail_red") {
                msgbutton.delete();
                button.reply({
                    content: "İşlem iptal edildi.",
                    ephemeral: true,
                });
            }
        });
    },
};