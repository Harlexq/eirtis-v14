const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = {
        conf: {
                aliases: ["uyarılar", "uyarılarım"],
                name: "warnings",
                help: "Sizin Veya Etiketlenen Kullanıcının Uyarılarını Listeler",
                category: "ceza",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;

                let user = message.member;
                if (message.mentions.members.size > 0)
                        user = message.mentions.members.first();

                let uyarilar = db.get(`${message.guild.id}_uyarilar_${user.id}`) || [];

                if (uyarilar.length === 0) {
                        return message.reply({ embeds: [embed.setDescription("Kullanıcının herhangi bir uyarısı yok.")] });
                }

                const embedsx = new EmbedBuilder()
                        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
                        .setColor("White")
                        .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
                        .setTimestamp()
                        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) })
                        .setDescription(
                                `${user} kullanıcısının toplam ${uyarilar.length} uyarısı var:`
                        );
                uyarilar.forEach((uyari, index) => {
                        embedsx.addFields({
                                name:
                                        `${index + 1}. Uyarı`, value:
                                        `• Sebep: **${uyari.sebep}**\n• Moderator: **${uyari.moderator}**\n• Tarih: **${new Date(
                                                uyari.tarih
                                        ).toLocaleDateString()}**`
                        });
                });
                message.reply({ embeds: [embedsx] });
        },
};