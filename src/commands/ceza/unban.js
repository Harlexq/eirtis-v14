const { PermissionsBitField } = require('discord.js');

module.exports = {
        conf: {
                aliases: [],
                name: "unban",
                help: "Belirtilen kişinin banını kaldırır.",
                category: "ceza",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;

                if (!message.member.permissions.has(PermissionsBitField.Flags.BanMembers)) {
                        return message.reply("Üyeleri Banla yetkiniz yok.");
                }

                const userID = args[0];

                if (!userID) {
                        return message.reply("Lütfen banı kaldırılacak kullanıcının ID'sini belirtiniz.");
                }

                message.guild.bans.fetch().then(bans => {
                        const user = bans.find(ban => ban.user.id === userID);

                        if (!user) {
                                return message.reply("Belirtilen kullanıcı banlı değil.");
                        }

                        message.guild.members.unban(user.user).then(() => {
                                message.reply({
                                        embeds: [embed
                                                .setDescription(`
                                                ${user.user.tag} Başarıyla Banı Kaldırıldı.

                                                **Banı Kaldıran Kişi:** ${message.author.toString()}
                                                `)
                                        ]
                                });
                        }).catch(err => {
                                message.reply("Bir hata oluştu.");
                        });
                }).catch(err => {
                        message.reply("Bir hata oluştu.");
                });
        }
}
