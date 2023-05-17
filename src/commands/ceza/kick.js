const { PermissionsBitField } = require("discord.js");
module.exports = {
        conf: {
                aliases: ["kick"],
                name: "at",
                help: "Etiketlenen Kişiyi Sunucudan Atar",
                category: "ceza",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;
                if (!message.member.permissions.has(PermissionsBitField.Flags.KickMembers)) return message.reply("Üyeleri Atma Yetkiniz Yok.")

                let user = message.mentions.users.first();
                let sebep = args[1]


                if (!user) return message.reply("Lütfen Atılacak Kişiyi Belirtiniz.")
                if (!sebep) return message.reply("Lütfen Sebep Belirtiniz")


                const üye = message.guild.members.cache.get(user.id)

                üye.kick({ reason: sebep })

                message.reply({
                        embeds: [embed.setDescription(`
                ${user}, Başarılı Bir Şekilde Sunucudan Atıldı

                **Atılma sebebi:** ${sebep}`)]
                })

        },
}