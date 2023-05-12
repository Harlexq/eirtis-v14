
const db = require("nrc.db")
const settings = require("../configs/settings.json");

module.exports = async (message) => {

    if (!message.guild) return;

    let prefix = (await db.fetch(`prefix_${message.guild.id}`)) || settings.prefix;
    let kullanıcı = message.mentions.users.first() || message.author;
    let afkdkullanıcı = await db.fetch(`afk_${message.author.id}`);
    let afkkullanıcı = await db.fetch(`afk_${kullanıcı.id}`);
    let sebep = afkkullanıcı;
    if (message.author.bot) return;
    if (message.content.includes(`${prefix}afk`)) return;
    if (message.content.includes(`<@${kullanıcı.id}>`)) {
        if (afkdkullanıcı) {
            message.reply(
                `${settings.emoji.green} <@${message.author.id}> Sohbete yazı yazdığın için afk modundan çıkış yapıldı.`
            );
            db.delete(`afk_${message.author.id}`);
        }
        if (afkkullanıcı)
            return message.reply(
                `${message.author}\`${kullanıcı.tag}\` şu anda AFK. \n Sebep : \`${sebep}\``
            );
    }
    if (!message.content.includes(`<@${kullanıcı.id}>`)) {
        if (afkdkullanıcı) {
            message.reply(
                `${settings.emoji.green} <@${message.author.id}> Sohbete yazı yazdığın için afk modundan çıkış yapıldı.`
            );
            db.delete(`afk_${message.author.id}`);
        }
    }
};

module.exports.conf = {
    name: "messageCreate",
};
