const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (ban) => {
    const logChannelId = db.get(`logChannel_${ban.guild.id}`);
    if (!logChannelId) return;

    const logChannel = ban.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (ban.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Kullanıcının Banı Açıldı")
        .addFields({ name: "Kullanıcı", value: `${ban.user.tag} (${ban.user.id})` })
        .addFields({ name: "Banı Açan", value: `${ban.executor.tag} (${ban.executor.id})` });

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "guildBanRemove",
};
