const settings = require("../configs/settings.json");
const { ActivityType } = require("discord.js");
const client = global.client;
module.exports = () => {

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

    client.guilds.cache.forEach((guild) => {
        if (guild.memberCount < 20) {
            guild.leave().then(() => {
                console.log(`Üye sayısı 20'den az olduğu için ${guild.name}'den ayrıldı.`);
            }).catch((error) => {
                console.error(`${guild.name}'den ayrılma hatası:`, error);
            });
        }
    });

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

}
module.exports.conf = {
    name: "ready"
}
