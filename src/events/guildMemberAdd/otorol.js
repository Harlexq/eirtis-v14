const db = require("nrc.db")
const { EmbedBuilder } = require("discord.js")

module.exports = async (member) => {

    let kanal = db.fetch(`otorol_kanal_${member.guild.id}`)
    let rol = db.fetch(`otorol_rol_${member.guild.id}`)

    if (!kanal) return;
    if (!rol) return;

    member.roles.add(rol)

    const hghg = new EmbedBuilder()
        .setDescription(`${member} Sunucuya Katıldı Ve Başarılı Bir Şekilde <@&${rol}> İsimli Rol Verildi`)
        .setColor("White")
        .setAuthor({ name: member.guild.name, iconURL: member.guild.iconURL({ dynamic: true, size: 2048 }) })
        .setThumbnail(member.user.avatarURL({ dynamic: true, size: 2048 }))
        .setTimestamp()
        .setFooter({ text: member.user.tag, iconURL: member.user.avatarURL({ dynamic: true, size: 2048 }) })
    member.client.channels.cache.get(kanal).send({ embeds: [hghg] })
};

module.exports.conf = {
    name: "guildMemberAdd",
};