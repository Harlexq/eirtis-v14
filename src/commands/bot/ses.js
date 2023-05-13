const { joinVoiceChannel, getVoiceConnection } = require('@discordjs/voice');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const db = require("nrc.db");

module.exports = {
    conf: {
        aliases: ["ses"],
        name: "ses",
        help: "Etiketlediğiniz Ses Kanalına Botu Sokar",
        category: "bot",
    },

    run: async (client, message, args) => {
        if (!message.guild) return;

        const rows = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Link)
                    .setLabel("Premium Üye Ol")
                    .setURL("https://discord.com/users/801069133810237491")
            );

        const premiumUserID = "801069133810237491";

        if (message.author.id !== premiumUserID && !db.get(`premium_${message.author.id}`)) {
            return message.reply({ content: "Bu komutu sadece premium üyeler kullanabilir sende premium üye olmak istersen aşağıdaki butona basarak iletişime geçebilirsin", components: [rows] });
        }

        if (!message.member.permissions.has("ADMINISTRATOR"))
            return message.reply(
                "Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte."
            );

        const voiceChannel = message.member.voice.channel;

        if (args[0] === "ekle") {
            const targetVoiceChannel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || voiceChannel;

            if (!targetVoiceChannel) {
                return message.reply("Lütfen geçerli bir ses kanalı ID'si belirtin.");
            }

            try {
                const connection = getVoiceConnection(message.guild.id);
                if (connection) await connection.destroy();
                const voiceConnection = await joinVoiceChannel({
                    channelId: targetVoiceChannel.id,
                    guildId: message.guild.id,
                    adapterCreator: message.guild.voiceAdapterCreator,
                    selfDeaf: true,
                });

                db.set(`voiceConnection_${message.guild.id}`, {
                    channelId: voiceConnection.joinConfig.channelId,
                    guildId: voiceConnection.joinConfig.guildId,
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
                    db.delete(`voiceConnection_${message.guild.id}`);
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