const db = require("nrc.db")

module.exports = async (member, client) => {
    let kontrol1 = db.fetch(`sayaç_log_${member.guild.id}`)
    let kontrol2 = db.fetch(`sayaç_hedef_${member.guild.id}`)

    if (!kontrol1) return;

    if (kontrol2) {
        let kalan = kontrol2 - member.guild.memberCount

        if (kalan === 0) {
            member.guild.channels.cache.get(kontrol1).send(`Yeni Biri Katıldı, ${member} Hoşgeldin. Seninle beraber **${member.guild.memberCount}** Kişiyiz Sayaç Hedefimize ulaştık.`)
            db.delete(`sayaç_hedef_${member.guild.id}`)
        } else {
            member.guild.channels.cache.get(kontrol1).send(`Yeni Biri Katıldı, ${member} Hoşgeldin. Seninle beraber **${member.guild.memberCount}** Kişiyiz Sayaç Hedefimize **${kalan}** kişi kaldı.`)
        }
    } else {
        member.guild.channels.cache.get(kontrol1).send(`Yeni Biri Katıldı, ${member} Hoşgeldin. Seninle beraber **${member.guild.memberCount}** Kişiyiz Sayaç Hedefimize şu anda bulunmamaktadır..`)
    }
};

module.exports.conf = {
    name: "guildMemberAdd",
};
