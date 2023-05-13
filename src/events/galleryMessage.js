const db = require('nrc.db');

module.exports = async (message) => {
    if (message.author.bot) return;
    if (!message.guild) return;

    const dbKey = `gallery_${message.guild.id}`;
    const galleryChannelId = await db.get(dbKey);

    if (!galleryChannelId) return;

    if (message.channel.id === galleryChannelId && !message.attachments.size && message.content) {
        message.delete();
        const warning = await message.channel.send({ content: `Galeri kanalında yalnızca resimler paylaşılabilir.` });
        setTimeout(() => {
            warning.delete();
        }, 3000);
    }
}

module.exports.conf = {
    name: "messageCreate",
};
