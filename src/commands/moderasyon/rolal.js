const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["rol-al"],
        name: "rolal",
        help: "Kullanıcıdan Etiketlediğiniz Rolü Alır",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.reply("Rolleri Yönet Yetkiniz Bulunmamakta.")

        let user = message.mentions.users.first();
        let rol = message.mentions.roles.first();

        if (!user) return message.reply("Lütfen Rolün Alıncağı Kişiyi Belirtiniz.")
        if (!rol) return message.reply("Lütfen Alınacak Rolü Belirtiniz.")


        message.guild.members.cache.get(user.id).roles.remove(rol)

        message.reply({ embeds: [embed.setDescription(`${user} İsimli Kişiden ${rol} İsimli Rol Alındı`)] })


    },
}