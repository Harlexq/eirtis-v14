const settings = require("../../configs/settings.json");
const { ActivityType } = require("discord.js");
const { joinVoiceChannel } = require('@discordjs/voice');
const db = require("nrc.db");
const client = global.client;

module.exports = async () => {

    setInterval(() => {
        const eirtis = settings.botDurum[Math.floor(Math.random() * settings.botDurum.length)];
        client.user.setPresence({
            activities: [{
                name: eirtis,
                type: ActivityType.Streaming,
                url: "https://www.twitch.tv/harlexq"
            }]
        });
    }, 5000);

    // client.guilds.cache.forEach((guild) => {
    //     if (guild.memberCount < 20) {
    //         guild.leave().then(() => {
    //             console.log(`Üye sayısı 20'den az olduğu için ${guild.name}'den ayrıldı.`);
    //         }).catch((error) => {
    //             console.error(`${guild.name}'den ayrılma hatası:`, error);
    //         });
    //     }
    // });

    const kulsayi = []
    client.guilds.cache.forEach((item, i) => {
        kulsayi.push(item.memberCount)
    });
    var toplamkulsayi = 0
    for (var i = 0; i < kulsayi.length; i++) {
        if (isNaN(kulsayi[i])) {
            continue;
        }

        toplamkulsayi += Number(kulsayi[i])
    }

    console.log(" ")
    console.log("Bot İstatistiği")
    console.log(`Sunucu Sayısı: ${client.guilds.cache.size}`)
    console.log(`Kullanıcı Sayısı: ${toplamkulsayi}`)
    console.log(`Emoji Sayısı: ${client.emojis.cache.size}`)
    console.log(`Kanal Sayısı: ${client.channels.cache.size}`)

    const guilds = client.guilds.cache;

    guilds.forEach(guild => {
        const voiceConnectionData = db.get(`voiceConnection_${guild.id}`);
        if (!voiceConnectionData) return;

        const voiceChannel = guild.channels.cache.get(voiceConnectionData.channelId);
        if (!voiceChannel) return;

        try {
            joinVoiceChannel({
                channelId: voiceChannel.id,
                guildId: guild.id,
                adapterCreator: guild.voiceAdapterCreator,
            });
        } catch (error) {
            console.error(`Ses kanalına bağlanırken bir hata oluştu: ${error}`);
        }
    });

    client.guilds.cache.forEach(guild => {
        const prefix = db.get(`prefix_${guild.id}`);
        if (prefix) {
            client.guildPrefixes.set(guild.id, prefix);
        }
    });

}

module.exports.conf = {
    name: "ready"
}
