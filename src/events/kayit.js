const db = require("nrc.db");

module.exports = async (member) => {

    const kayıtsızRoleId = db.get(`kayıt_kayıtsız_rol_${member.guild.id}`);
    if (!kayıtsızRoleId) return;
    const kayıtsızİsim = db.fetch(`kayıt_kayıtsız_isim_${member.guild.id}`) || '• İsim | Yaş';

    await member.roles.add(kayıtsızRoleId);
    await member.setNickname(kayıtsızİsim);

};

module.exports.conf = {
    name: "guildMemberAdd",
};
