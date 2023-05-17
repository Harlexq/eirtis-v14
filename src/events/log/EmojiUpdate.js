const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldEmoji, newEmoji) => {
    const logChannelId = db.get(`logChannel_${oldEmoji.guild.id}`);
    if (!logChannelId) return;

    const logChannel = oldEmoji.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Emoji Güncellendi")
        .setDescription(
            `${oldEmoji} **${oldEmoji.name}** adlı emoji **${oldEmoji.guild.name}** sunucusunda güncellendi:\n\nEski Hali: ${oldEmoji} = ${oldEmoji.name}\nYeni Hali: ${newEmoji} = ${newEmoji.name}`
        );

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "emojiUpdate",
};
