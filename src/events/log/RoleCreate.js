const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (role) => {
    const logChannelId = db.get(`logChannel_${role.guild.id}`);
    if (!logChannelId) return;

    const logChannel = role.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const permissions = role.permissions.toArray().join(", ") || "Belirtilmemiş";
    const embed = new EmbedBuilder()
        .setColor("Green")
        .setTitle("Rol Oluşturuldu")
        .setDescription(`\`${role.name}\` adlı rol oluşturuldu`)
        .addFields(
            { name: "Rol ID'si", value: role.id, inline: true },
            { name: "Renk", value: role.hexColor, inline: true },
            {
                name: "İzinler",
                value: permissions,
                inline: true,
            }
        );

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "roleCreate",
};
