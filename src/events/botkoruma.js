const db = require("nrc.db");
const { EmbedBuilder } = require("discord.js");

module.exports = async (member) => {
    const channelID = db.get(`botkoruma_${member.guild.id}`);
    if (!channelID) return;

    const channel = member.guild.channels.cache.get(channelID);
    if (!channel) return;

    if (member.user.bot) {
        await member.ban({ reason: "Sunucuya izinsiz bot eklendi." });

        const embed = new EmbedBuilder()
            .setTitle("Bot koruma")
            .setDescription(`${member} İsimli Bot Sunucuya Eklendi Ve Banlandı`)
            .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true, size: 2048 }) })
            .setColor("White")
            .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
            .setTimestamp()
            .setFooter({ text: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true, size: 2048 }) })


        channel.send({ embeds: [embed] });
    }
};

module.exports.conf = {
    name: "guildMemberAdd",
};