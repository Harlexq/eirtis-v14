module.exports = {
        conf: {
                aliases: ["voicekick", "voice-kick"],
                name: "vkick",
                help: "Kullanıcıyı Sesli Kanaldan Atar",
                category: "ceza",
        },

        run: async (client, message, args) => {
                if (!message.guild) return;

                if (!message.member.permissions.has("MOVE_MEMBERS")) {
                        return message.reply("Üyeleri Taşıma yetkiniz yok.");
                }

                const user = message.mentions.members.first();
                if (!user) return message.reply("Lütfen bir kullanıcı etiketleyin.");

                if (!user.voice.channel) {
                        return message.reply("Bu kullanıcı bir ses kanalında değil.");
                }

                try {
                        await user.voice.disconnect();
                        return message.reply(`${user} adlı kullanıcı başarıyla sesli kanaldan atıldı.`);
                } catch (error) {
                        return message.reply("Kullanıcı atılamadı.");
                }
        },
}