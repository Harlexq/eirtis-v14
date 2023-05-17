const { PermissionsBitField } = require('discord.js');

module.exports = {
        conf: {
                aliases: ["taşı", "tası"],
                name: "move",
                help: "Kullanıcıyı Başka Bir Sesli Kanala Taşır",
                category: "ceza",
        },

        run: async (client, message, args) => {
                if (!message.guild) return;

                if (!message.member.permissions.has(PermissionsBitField.Flags.MoveMembers)) {
                        return message.reply("Üyeleri Taşıma yetkiniz yok.");
                }

                const user = message.mentions.members.first();
                if (!user) return message.reply("Lütfen bir kullanıcı etiketleyin.");

                const channel = message.mentions.channels.first();
                if (!channel) return message.reply("Lütfen bir sesli kanal etiketleyin.");

                if (!user.voice.channel) {
                        return message.reply("Bu kullanıcı bir ses kanalında değil.");
                }

                try {
                        await user.voice.setChannel(channel);
                        return message.reply(`${user} adlı kullanıcı başarıyla ${channel} adlı kanala taşındı.`);
                } catch (error) {
                        return message.reply("Kullanıcı taşınamadı.");
                }
        },
}
