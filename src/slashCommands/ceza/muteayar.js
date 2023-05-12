const { SlashCommandBuilder } = require('discord.js');;
const db = require("nrc.db");
const settings = require("../../configs/settings.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("muteayar")
        .setDescription("Mute Sistemini Ayarla")
        .addSubcommand(subcommand =>
            subcommand
                .setName("rol")
                .setDescription("Mute atılan kişiye verilecek rolü belirtir.")
                .addRoleOption(option => option.setName("rol").setDescription("Mute rolünü belirtin.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("mute-yetkilisi")
                .setDescription("Mute atabilecek rolü ayarlar.")
                .addRoleOption(option => option.setName("rol").setDescription("Mute yetkilisi rolünü belirtin.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("log")
                .setDescription("Mute atılınca logun tutulacağı yeri ayarlar.")
                .addChannelOption(option => option.setName("kanal").setDescription("Mute log kanalını belirtin.").setRequired(true))
        ),
    async execute(interaction, client, embed) {
        const member = interaction.member;
        const guild = interaction.guild;

        if (!member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "Bu Komudu Kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.", ephemeral: true });

        const subCommand = interaction.options.getSubcommand();
        if (subCommand == "rol") {
            const rol = interaction.options.getRole("rol");

            if (!rol) return interaction.reply({ content: "Lütfen bir **Mute** rolü belirleyiniz.", ephemeral: true });

            db.set(`mute_rol_${guild.id}`, rol.id);

            interaction.reply({ content: `Mute atıldığında kişinin tüm rollerini alıp ${rol} isimli rolü vericeğim.`, ephemeral: true });
        }

        if (subCommand == "mute-yetkilisi") {
            const rol = interaction.options.getRole("rol");

            if (!rol) return interaction.reply({ content: "Lütfen bir **Mute Yetkilisi** rolü belirleyiniz.", ephemeral: true });

            db.set(`mute_yetkilirol_${guild.id}`, rol.id);

            interaction.reply({ content: `Mute Yetkilisi ${rol} Olarak Ayarlandı`, ephemeral: true });
        }

        if (subCommand == "log") {
            const kanal = interaction.options.getChannel("kanal");

            if (!kanal) return interaction.reply({ content: "Lütfen bir **Mute Log Kanalı** belirleyiniz.", ephemeral: true });

            db.set(`mute_kanal_${guild.id}`, kanal.id);

            interaction.reply({ content: `Mute Atılınca Log Kanalı ${kanal} Olarak Ayarlandı.`, ephemeral: true });
        }

        if (!subCommand) {
            interaction.reply({
                embeds: [embed.setDescription(`
            **${settings.prefix}mute-ayar rol** : Mute atılan kişiye verilecek rolü belirtlersiniz.
            **${settings.prefix}mute-ayar log** : Mute atılınca logun tutulacağı yeri Ayarlarsınız.
            **${settings.prefix}mute-ayar mute-yetkilisi** : Mute atabilecek rolü Ayarlarsınız.
            `)]
            });
        }
    },
};