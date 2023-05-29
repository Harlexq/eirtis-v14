const db = require("nrc.db");
const settings = require("../../configs/settings.json");
const { PermissionsBitField } = require('discord.js');

module.exports = async (message) => {
    if (!message.guild || message.author.bot) return;

    const enabled = db.fetch(`reklam_${message.guild.id}`);
    if (!enabled) return;

    const reklamengel = settings.reklam;
    const content = message.content.toLowerCase();

    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return;

    if (message.author.bot) return;

    for (let i = 0; i < reklamengel.length; i++) {
        if (content.includes(reklamengel[i])) {
            message.delete();
            message.channel.send(
                `${message.author} Lütfen Reklam Yapmayınız, Reklam Engelleme Sistemi Açık`
            ).then(msg => {
                msg.delete({ timeout: 5000 }).catch(console.error);
            });
            return;
        }
    }
};

module.exports.conf = {
    name: "messageCreate",
};
