const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldGuild, newGuild) => {
    const logChannelId = db.get(`logChannel_${oldGuild.id}`);
    if (!logChannelId) return;

    const logChannel = oldGuild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Sunucu Güncellendi")
        .setDescription(
            `Sunucu bilgileri güncellendi: \n\n`
            + `${oldGuild.name !== newGuild.name ? `Eski sunucu ismi: **${oldGuild.name}**\nYeni sunucu ismi: **${newGuild.name}**\n` : ""}`
            + `${oldGuild.iconURL() !== newGuild.iconURL() ? `Eski sunucu profil resmi: ${oldGuild.iconURL({ dynamic: true })}\nYeni sunucu profil resmi: ${newGuild.iconURL({ dynamic: true })}\n` : ""}`
            + `${oldGuild.bannerURL() !== newGuild.bannerURL() ? `Eski sunucu kapak fotoğrafı: ${oldGuild.bannerURL()}\nYeni sunucu kapak fotoğrafı: ${newGuild.bannerURL()}\n` : ""}`
        );

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "guildUpdate",
};
