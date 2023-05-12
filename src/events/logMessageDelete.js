const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (message) => {
    const logChannelId = db.get(`logChannel_${message.guild.id}`);
    if (!logChannelId) return;

    const logChannel = message.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (message.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Mesaj Silindi")
        .setDescription(
            `**${message.author.tag}** tarafından silinen mesaj: \n\n`
            + `${message.content}`
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "messageDelete",
};
