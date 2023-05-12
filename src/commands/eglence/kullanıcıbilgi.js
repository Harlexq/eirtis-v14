const moment = require("moment");
require("moment-duration-format")
moment.locale("tr")

module.exports = {
    conf: {
        aliases: ["kb", "kullanıcı-bilgi", "kullanıcıinfo", "kullanıcı-info"],
        name: "kullanıcıbilgi",
        help: "Etiketlenen Kullanıcının Veya Sizin Bilgilerinizi Gösterir",
        category: "eglence",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        let üye = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        if (üye.user.bot) return;

        const roles = üye.roles.cache.filter(role => role.id !== message.guild.id).sort((a, b) => b.position - a.position).map(role => `<@&${role.id}>`);
        const rolleri = []
        if (roles.length > 6) {
            const lent = roles.length - 6
            let itemler = roles.slice(0, 6)
            itemler.map(x => rolleri.push(x))
            rolleri.push(`${lent} daha...`)
        } else {
            roles.map(x => rolleri.push(x))
        }
        const members = [...message.guild.members.cache.filter(x => !x.user.bot).values()].sort((a, b) => a.joinedTimestamp - b.joinedTimestamp);
        let member = message.guild.members.cache.get(üye.id)

        message.reply({
            embeds: [embed.addFields({
                name: `Kullanıcı Bilgisi`, value: `
**__\`Hesap Adı:\`__** ${üye}
**__\`Kullanıcı ID:\`__** **\`${üye.id}\`**
**__\`Kuruluş Tarihi:\`__** <t:${Math.floor(member.user.createdTimestamp / 1000)}:R>
`},
                {
                    name: `Sunucu Bilgisi`, value: `
**__\`Sunucu İsmi:\`__**: **\`${message.guild.name}\`**
**__\`Katılım Tarihi:\`__** <t:${Math.floor(üye.joinedAt / 1000)}:R>
**__\`Katılım Sırası:\`__** ${(message.guild.members.cache.filter(a => a.joinedTimestamp <= üye.joinedTimestamp).size).toLocaleString()}/${(message.guild.memberCount).toLocaleString()}
`})]
        })
    },
}
