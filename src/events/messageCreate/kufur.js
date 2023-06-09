const db = require("nrc.db");
const settings = require("../../configs/settings.json");

module.exports = async (message) => {
    if (!message.guild || message.author.bot) return;

    const enabled = db.fetch(`küfür_${message.guild.id}`);
    if (!enabled) return;

    const küfürengel = settings.küfür;
    const content = message.content.toLowerCase();

    for (let i = 0; i < küfürengel.length; i++) {
        if (content.includes(küfürengel[i])) {
            message.delete().catch(console.error);
            message.channel.send(`${message.author} Lütfen Küfür Etmeyin. Küfür Engelleme Sistemi Açık`).then(msg => {
                msg.delete({ timeout: 5000 }).catch(console.error);
            });
            return;
        }
    }
};

module.exports.conf = {
    name: "messageCreate",
};
