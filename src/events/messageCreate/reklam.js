const db = require("nrc.db")
const settings = require("../../configs/settings.json");

module.exports = async (message) => {

    if (!message.guild || message.author.bot) return;

    const enabled = db.fetch(`reklam_${message.guild.id}`);
    if (!enabled) return;

    const reklamengel = settings.reklam;
    const content = message.content.toLowerCase();

    for (let i = 0; i < reklamengel.length; i++) {
        if (content.includes(reklamengel[i])) {
            message.delete();
            message.channel.send(
                `${message.author} Lütfen Reklam Yapmayınız Reklam Engelleme Sistemi Açık`
            );
            return;
        }
    }
};

module.exports.conf = {
    name: "messageCreate",
};