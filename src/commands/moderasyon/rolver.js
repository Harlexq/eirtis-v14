const { PermissionsBitField } = require('discord.js');

module.exports = {
    conf: {
        aliases: ["rol-ver"],
        name: "rolver",
        help: "Etiketlediğiniz Kullanıcıdan Etiketlediğiniz Rolü Verir",
        category: "moderasyon",
    },

    run: async (client, message, args, embed) => {
        if (!message.guild) return;

        if (!message.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) return message.reply("Rolleri Yönet Yetkiniz Bulunmamakta.")

        let user = message.mentions.users.first();
        let rol = message.mentions.roles.first();

        if (!user) return message.reply("Lütfen Rolün Verileceği Kişiyi Belirtiniz.")
        if (!rol) return message.reply("Lütfen Verilecek Rolü Belirtiniz.")


        message.guild.members.cache.get(user.id).roles.add(rol)

        message.reply({ embeds: [embed.setDescription(`${user}, isimli kişiye ${rol} isimli rol verildi.`)] })

    },
}