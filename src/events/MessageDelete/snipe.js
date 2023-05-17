const db = require("nrc.db")

module.exports = async (message) => {

    if (message.partial) return;
    if (message.author.bot) return;

    const snipes = db.get(`${message.channel.id}_snipes`) || [];
    if (snipes.length >= 10) {
        snipes.pop();
    }
    snipes.unshift({
        content: message.content,
        author: message.author,
        createdAt: message.createdAt,
        attachments: Object.values(message.attachments),
    });
    db.set(`${message.channel.id}_snipes`, snipes);
};

module.exports.conf = {
    name: "messageDelete",
};
