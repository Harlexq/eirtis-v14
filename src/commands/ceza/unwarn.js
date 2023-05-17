const db = require("nrc.db");
const { PermissionsBitField } = require('discord.js');

module.exports = {
        conf: {
                aliases: ["unuyarı"],
                name: "unwarn",
                help: "Kullanının Tüm Uyarılarını Kaldırır",
                category: "ceza",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;

                if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers) && !message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                        return message.reply("Uyarı yetkiniz yok.");
                }

                const user = message.mentions.members.first();
                if (!user) {
                        return message.reply("Lütfen bir kullanıcı etiketleyin.");
                }

                const uyarilar = db.get(`${message.guild.id}_uyarilar_${user.id}`);
                if (!uyarilar || uyarilar.length == 0) {
                        return message.reply("Bu kullanıcının hiç uyarısı yok.");
                }

                db.delete(`${message.guild.id}_uyarilar_${user.id}`);

                message.reply({
                        embeds: [embed.setTitle(`Uyarı Kaldırıldı`)
                                .setDescription(`${user} kullanıcısının tüm uyarıları kaldırıldı.`)]
                });
        },
}
