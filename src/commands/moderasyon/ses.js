const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');

module.exports = {
    conf: {
        aliases: ["ses"],
        name: "ses",
        help: "Etiketlediğiniz Ses Kanalına Botu Sokar",
        category: "moderasyon",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        if (!message.member.permissions.has("ADMINISTRATOR"))
            return message.reply(
                "Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte."
            );

        const voiceChannel = message.member.voice.channel;

        if (args[0] === "ekle") {
            const targetVoiceChannel =
                message.guild.channels.cache.get(args[1]) || voiceChannel;

            if (!targetVoiceChannel)
                return message.reply("Geçerli bir ses kanalı bulunamadı.");

            try {
                const connection = getVoiceConnection(message.guild.id);
                if (connection) await connection.destroy();
                const voiceConnection = await joinVoiceChannel({
                    channelId: targetVoiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                });
                message.reply(`Bot, ${targetVoiceChannel} kanalına başarıyla bağlandı!`);
            } catch (error) {
                message.reply(`Bir hata oluştu: ${error.message}`);
            }
        } else if (args[0] === 'çıkar') {
            try {
                const connection = getVoiceConnection(message.guild.id);
                if (connection) {
                    await connection.destroy();
                    message.reply(`Bot, kanaldan ayrıldı!`);
                } else {
                    message.reply('Bot zaten bir ses kanalında değil!');
                }
            } catch (error) {
                message.reply(`Bir hata oluştu: ${error.message}`);
            }
        }
    },
};