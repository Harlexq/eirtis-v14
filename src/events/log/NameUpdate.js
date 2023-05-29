const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldMember, newMember) => {
    const logChannelId = db.get(`logChannel_${newMember.guild.id}`);
    if (!logChannelId) return;

    const logChannel = newMember.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (newMember.user.bot) return;

    if (oldMember.displayName !== newMember.displayName) {
        const embed = new EmbedBuilder()
            .setColor("#ffff00")
            .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
            .setDescription("Kullanıcının ismi değiştirildi")
            .addFields({ name: "Önceki İsim", value: oldMember.displayName })
            .addFields({ name: "Yeni İsim", value: newMember.displayName })
            .addFields({ name: "İsmi Değiştiren", value: newMember.guild.members.cache.get(newMember.id).user.tag })
            .setTimestamp();

        logChannel.send({ embeds: [embed] });
    }
};

module.exports.conf = {
    name: "guildMemberUpdate",
};