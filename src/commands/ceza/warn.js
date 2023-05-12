const db = require("nrc.db")

module.exports = {
        conf: {
                aliases: ["uyarı"],
                name: "warn",
                help: "Etiketlenen Kullanıcıyı DM'den Uyarır",
                category: "ceza",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;

                if (!message.member.permissions.has("KICK_MEMBERS") && !message.member.permissions.has("BAN_MEMBERS")) {
                        return message.reply("Uyarı yetkiniz yok.");
                }

                const user = message.mentions.members.first();
                if (!user) {
                        return message.reply("Lütfen bir kullanıcı etiketleyin.");
                }

                let reason = args.slice(1).join(" ");
                if (!reason) {
                        reason = "Sebep belirtilmedi.";
                }

                try {
                        await user.send({
                                embeds: [embed.setTitle(`Sunucudan Uyarıldınız`)
                                        .setDescription(`**${message.guild.name}** sunucusunda uyarıldınız.`)
                                        .addFields({ name: "Sebep", value: reason || "Belirtilmedi" })]
                        });
                } catch (error) {
                        message.reply("Kullanıcının DM kutusu kapalı veya uyarılamadı.");
                }

                let uyarilar = db.get(`${message.guild.id}_uyarilar_${user.id}`) || [];
                uyarilar.push({
                        sebep: reason,
                        moderator: message.author.tag,
                        tarih: new Date().getTime()
                });
                db.set(`${message.guild.id}_uyarilar_${user.id}`, uyarilar);

                const uyarilarCount = uyarilar.length;

                message.reply({
                        embeds: [embed.setTitle(`Uyarı`)
                                .setDescription(`${user} kullanıcısı uyarıldı.`)
                                .addFields({ name: "Sebep", value: reason || "Belirtilmedi" })
                                .addFields({ name: "Uyarı Sayısı", value: uyarilarCount.toString() })
                        ]
                });
        },
}
