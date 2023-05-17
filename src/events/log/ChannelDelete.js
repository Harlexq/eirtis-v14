const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (channel) => {
    if (!channel.guild) return;

    const logChannelId = await db.get(`logChannel_${channel.guild.id}`);
    if (!logChannelId) return;

    const logChannel = channel.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Kanal Silindi")
        .setAuthor(channel.guild.name, channel.guild.iconURL({ dynamic: true }))
        .setTimestamp();

    if (channel.type === "GUILD_CATEGORY") {
        embed.setTitle(`Kategori Silindi: ${channel.name}`);

        if (channel.permissionOverwrites.size > 0) {
            const overwrites = channel.permissionOverwrites.map((overwrite) => {
                return {
                    id: overwrite.id,
                    type: overwrite.type,
                    allow: overwrite.allow.toArray(),
                    deny: overwrite.deny.toArray(),
                };
            });

            embed.addFields({ name: "İzin Üstünlükleri", value: `\`\`\`${JSON.stringify(overwrites)}\`\`\`` });
        }
    } else if (channel.type === "GUILD_TEXT") {
        embed.setTitle(`Metin Kanalı Silindi: ${channel.name}`);
        embed.addFields({ name: "Kategori", value: channel.parent ? channel.parent.name : "Yok" });
    } else if (channel.type === "GUILD_VOICE") {
        embed.setTitle(`Ses Kanalı Silindi: ${channel.name}`);
        embed.addFields({ name: "Kategori", value: channel.parent ? channel.parent.name : "Yok" });
        embed.addFields({ name: "Bit Hızı", value: `${channel.bitrate}bps` });
        embed.addFields({ name: "Kullanıcı Limiti", value: channel.userLimit ? channel.userLimit : "Limitsiz" });
    } else if (channel.type === "GUILD_STAGE_VOICE") {
        embed.setTitle(`Sahne Kanalı Silindi: ${channel.name}`);
        embed.addFields({ name: "Kategori", value: channel.parent ? channel.parent.name : "Yok" });
        embed.addFields({ name: "Bit Hızı", value: `${channel.bitrate}bps` });
        embed.addFields({ name: "Kullanıcı Limiti", value: channel.userLimit ? channel.userLimit : "Limitsiz" });
    } else if (channel.type === "GUILD_PUBLIC_THREAD") {
        embed.setTitle(`Genel Konuşma Kanalı Silindi: ${channel.name}`);
    } else if (channel.type === "GUILD_PRIVATE_THREAD") {
        embed.setTitle(`Özel Konuşma Kanalı Silindi: ${channel.name}`);
    } else if (channel.type === "GUILD_NEWS_THREAD") {
        embed.setTitle(`Haberler Kanalı Silindi: ${channel.name}`);
    } else if (channel.type === "GUILD_STORE") {
        embed.setTitle(`Mağaza Kanalı Silindi: ${channel.name}`);
    }

    if (channel.deleted) {
        embed.addFields({ name: "Neden Silindi", value: "Bilinmiyor" });
    } else {
        embed.addFields({ name: "Neden Silindi", value: channel.name });
    }

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "channelDelete",
};
