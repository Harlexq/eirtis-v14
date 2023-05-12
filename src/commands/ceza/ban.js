module.exports = {
        conf: {
                aliases: ["yargı"],
                name: "ban",
                help: "Etiketlenen Kişiyi Sunucudan Banlar",
                category: "ceza",
        },

        run: async (client, message, args, embed) => {
                if (!message.guild) return;

                if (!message.member.permissions.has("BAN_MEMBERS")) {
                        return message.reply("Üyeleri Banla yetkiniz yok.");
                }

                const user = message.mentions.users.first();
                const sebep = args.slice(1).join(" ");

                if (!user) {
                        return message.reply("Lütfen banlanacak kişiyi belirtiniz.");
                }

                if (!sebep) {
                        return message.reply("Lütfen banlama sebebini belirtiniz.");
                }

                const member = message.mentions.members.first();

                if (!member) {
                        return message.reply("Belirtilen kullanıcı sunucuda bulunamadı.");
                }

                if (!member.bannable) {
                        return message.reply("Bu kişiyi banlayamam. Botumun yetkisi banlama işlemi için yeterli değil.");
                }

                if (member.id === message.author.id) {
                        return message.reply("Kendinizi banlayamazsınız.");
                }

                if (member.id === client.user.id) {
                        return message.reply("Beni banlayamazsınız.");
                }

                if (!member.roles || member.roles.highest.position >= message.member.roles.highest.position) {
                        return message.reply("Belirttiğiniz kişi sizinle aynı yetkiye sahip veya sizden daha yetkili.");
                }

                if (!message.member.roles || member.roles.highest.position >= message.member.roles.highest.position) {
                        return message.reply("Belirttiğiniz kişi botun yetkisiyle aynı veya daha üst bir yetkiye sahip.");
                }

                await member.ban({ sebep: sebep });

                message.reply({
                        embeds: [embed
                                .setDescription(`
                                ${member} Başarıyla Banlandı

                                **Banlayan Kişi:** ${message.author.toString()}

                                **Sebep:** ${sebep}
                                `)
                        ]
                });

        },
}