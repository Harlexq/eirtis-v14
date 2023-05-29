const db = require("nrc.db");
const { PermissionsBitField } = require('discord.js');

module.exports = async (message) => {

    if (message.author.bot) return;
    if (!message.guild) return;

    const guildId = message.guild.id;
    const guildSettings = db.get(`sunucuayarlar_${guildId}`) || {};
    const capsEngel = guildSettings.capsEngel;

    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    if (message.author.bot) return;

    if (capsEngel) {
        const maxCapsPercentage = 75;

        const messageContent = message.content.replace(/[^a-zA-ZğüşıöçĞÜŞİÖÇ]/g, '');
        const uppercaseCount = messageContent.split('').filter(c => c === c.toUpperCase()).length;
        const lowercaseCount = messageContent.split('').filter(c => c === c.toLowerCase()).length;
        const capsPercentage = uppercaseCount / (uppercaseCount + lowercaseCount) * 100;

        if (capsPercentage > maxCapsPercentage) {
            message.delete();
            message.channel.send(`${message.author} Lütfen Mesajınızda Daha Az Büyük Harf Kullanın`).then(msg => {
                msg.delete({ timeout: 5000 }).catch(console.error);
            });
        }
    }
};

module.exports.conf = {
    name: "messageCreate",
};
