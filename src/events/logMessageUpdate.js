const { EmbedBuilder, ButtonStyle } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldMessage, newMessage) => {
    const logChannelId = db.get(`logChannel_${oldMessage.guild.id}`);
    if (!logChannelId) return;
    const logChannel = oldMessage.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (newMessage.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("Yellow")
        .setTitle("Mesaj Güncellendi")
        .setDescription(
            `**${oldMessage.author.tag}** tarafından güncellenen mesaj: \n\n`
            + `Eski Mesaj: ${oldMessage.content}\n`
            + `Yeni Mesaj: ${newMessage.content}`
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
};


module.exports.conf = {
    name: "messageUpdate",
};
