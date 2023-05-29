const { EmbedBuilder } = require("discord.js");
const afk = require("../../schemas/afk");
const moment = require("moment");
require("moment-duration-format");
moment.locale("tr");

module.exports = async (message) => {
    if (message.author.bot || !message.guild) return;
    const data = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
    const embed = new EmbedBuilder()
        .setAuthor({ name: message.guild.name, iconURL: message.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setColor("White")
        .setThumbnail(message.author.avatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp()
        .setFooter({ text: message.author.tag, iconURL: message.author.avatarURL({ dynamic: true, size: 2048 }) });
    if (data) {
        const afkData = await afk.findOne({ guildID: message.guild.id, userID: message.author.id });
        await afk.deleteOne({ guildID: message.guild.id, userID: message.author.id });
        if (message.member.displayName.includes("[AFK]") && message.member.manageable) await message.member.setNickname(message.member.displayName.replace("[AFK]", ""));
        message.reply({ content: `Afk modundan çıktınız. **${moment.duration(Date.now() - afkData.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** süredir AFK'ydınız.` }).then((e) => setTimeout(() => { e.delete(); }, 5000));
    }

    const member = message.mentions.members.first();
    if (!member) return;
    const afkData = await afk.findOne({ guildID: message.guild.id, userID: member.user.id });
    if (!afkData) return;
    embed.setDescription(`${member.toString()} kullanıcısı, \`${afkData.reason}\` sebebiyle, **${moment.duration(Date.now() - afkData.date).format("d [gün] H [saat], m [dakika] s [saniye]")}** önce afk oldu!`);
    message.reply({ embeds: [embed] }).then((e) => setTimeout(() => { e.delete(); }, 10000));
};

module.exports.conf = {
    name: "messageCreate",
};
