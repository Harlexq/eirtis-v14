const db = require("nrc.db")

module.exports = async (member) => {
    if (!member.user.bot) return;

    let kanal = db.fetch(`botrol_kanal_${member.guild.id}`)
    let rol = db.fetch(`botrol_rol_${member.guild.id}`)

    if (!kanal) return;
    if (!rol) return;

    member.roles.add(rol)

    const hghg = new EmbedBuilder()
        .setDescription(`${member} İsimli Bot Sunucuya Katıldı Ve Başarılı Bir Şekilde <@&${rol}> İsimli Rol Verildi`)
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