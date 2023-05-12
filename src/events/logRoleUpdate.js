const { EmbedBuilder } = require("discord.js");
const db = require("nrc.db");

module.exports = async (oldRole, newRole) => {
    const logChannelId = db.get(`logChannel_${oldRole.guild.id}`);
    if (!logChannelId) return;

    const logChannel = oldRole.guild.channels.cache.get(logChannelId);
    if (!logChannel) return;

    const changes = [];

    if (oldRole.name !== newRole.name) {
        changes.push(`\`İsim:\` \`${oldRole.name}\` **->** \`${newRole.name}\``);
    }

    if (oldRole.hexColor !== newRole.hexColor) {
        changes.push(
            `\`Renk:\` \`#${oldRole.hexColor}\` **->** \`#${newRole.hexColor}\``
        );
    }

    if (oldRole.mentionable !== newRole.mentionable) {
        changes.push(
            `\`Bahsetme:\` \`${oldRole.mentionable}\` **->** \`${newRole.mentionable}\``
        );
    }

    const oldPermissions = oldRole.permissions.toArray();
    const newPermissions = newRole.permissions.toArray();
    const addedPermissions = newPermissions.filter((perm) => !oldPermissions.includes(perm));
    const removedPermissions = oldPermissions.filter((perm) => !newPermissions.includes(perm));

    if (addedPermissions.length || removedPermissions.length) {
        const addedPermsString = addedPermissions
            .map((p) => `\`${p}\``)
            .join(", ");
        const removedPermsString = removedPermissions
            .map((p) => `\`${p}\``)
            .join(", ");

        if (addedPermissions.length && removedPermissions.length) {
            changes.push(
                `\`İzinler:\` Eklendi: ${addedPermsString} | Kaldırıldı: ${removedPermsString}`
            );
        } else if (addedPermissions.length) {
            changes.push(`\`İzinler:\` Eklendi: ${addedPermsString}`);
        } else {
            changes.push(`\`İzinler:\` Kaldırıldı: ${removedPermsString}`);
        }
    }

    const embed = new EmbedBuilder()
        .setColor("White")
        .setTitle("Rol Güncellendi")
        .setDescription(
            `**${oldRole.name}** İsimli Rol Güncellendi.\n\n` +
            `${changes.join("\n")}`
        )
        .setTimestamp();

    logChannel.send({ embeds: [embed] });
};

module.exports.conf = {
    name: "roleUpdate",
};
