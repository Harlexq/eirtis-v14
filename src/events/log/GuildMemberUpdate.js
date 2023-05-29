const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldMember, newMember) => {
    const logChannelId = db.get(`logChannel_${newMember.guild.id}`);
    if (!logChannelId) return;

    const logChannel = newMember.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    if (newMember.user.bot) return;

    if (oldMember.roles.cache.size < newMember.roles.cache.size) {
        const addedRoles = newMember.roles.cache.filter(
            (role) => !oldMember.roles.cache.has(role.id)
        );

        const addedRolesText = addedRoles.map((role) => role.toString()).join(", ");

        if (addedRolesText) {
            const embed = new EmbedBuilder()
                .setColor("#00ff00")
                .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
                .setDescription(`Kullanıcıya yeni roller verildi: \n${addedRolesText}`)
                .addFields({ name: "Rolleri Verilen Kullanıcı: ", value: oldMember.user.tag })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }

    if (oldMember.roles.cache.size > newMember.roles.cache.size) {
        const removedRoles = oldMember.roles.cache.filter(
            (role) => !newMember.roles.cache.has(role.id)
        );

        const removedRolesText = removedRoles.map((role) => role.toString()).join(", ");

        if (removedRolesText) {
            const embed = new EmbedBuilder()
                .setColor("#ff0000")
                .setAuthor({ name: newMember.user.tag, iconURL: newMember.user.displayAvatarURL() })
                .setDescription(`Kullanıcının rolleri alındı: \n${removedRolesText}`)
                .addFields({ name: "Rolleri Alan Kullanıcı: ", value: oldMember.user.tag })
                .setTimestamp();

            logChannel.send({ embeds: [embed] });
        }
    }
};

module.exports.conf = {
    name: "guildMemberUpdate",
};
