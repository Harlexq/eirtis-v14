const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldChannel, newChannel) => {
    if (!oldChannel.guild) return;

    const logChannelId = db.get(`logChannel_${oldChannel.guild.id}`);

    if (!logChannelId) return;

    const logChannel = oldChannel.guild.channels.cache.get(logChannelId);

    if (oldChannel.name === newChannel.name) return;

    const embed = new EmbedBuilder()
        .setTitle("Kanal Güncellendi")
        .setDescription(
            `**${oldChannel}** adlı kanalın adı **${newChannel}** olarak değiştirildi`
        )
        .setColor("White")
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "channelUpdate",
};
