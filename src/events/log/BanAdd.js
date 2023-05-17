const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (ban) => {
    const logChannelId = db.get(`logChannel_${ban.guild.id}`);
    if (!logChannelId) return;

    const logChannel = ban.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const fetchBan = await ban.guild.fetchBan(ban.user.id);

    if (ban.author.bot) return;

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Kullanıcı Banlandı")
        .addFields({ name: "Kullanıcı", value: `${ban.user.tag} (${ban.user.id})` })
        .addFields({ name: "Banlayan", value: `${fetchBan.executor.tag} (${fetchBan.executor.id})` })
        .addFields({ name: "Sebep", value: `${fetchBan.reason || "Neden belirtilmemiş."}` });

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "guildBanAdd",
};
