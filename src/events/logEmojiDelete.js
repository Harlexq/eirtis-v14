const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (emoji) => {
    const logChannelId = db.get(`logChannel_${emoji.guild.id}`);
    if (!logChannelId) return;

    const logChannel = emoji.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (emoji.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Emoji Silindi")
        .setDescription(
            `${emoji} **${emoji.name}** adlı emoji **${emoji.guild.name}** sunucusundan silindi.`
        );

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "emojiDelete",
};
