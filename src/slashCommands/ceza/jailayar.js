const { SlashCommandBuilder } = require('discord.js');;
const db = require("nrc.db");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("jailayar")
        .setDescription("Jail Sistemini Ayarla")
        .addSubcommand(subcommand =>
            subcommand
                .setName("rol")
                .setDescription("Jail atılan kişiye verilecek rolü belirtir.")
                .addRoleOption(option => option.setName("rol").setDescription("Jail rolünü belirtin.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("jail-yetkilisi")
                .setDescription("Jail atabilecek rolü ayarlar.")
                .addRoleOption(option => option.setName("rol").setDescription("Jail yetkilisi rolünü belirtin.").setRequired(true))
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName("log")
                .setDescription("Jail atılınca logun tutulacağı yeri ayarlar.")
                .addChannelOption(option => option.setName("kanal").setDescription("Jail log kanalını belirtin.").setRequired(true))
        ),
    async execute(interaction, client, embed) {
        if (!interaction.member.permissions.has("ADMINISTRATOR")) return interaction.reply({ content: "Bu komudu kullanabilmek için sunucuyu yönet yetkisine sahip olmanız gerekmekte.", ephemeral: true });

        const subcommand = interaction.options.getSubcommand();

        if (subcommand === "rol") {
            const rol = interaction.options.getRole("rol");

            db.set(`jail_rol_${interaction.guildId}`, rol.id);

            interaction.reply({ content: `Jail atıldığında kişinin tüm rollerini alıp ${rol} isimli rolü vereceğim.`, ephemeral: true });
        }

        if (subcommand === "jail-yetkilisi") {
            const rol = interaction.options.getRole("rol");

            db.set(`jail_yetkilirol_${interaction.guildId}`, rol.id);

            interaction.reply({ content: `Jail yetkilisi ${rol} olarak ayarlandı.`, ephemeral: true });
        }

        if (subcommand === "log") {
            const kanal = interaction.options.getChannel("kanal");

            db.set(`jail_kanal_${interaction.guildId}`, kanal.id);

            interaction.reply({ content: `Jail atıldığında artık ${kanal} isimli kanalda log tutucam.`, ephemeral: true });
        }
    },
};